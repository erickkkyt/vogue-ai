# Vogue AI 功能实现逻辑

> **当前项目状态**: 本文记录 Vogue AI 当前功能主线，重点解释首页 prompt gallery、`/app` 工作台、effects API、effect 元数据、adapter、credit ledger 和 provider 如何共同运行。
> **文档结构**: 先写当前功能真相，再写后续补齐方向；不把未完成能力写成已上线。

## 当前项目状态

### 1. 当前功能架构主线

Vogue AI 当前统一走这条链路：

```text
首页 Prompt Gallery
-> /app 图片生成工作台
-> /api/effects/precheck 或 /api/effects/generate
-> effect 元数据
-> credit ledger
-> provider adapter
-> 第三方模型 API
-> generation_history
-> /app 结果展示或 /assets 历史查看
```

当前真相来源：

- 首页：`src/app/page.tsx`
- gallery：`src/components/prompts/VoguePromptGallery.tsx`
- prompt 数据：`src/lib/prompts.ts`
- 工作台：`src/components/app/ImageWorkspace.tsx`
- 模型 registry：`src/lib/effects/workspace-models.ts`
- effect 配置：`src/lib/effects/effects.ts`
- 积分估算：`src/lib/effects/pricing.ts`
- 生成 API：`src/app/api/effects/**`
- provider adapter：`src/lib/adapters/**`
- 数据库：`src/db/schema.ts`

### 2. 首页 gallery 如何进入生成链路

首页从 `getFeaturedPromptEntries(40)` 读取 prompt 数据，并渲染 `VoguePromptGallery`。

每张卡片提供两个动作：

- `Copy`: 复制 prompt。
- `Use Prompt`: 跳转 `/app?target=image&model={modelId}&prompt={prompt}`。

当前 gallery 不是纯展示页，而是低摩擦生成入口。这个方向保留了 Vogue AI 品牌词，同时把产品价值点从旧工具页转成“看图例 -> 复用 prompt -> 生成图片”。

### 3. `/app` 当前负责什么

`src/components/app/ImageWorkspace.tsx` 当前负责：

- 从 URL 读取 `model` 和 `prompt`
- 按 `IMAGE_WORKSPACE_MODELS` 初始化模型
- 维护 prompt、参考图、image number、aspect ratio、resolution、quality 状态
- 使用 gptimg 风格的 6000 字 GPT Image 2 prompt 输入框
- 按模型 media schema 管理最多 6 个参考图槽位
- 上传本地参考图到 R2/对象存储，再把稳定 URL 传给生成 API
- 用 BetterAuth client 读取 session
- 未登录时跳转 `/login?callbackUrl=...`
- 生成前调用 `/api/effects/precheck` 校验积分
- 登录后提交 `/api/effects/generate`
- 后台轮询 `/api/effects/status`
- 拉取 `/api/assets/recent` 展示当前任务和近期资产
- 展示、复用 prompt、复用生成图作为参考图、下载生成资产
- 通过 `persistGenerationOutputAssets` 把 provider 输出尽量持久化到 R2 并写入 `user_asset` / `generation_asset_link`

当前 `/app` 已经从第一版轻量表单升级为对齐 gptimg 的图片工作台。暂不负责视频/音频输入、完整任务队列页、批量资产管理和 prompt 详情页。

### 4. 模型 registry

当前可选图片模型定义在：

- `src/lib/effects/workspace-models.ts`
- `src/lib/effects/effects.ts`

当前模型：

| workspace id | effectId | provider | 默认积分 |
| --- | ---: | --- | ---: |
| `gptimage2` | 16 | `evolink.gpt-image-2` | 8 |
| `gptimage15` | 15 | `kie.gpt-image-1.5` | 4 |
| `nanobanana2` | 4 | `kie.nano-banana-2` | 6 |
| `nanobanana` | 5 | `kie.nano-banana` | 4 |
| `nanobananapro` | 6 | `kie.nano-banana-pro` | 8 |

维护原则：

- 新增模型时必须同步 `effect`、adapter、workspace registry、UI 参数和 pricing。
- 页面不应该硬编码 provider 细节。
- 预检和扣费应以 `effect.credit` 与 `estimateGenerationCredits` 为准。

### 5. 积分估算与扣费

积分估算文件：

- `src/lib/effects/pricing.ts`

当前规则：

- 基础积分来自 `effect.credit`
- `n` 最多按 4 张图放大
- `wmOutputQuality === '4k'` 时 2 倍
- `input.quality === 'high'` 时 1.5 倍
- 最终 `Math.ceil`

扣费流程：

1. `/api/effects/generate` 校验登录、prompt 和 effect。
2. 估算 required credits。
3. 检查余额。
4. 插入 `generation_history` pending。
5. `reserveCredits` 先扣余额并写 reserve 交易。
6. provider 创建任务。
7. 成功提交后 `confirmReservedCredits` 把 reserve 改为 consume。
8. provider 创建失败或后续失败时 `releaseReservedCredits` 退款。

### 6. provider adapter

adapter 工厂：

- `src/lib/adapters/adapter-factory.ts`

当前映射：

- `evolink.gpt-image-2` -> `EvolinkImageAdapter`
- `kie.*` -> `KieMarketAdapter`
- `302.gpt-image-2` -> `Ai302ImageAdapter`
- 其他 provider -> 显式报错，不再回退 mock 结果

当前 provider 环境变量：

- `EVOLINK_API_KEY`
- `KIE_API_KEY`

### 7. 当前功能缺口

当前已具备 gptimg 风格的图片生成主链路，但还需要继续补齐：

- provider 任务超时处理
- `/assets` 结果预览与重新使用 prompt 继续增强
- 旧 SEO 工具页到新版 `/app` 的入口统一
- 后续如增加视频/音频模型，再扩展同一套 workspace media schema
