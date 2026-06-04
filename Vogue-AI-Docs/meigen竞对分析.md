# MeiGen 竞对分析

> **观测日期**: 2026-05-23  
> **分析对象**: https://www.meigen.ai/  
> **分析重点**: footer 表现、首页 SEO 架构、prompt gallery 增长逻辑，以及对 Vogue AI 的可执行启发。
> **2026-06-04 补充**: PromptsRef / Underwood 与 OpenNana / 松果先森已加入 MeiGen 同级 prompt gallery 竞对集合；本文件仍聚焦 MeiGen，横向对照见 `PromptsRef-OpenNana竞对速记.md`。

## 1. 核心结论

MeiGen 不是没有 footer，而是没有传统 SaaS/营销站意义上的大 footer。

它的首页更接近一个 `Prompt Gallery + Generator App Shell`，页面主要任务是让用户立即完成：

```text
看图
-> 找到可复用 prompt
-> 点击 Use Idea / View prompt
-> 进入生成器
```

因此它没有把底部做成品牌介绍、长口号、多列站点地图的传统 footer。它只保留了轻量导航和必要信任链接：

- `Explore More`
- model/category 入口
- 外部产品入口：MCP Server、OpenClaw Skill、Figma Plugin
- 法务链接：Terms、Privacy、Refund

这说明它的 SEO 和转化并不依赖 footer 堆链接，而是依赖首页可索引内容、prompt 详情页、结构化数据和 docs 层。

## 2. Footer 结构判断

### 2.1 它实际有 footer-like 区域

静态抓取首页可以看到底部信息区：

```text
Explore More
- Home - All Free Prompts
- GPT Image 2 Prompts
- Nano Banana 2 Prompts
- Nano Banana Prompts
- Midjourney Prompts
- Seedance 2.0 Video Prompts

More from us
- MCP Server
- OpenClaw Skill
- Figma Plugin

Terms · Privacy · Refund
```

但这个区域视觉上不是传统 footer，而是更像 app 的辅助导航。它不会抢首屏，也不会在底部重复品牌口号。

### 2.2 为什么它可以弱化 footer

原因不是「footer 没用」，而是它的产品形态让 footer 变成低优先级：

- 首页本身就是可消费内容流，用户不需要先读品牌解释。
- prompt 卡片和生成器承担主要转化动作。
- 法务链接只需要可发现，不需要重品牌化。
- 外部入口放在 `More from us`，用于承接开发者和设计师生态。
- 解释型内容放到 `docs.meigen.ai`，不塞在首页底部。

对 Vogue AI 来说，不能直接照抄「弱 footer」。Vogue AI 当前还需要强化品牌一致性、法律页、pricing、login 和旧 SEO 页之间的信任链路。

## 3. 首页 SEO 架构

### 3.1 首页定位非常明确

MeiGen 首页 title：

```text
MeiGen - Free GPT Image 2 & Nano Banana Prompts Gallery
```

description：

```text
Free GPT Image 2 and Nano Banana prompts + Seedance 2.0 video prompts.
Copy, paste, generate — no prompt engineering needed.
```

首页 H1：

```text
Free GPT Image 2 & Nano Banana Prompts Gallery
```

它首页不是泛泛地讲「AI image generator」，而是直接打：

- `free gpt image 2 prompts`
- `nano banana prompts`
- `prompt gallery`
- `Seedance 2.0 video prompts`
- `copy paste AI prompts`

### 3.2 首页内容可被搜索引擎读取

首页 HTML 里有 `sr-only` 的 SEO 内容区，并包含：

- H1
- 首页摘要
- Featured AI Image Prompts
- prompt 卡片标题
- prompt 正文摘录
- 图片 alt
- 作者信息
- likes/views
- model 信息
- prompt detail 内链

这点很关键：它视觉上是 app/gallery，但搜索引擎能读到足够多的静态内容。它不是一个只靠客户端渲染的空页面。

### 3.3 Schema 比 footer 更重要

首页有 JSON-LD：

- `WebApplication`
- `Organization`
- `WebSite`
- `SearchAction`
- `ItemList`

prompt 详情页有 JSON-LD：

- `ImageObject`
- `CreativeWork`
- `WebPage`
- `BreadcrumbList`

这个组合让 Google 能理解：

- 这是一个 Web App
- 这是一个 prompt gallery
- 每个详情页是一条 AI prompt / creative work
- 每个 prompt 和图片、作者、原始来源、发布时间有关联

对 Vogue AI 来说，新增 `/prompts/[id]` 后也应该走类似结构，而不是只做一个普通 markdown-like 页面。

## 4. Sitemap 和长尾页面

观测时 sitemap 暴露 510 个 URL，其中：

- 500 个 `/prompt/...` 详情页
- 1 个首页
- 7 个法律/政策页
- 1 个 changelog
- 1 个 model comparison

这说明 MeiGen 的长尾 SEO 主体不是首页，也不是 footer，而是大量 prompt detail pages。

当前 sitemap 结构大致是：

```text
/
/prompt/{tweet_or_prompt_id}
/terms
/privacy-policy
/refund-policy
/dmca
/changelog
/model-comparison
```

它的 prompt 页还会把原 X/Twitter 内容、作者、prompt 文本和图片连接起来，形成可索引的长尾内容资产。

## 5. Docs 层的作用

MeiGen 还有独立 docs：

- `docs.meigen.ai/en/quickstart`
- `docs.meigen.ai/en/features/gallery`
- `docs.meigen.ai/en/features/generate`
- `docs.meigen.ai/en/features/models`
- `docs.meigen.ai/en/mcp/overview`
- API docs

docs 层承接的是首页不适合展开的解释型搜索意图：

- gallery 如何用
- model 如何比较
- generation 如何配置
- MCP 如何安装
- API 如何调用

MeiGen docs 里对 gallery 的描述显示，它不是只有少量首页卡片，而是一个持续更新的 curated gallery。观测时 docs 文案提到 1,446 curated prompts，分类包括 Photography、Illustration & 3D、Product & Brand、Food & Drink、Poster Design、UI & Graphic、Videos。

这对 Vogue AI 的启发是：公开首页保持 gallery-first，详细解释和长尾教程应该放到 docs/blog/programmatic pages，而不是全部塞进首页或 footer。

## 6. 为什么它没有传统 footer

更准确的说法是：MeiGen 把传统 footer 的职责拆走了。

| 传统 footer 职责 | MeiGen 的处理方式 |
| --- | --- |
| 品牌介绍 | 首页 title、schema、docs quickstart 承接 |
| 产品导航 | 左侧/底部 app shell + Explore More |
| SEO 内链 | prompt detail pages + sitemap 承接 |
| 法务信任 | Terms / Privacy / Refund 最小露出 |
| 开发者入口 | MCP / OpenClaw / Figma Plugin 放在 More from us |
| 教程说明 | docs.meigen.ai 承接 |

所以它不是「不要 footer」，而是「不让 footer 成为页面的信息重心」。

## 7. 对 Vogue AI 的可执行建议

### 7.1 Footer 不建议删除

Vogue AI 当前不应该直接学 MeiGen 把 footer 弱到几乎不可见。

原因：

- Vogue AI 还在建立新品牌识别，footer 是品牌一致性的一部分。
- 当前有 pricing、login、legal、blog、旧 SEO 页，需要底部作为信任和导航补充。
- Vogue AI 从旧工具站迁移过来，footer 可以帮助旧页面和新 `/app` 之间建立路径。
- 我们刚统一了 `Vogue AI` 品牌字样，footer 正好应该作为统一品牌样式的稳定落点。

建议保留轻 footer，但不要放多余 slogan。当前删除 `Prompt Gallery` 副标题是对的。

### 7.2 推荐的 Vogue AI footer 结构

```text
Vogue AI

Product
- Gallery
- Create
- Pricing

Resources
- Blog
- Prompt Gallery
- Model Guide / Prompt Guide

Legal
- Terms
- Privacy
- Refund
- Contact / Removal
```

如果页面是 `/app` 工作台，可以使用更轻的 footer 或不显示传统 footer；但 public 首页、blog、pricing、legal、login 仍建议保留一致的品牌 footer。

### 7.3 SEO 应该复制的不是 footer，而是页面架构

Vogue AI 更应该复制 MeiGen 的这几件事：

1. 做 `/prompts` 独立 gallery 页。
2. 做 `/prompts/[id]` prompt detail 页。
3. 每个 detail 页输出完整 prompt、图片、模型、分类、来源、生成 CTA。
4. detail 页加入 sitemap。
5. detail 页加 JSON-LD：`CreativeWork`、`ImageObject`、`BreadcrumbList`。
6. 首页继续保持 gallery-first，不要变成营销长页。
7. 把模型说明、prompt 教程、API/工作流类解释内容放到 docs/blog。
8. footer 只做轻量导航和信任链接，不承担 SEO 主体。

## 8. Vogue AI 下一步优先级

### P0: 保持当前品牌 footer 简洁

- 保留 `Vogue AI` 品牌样式。
- 不再加 `Prompt Gallery` 副标题。
- 确保 login、footer、sidebar、blog 的品牌样式一致。

### P1: 建 prompt 详情页

当前首页已经有 gallery 数据源：

```text
src/lib/generated/awesome-gptimage2-prompts.json
src/lib/prompts.ts
```

下一步应该把这个数据源扩展到：

```text
/prompts
/prompts/[id]
```

每个 prompt detail 页应该包含：

- title
- image
- full prompt
- model
- source
- tags/category
- `Use Prompt` CTA
- related prompts
- links to `/app?target=image&model=...&prompt=...`

### P2: 补 schema 和 sitemap

prompt detail 页上线后同步：

- `src/app/sitemap.ts`
- canonical
- Open Graph image
- JSON-LD
- robots/index 策略

不要把 `/app` 作为 SEO 页提交。SEO 页负责发现和转化，`/app` 负责生成。

### P3: 建 docs/blog 解释层

MeiGen 用 docs 层承接解释型需求。Vogue AI 可以先用 blog/docs 承接：

- GPT Image 2 prompt examples
- Nano Banana prompt examples
- how to write image prompts
- model comparison
- product photo prompt guide
- fashion/editorial prompt guide

这些页面负责拿教程词和 long-tail，而不是让首页变重。

## 9. 竞对启发总结

MeiGen 的强点不是「没有 footer」，而是它把 SEO、产品动作和内容资产拆得很清楚：

```text
首页 = gallery-first 的低 time-to-value 入口
prompt detail = 长尾 SEO 资产
docs = 解释型/开发者搜索意图
footer = 最小导航和信任链接
generator = 真实转化动作
```

Vogue AI 当前最适合的路线是：

```text
保留轻品牌 footer
-> 强化 prompt gallery
-> 增加 prompt detail pages
-> 用 sitemap + schema 承接长尾
-> 用 docs/blog 承接教程和模型解释
-> 继续把用户导向 /app 生成
```

不要为了模仿竞对把 footer 直接删掉。真正要学的是：让 footer 变轻，让 prompt 内容页变重。

## 10. 来源记录

- MeiGen 首页：https://www.meigen.ai/
- MeiGen sitemap：https://www.meigen.ai/sitemap.xml
- MeiGen robots：https://www.meigen.ai/robots.txt
- MeiGen llms.txt：https://www.meigen.ai/llms.txt
- Prompt detail 示例：https://www.meigen.ai/prompt/2057490100611866683
- MeiGen Quick Start Docs：https://docs.meigen.ai/en/quickstart
- MeiGen Gallery Docs：https://docs.meigen.ai/en/features/gallery
