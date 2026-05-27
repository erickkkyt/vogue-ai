# Vogue AI 项目开发日志

> **当前项目状态**: 本文按日期倒序记录 Vogue AI 重构过程中的重要工程决策、迁移结果和后续方向。详细模块状态写入对应专题文档，本文只保留高层进度。

## 2026-05-23

### 数据库结构对齐 gptimg

已生成新的 Vogue Drizzle migration：

- `src/db/migrations/0002_black_wrecker.sql`

这次 migration 目标是让 Vogue AI 的 Postgres/Drizzle schema 对齐本地 `gptimg` 当前结构，包含：

- 新增 `daily_check_in`。
- 补齐 `user.normalized_email`。
- 补齐 `payment` 的 trial、订阅变更、积分锚点字段和索引。
- 补齐 `credit_transaction.grant_month`、`expiration_date_processed_at` 以及 gptimg 对应索引。
- 补齐 `generation_history.lifecycle_phase`、`last_provider_sync_at` 和运行态索引。
- 移除 `generation_history.updated_at`，并同步更新生成记录写入逻辑。
- 同步 gptimg 的核心表 RLS / 权限收紧语句。

本次只生成 migration 和本地代码/doc 对齐，未执行远端数据库推送。

验证：

- `npm run db:generate`：No schema changes。
- `npm run typecheck`
- `npx tsx --test src/credits/ledger.test.ts src/lib/adapters/kie-market-adapter.test.ts src/lib/auth-login-ui.test.ts src/lib/effects/generation-input.test.ts src/lib/effects/kie-callback.test.ts src/lib/gptimg-api-infrastructure.test.ts src/lib/legal-pages.test.ts src/payment/zpay.test.ts`

## 2026-05-15

### `/app` 工作台对齐 gptimg

已把 `/app` 从第一版轻量图片表单升级为 gptimg 风格工作台：

- prompt 输入框支持 GPT Image 2 的 6000 字上限、计数、复制和清空。
- 模型参数顺序对齐为 `Image number -> Aspect Ratio -> Resolution -> Quality`。
- `workspace-models` 增加 media schema、上传路径、bucket、积分和多图数量配置。
- 参考图输入改为最多 6 个槽位，本地图片先走对象存储直传，再传入生成 API。
- `/app` 增加当前任务、轮询状态、近期资产、复用 prompt、复用生成图作为参考图和下载动作。
- provider 输出优先持久化到 R2/对象存储，并写入 `user_asset` / `generation_asset_link`。

验证：

- `npm run typecheck`
- `npm run build`
- `http://localhost:3001/zh/app` 返回 200，并渲染新版工作台结构

## 2026-05-13

### 当前定位确认

Vogue AI 当前定位从旧的零散 AI 工具站调整为：

```text
AI Prompt Gallery + Image Generator
```

保留：

- `vogueai.net` 域名
- Vogue AI 品牌词
- 旧 SEO 工具页 URL
- sitemap 中已有公开 SEO 资产

重构：

- 登录
- 支付
- 积分
- 生成 API
- provider adapter
- 首页 gallery
- 图片生成工作台

### 基础设施迁移

已完成第一版基础设施迁移：

- Supabase Auth 替换为 BetterAuth。
- 旧 embedded payment/旧支付逻辑替换为 Stripe Checkout。
- 新增 `payment`、`user_credit`、`credit_transaction`、`effect`、`generation_history`、`user_asset`、`generation_asset_link` 表。
- 移除旧 Google One Tap、N8N 路由、旧 per-tool API 客户端和旧支付入口。
- 接入统一 `/api/effects/*`。
- 接入 Evolink GPT Image 2 adapter。
- 接入 KIE GPT Image 1.5 / Nano Banana adapter。

### 首页与产品入口

已完成第一版首页优化：

- 首页改为 Vogue AI Prompt Gallery。
- prompt 数据来自 gptimg prompt 资源导入后的 JSON。
- gallery 卡片支持复制 prompt 和跳转 `/app`。
- `/app` 提供第一版图片生成工作台。

### SEO 资产处理

已完成第一版 SEO 边界整理：

- 首页保留 Vogue AI 品牌词。
- 旧 SEO 页继续保留。
- sitemap 保留公开旧工具页。
- `/app`、`/login`、`/assets`、`/payment/return` 不进入 sitemap。

### 文档建设

新增 `Vogue-AI-Docs/`，参考 gptimg 文档组织方式建立 Vogue AI 当前项目文档：

- 页面结构
- 功能实现逻辑
- 后端 API
- 数据库结构
- 积分与支付
- Prompt Gallery 与内容资产
- SEO 与旧页面保留策略
- 上线前 Checklist
- 项目开发日志

### 下一步方向

优先级建议：

1. 跑通生产数据库迁移和真实 Stripe webhook。
2. 继续完善 `/assets` 历史资产页。
3. 开始逐个优化旧 SEO 页面，把它们改成导向新 `/app` 的工具内页。
4. 评估新增 `/prompts` 和 `/prompts/[id]`，把 prompt gallery 从首页扩展成可索引内容体系。
