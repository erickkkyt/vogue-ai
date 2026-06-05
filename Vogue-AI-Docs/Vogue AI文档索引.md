# Vogue AI 文档索引

> **当前项目状态**: Vogue AI 正在从旧的零散工具站重构为 `AI Prompt Gallery + Image Generator`。本文档目录记录当前代码真实状态、后端基础设施、SEO 资产保留策略和下一步上线检查项。
> **文档维护规则**: 每次修改登录、支付、积分、生成 API、首页 gallery、SEO 页面或数据库结构后，都要同步更新对应文档，并在 `Vogue AI项目开发日志.md` 追加日期倒序记录。

## 当前定位

Vogue AI 当前保留 `vogueai.net` 的品牌词和旧 SEO 页面资产，但底层基础设施已经切到参考 gptimg 的新体系：

- 登录：BetterAuth + Drizzle/Postgres
- 支付：Stripe Checkout + webhook
- 积分：`user_credit` + `credit_transaction` ledger
- 生成：统一 `/api/effects/*` + provider adapter
- 首页：prompt gallery，承接 `image prompt` 方向搜索意图
- 工作台：`/app` 图片生成器，接收 gallery prompt 参数
- 旧 SEO 页：继续保留，不做无计划重定向

## 文档清单

| 文档 | 作用 |
| --- | --- |
| `Vogue AI项目页面结构.md` | 当前路由、页面分层、公开页/登录页/工作台/旧 SEO 页的维护边界 |
| `Vogue AI功能实现逻辑.md` | 首页 gallery 到 `/app` 再到 effects API/provider 的真实功能链路 |
| `Vogue AI项目后端API对接文档.md` | BetterAuth、effects API、Stripe webhook、provider adapter 的接口说明 |
| `Vogue AI数据库表结构.md` | Drizzle schema、核心表关系、迁移注意事项 |
| `Vogue AI积分与支付实现.md` | Stripe 套餐、credit pack、注册赠送、生成扣费和失败退款逻辑 |
| `Vogue AI Prompt Gallery与内容资产.md` | prompt 数据来源、gallery 卡片、R2/图片资产当前状态和后续补齐方向 |
| `海外社媒自动化发布系统方案.md` | 围绕 prompt asset、独立 prompt 内页、多平台发布、审核队列和复盘面板的社媒自动化方案 |
| `X系列Prompt内页与自动发布闭环方案.md` | 参考 MeiGen sitemap/prompt 页后补齐的 X 系列内容、prompt 内页、自生成图片、预览审核和复盘闭环 |
| `X社媒竞对清单.md` | 最值得对标的 X prompt / AI visual workflow 账号清单，以及 VogueAI 可复用的日更图文、workflow thread、creator board 模板 |
| `Vogue AI产品体验优化建议.md` | 围绕 prompt gallery、remix、模型对比、资产 Kit、视频 shot recipe 的产品体验优化路线 |
| `Vogue AI SEO与旧页面保留策略.md` | 首页品牌词保留、旧页面保留、sitemap、canonical 和后续内容策略 |
| `meigen竞对分析.md` | MeiGen 首页/footer/SEO 架构复盘，以及 Vogue AI prompt detail、schema、sitemap、docs 层的可复制策略 |
| `AIGC英推创作者与付费推广策略.md` | 英推 AIGC 创作者地图、自营品牌号/创作者号打法、付费推广报价参考和首轮投放 SOP |
| `Vogue AI上线前Checklist.md` | 第一版上线前必须核对的工程、支付、生成、SEO 项 |
| `Vogue AI项目开发日志.md` | 按日期倒序记录重要迁移和决策 |

## 当前第一版边界

第一版已经完成或正在以代码为准维护的范围：

- BetterAuth 登录基础设施
- Stripe Checkout 与 webhook 入账
- credit ledger 表与扣费/退款函数
- unified effects generation API
- Evolink GPT Image 2 provider adapter
- KIE GPT Image 1.5 / Nano Banana provider adapter
- 首页 prompt gallery
- `/app` 图片生成器
- 旧 SEO 页面保留
- sitemap 修正

第一版暂不把旧工具页彻底重写成新模板，只保证它们继续作为 SEO 资产存在，并把用户导向新生成链路。旧工具页文案和结构调整应作为第二阶段任务处理。
