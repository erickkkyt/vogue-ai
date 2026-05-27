# Vogue AI Prompt Gallery 与内容资产

> **当前项目状态**: 本文记录 Vogue AI 首页 prompt gallery 的数据来源、展示逻辑、与 `/app` 的连接方式，以及图片资产/R2 的当前边界。

## 当前项目状态

### 1. Gallery 定位

Vogue AI 首页当前定位为：

```text
AI Prompt Gallery + Image Generator
```

这不是纯 prompt 列表，也不是旧的单点工具页。它的核心动作是：

```text
看见示例图
-> 理解 prompt 结构
-> 复制或一键带入 /app
-> 用 GPT Image / Nano Banana 生成自己的图片
```

这个结构参考了 gptimg 的 prompts 资源和 MeiGen 类 gallery 产品的低 time-to-value 逻辑。

### 2. 当前数据来源

当前 prompt 数据文件：

- `src/lib/generated/awesome-gptimage2-prompts.json`

读取封装：

- `src/lib/prompts.ts`

当前 entry 类型：

```ts
export type VoguePromptEntry = {
  id: string;
  title: string;
  description?: string;
  images: string[];
  prompt: string;
  modelId?: string;
  authorName?: string;
  authorHandle?: string;
  publishedLabel?: string;
  sourceUrl?: string;
};
```

当前首页调用：

- `getFeaturedPromptEntries(40)`

规则：

- 必须有 `prompt`
- 必须有至少一张图片
- 第一版取前 40 条

### 3. Gallery UI

组件：

- `src/components/prompts/VoguePromptGallery.tsx`

当前卡片信息：

- 示例图
- model label
- title
- author/handle
- prompt 摘要
- `Use Prompt`
- `Copy`
- source link

`Use Prompt` 跳转：

```text
/app?target=image&model={modelId || gptimage2}&prompt={prompt}
```

### 4. 图片资产当前状态

当前 prompt JSON 中的 `images` 是直接被前端 `<img src=...>` 使用的 URL。第一版没有把这些图片重新写入 Vogue 自己的 R2 bucket。

当前状态：

- gallery 可以直接渲染远程图片。
- `/app` 本地参考图先走 `/api/storage/presign` 和 `/api/storage/complete` 上传到 R2/对象存储。
- `/app` 生成结果优先通过 `persistGenerationOutputAssets` 复制到 R2/对象存储。
- `user_asset` 和 `generation_asset_link` 已用于记录输入/输出资产，`/api/assets/recent` 读取近期生成资产。
- 如果对象存储未配置或 provider URL 无法复制，生成链路会保留 provider 返回 URL 作为降级展示。

后续建议：

- 把高质量 gallery 图片同步到 Vogue 自己的 R2 或 Cloudflare Images。
- JSON 里只保留稳定 CDN/R2 URL。
- 为 prompt entry 增加 category、model、aspect ratio、style tags。
- 后续新增 `/prompts/[id]` 详情页时复用同一数据源。

### 5. 当前 model 映射

当前 gallery `modelId` 只负责选择 `/app` 默认模型。真实 effect 映射在：

- `src/lib/effects/workspace-models.ts`

常用映射：

- `gptimage2` -> effect 16
- `gptimage15` -> effect 15
- `nanobanana2` -> effect 4
- `nanobanana` -> effect 5
- `nanobananapro` -> effect 6

### 6. 后续内容扩展方向

第一阶段保留首页 gallery。

第二阶段可以扩展：

- `/prompts` gallery 独立页
- `/prompts/[id]` prompt detail 页
- category/tag 过滤
- model 过滤
- prompt remix history
- 生成结果反哺 gallery
- prompt detail 内部链接到旧 SEO 工具页
- 对 `image prompt` 长尾做 programmatic SEO 模板

### 7. 维护原则

- 不要把 gallery 当静态装饰，它必须始终有明确生成动作。
- 不要让 prompt 数据散落在组件里，统一走 `src/lib/prompts.ts`。
- 图片 URL 后续迁移到 R2 时，应先批量校验可用性，再替换 JSON。
- 新增 prompt 条目时必须保证图片、prompt、模型 id 都能在 `/app` 正常使用。
- `/app` 的参考图、输出图和近期资产流必须继续走同一套 `user_asset` / `generation_asset_link` 资产体系。
