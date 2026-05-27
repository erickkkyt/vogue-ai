# Vogue AI SEO 与旧页面保留策略

> **当前项目状态**: 本文记录 Vogue AI 当前 SEO 资产、首页转向、旧页面保留和 sitemap 维护策略。SEO 决策必须以 GSC/GA/Metabase 数据和当前页面真实状态为准。

## 当前项目状态

### 1. 当前 SEO 基本判断

Vogue AI 当前主要资产不是大量活跃用户，而是：

- `vogueai.net` 域名
- `Vogue AI` 相关品牌词/误拼词排名
- 少量旧工具页长尾流量
- Google 已收录页面和历史信号

因此第一版不应该推倒所有旧 URL，而是：

- 首页保留 Vogue AI 品牌词。
- 首页改成 prompt gallery，承接新的 `image prompt` 方向。
- 旧工具页保留，逐步增加到 `/app` 的转化入口。
- sitemap 只提交公开可索引页。

### 2. 首页 SEO 方向

首页当前 metadata：

- title: `Vogue AI - Free Nano Banana & GPT Image Prompts Gallery`
- description: `Browse free Nano Banana and GPT Image prompts, copy proven visual examples, and generate AI images from curated prompt ideas in Vogue AI.`
- canonical: `https://vogueai.net`
- visible H1: 不展示
- semantic H1: `Free Nano Banana & GPT Image Prompts Gallery`，使用 `sr-only`

首页当前应该同时承接：

- `vogue ai`
- `vogueai`
- `vogue.ai`
- `nano banana prompts`
- `gpt image prompts`
- `ai image prompt gallery`
- `free ai image prompts`

维护原则：

- title/OG 里保留 `Vogue AI` 品牌词。
- 可见首屏保持 gallery-first，不为了 SEO 增加传统 hero 或可见 H1。
- SEO 语义通过 metadata、`sr-only` H1、FAQ 和 JSON-LD 承接。
- 不输出 `keywords` meta。

### 2.1 当前有排名/曝光页面的 SEO 优先级

最近一次站点数据复盘里，当前有 GSC 点击、曝光或已排名信号的页面优先级如下：

| 页面 | 当前处理 | SEO 策略 |
| --- | --- | --- |
| `/` | 主 SEO 入口 | 以 `Vogue AI` 品牌词 + `Nano Banana/GPT Image prompts gallery` 作为新定位，保留 gallery-first UX |
| `/ai-baby-generator` | 保留 sitemap | 有 GSC 曝光和少量点击，保留原文案，逐步补 `/app` CTA 和内部链接 |
| `/hailuo-ai-video-generator` | 保留 sitemap | 有 GSC 曝光和少量点击，保留原文案，避免突然 301 |
| `/veo-3-generator` | 保留 sitemap | 有 GA 流量和 GSC 曝光，继续保留 |
| `/ai-baby-podcast` | 保留 sitemap | 有 GSC 曝光，保留但不作为首页主产品定位 |
| `/lipsync` | 保留 sitemap | 有 GSC 曝光，保留并接入 `/app` 转化 |
| `/blog` | 保留 sitemap | 有排名信号，保留 index 和文章 slug |

无排名/无收录信号的页面：

- `/seedance`
- `/effect/earth-zoom`

这两个页面当前仍可访问，但不进入 sitemap、sidebar、footer 主入口。后续如果要恢复，应先补内容质量和内部链接，而不是直接重新提交 sitemap。

### 3. 旧 SEO 页保留

当前保留的旧页面：

- `/veo-3-generator`
- `/hailuo-ai-video-generator`
- `/ai-baby-generator`
- `/ai-baby-podcast`
- `/lipsync`
- `/blog/**`

当前仍可访问但不主动提交的低优先级旧页面：

- `/seedance`
- `/effect/earth-zoom`
- `/effect`

第一版维护原则：

- 不删除。
- 不批量 301。
- 不批量 noindex。
- 不先改文案。
- 先保持现有索引，再逐步补 CTA 和内部链接。

第二阶段优化方向：

- 把 `/veo-3-generator` 等有历史 PV 的页面转成“工具内页”结构。
- 首屏保留原关键词匹配。
- CTA 指向 `/app`。
- FAQ 里加入 prompt/image generation 相关内部链接。
- 不再接旧 per-tool API。

### 4. sitemap 当前策略

当前文件：

- `src/app/sitemap.ts`

当前提交：

- 首页
- 有排名/曝光信号的旧工具页
- blog index
- blog posts
- legal pages

当前不提交：

- `/app`
- `/assets`
- `/login`
- `/pricing`
- `/seedance`
- `/effect`
- `/effect/earth-zoom`
- `/payment/return`
- `/api/**`
- locale shell routes：`/zh/**`、`/fr/**`、`/ru/**`、`/pt/**`、`/ja/**`、`/ko/**`

维护原则：

- sitemap 只提交稳定公开页。
- 当前非英语 locale 页面复用英文页面和英文 metadata，不应作为 hreflang SEO 页面提交。
- 只有当对应 locale 拥有真实翻译、localized metadata、canonical/hreflang 自洽后，才恢复 locale sitemap alternates。
- 新增 prompt detail 页后，应加入 sitemap。
- 如果旧页面要 301，必须同步 sitemap 移除旧 URL 并保留 redirect。

### 5. 内部链接策略

当前第一版重点：

- 首页 gallery 卡片 -> `/app`
- 旧工具页 -> `/app`
- Footer/Sidebar -> 首页、`/app`、有价值的旧 SEO 页、blog、法律页
- Pricing 使用弹卡入口，不作为 sitemap SEO 页面。

后续建议：

- 首页增加到旧 SEO 页的自然链接区域，避免旧页面变成孤岛。
- 旧工具页增加到首页 gallery 和 `/app` 的 CTA。
- 如果新增 `/prompts/[id]`，prompt 详情页应链接到模型页、旧工具页和 `/app`。

### 6. 不能做的事

- 不要把旧 URL 直接删除。
- 不要因为旧页面 UI 旧就直接 noindex。
- 不要把所有页面都改成同一套薄模板。
- 不要让首页完全脱离 Vogue AI 品牌词。
- 不要把 `/app` 提交到 sitemap 作为 SEO 页。
- 不要在未本地化的情况下提交 locale URL 和 hreflang。

### 7. 数据复盘口径

后续每次 SEO 改版前至少看：

- GSC query clicks/impressions/position
- GSC page clicks/impressions
- GA landing page sessions
- Metabase 里页面到登录/生成/支付的路径
- 旧页面过去 28/90 天表现

只有在确认旧页面无流量或替代页更强时，才考虑重定向或合并。
