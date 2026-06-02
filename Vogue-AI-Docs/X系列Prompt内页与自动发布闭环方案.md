# X 系列 Prompt 内页与自动发布闭环方案

> 日期：2026-06-01  
> 目标：把 `Eric Kang AI` 英推、VogueAI prompt 页面、图片生成资产、X/Pinterest/TikTok/YouTube 分发和复盘监控连成一个可自动化的增长闭环。  
> 参考：MeiGen sitemap、prompt detail page、`llms.txt`、VogueAI 当前 prompt gallery 代码和 KKKK AI Space social-automation 队列。

## 一句话结论

应该做。每天发的内容必须先变成一个可复用的 `prompt asset`，再由这个 asset 生成图片、网页和社媒内容。

正确顺序不是：

```text
找 prompt -> 写 X -> 临时配图 -> 发
```

而是：

```text
找爆点 prompt / workflow
-> 改成 VogueAI 自己的 prompt asset
-> 用 VogueAI 生成 3-6 张结果图
-> 选 hero image 和 variants
-> 生成 /prompts/[slug] 详情页和 /prompts/series/[series] 聚合页
-> 再拆成 X / Pinterest / TikTok / YouTube / 中文自媒体内容
-> 发布后回收 views、clicks、signups、generation starts
```

每条社媒内容都要承担两个任务：

1. 符合 `Eric Kang AI` 的人设：daily AI image prompts, building VogueAI, visual workflows for creators。
2. 把流量导向一个具体 prompt 页面，而不是只导向首页。

## MeiGen 给我们的直接启发

2026-06-01 抓取 MeiGen 当前结构：

- `https://www.meigen.ai/sitemap.xml` 共约 510 个 URL，其中约 500 个是 `/prompt/{id}`。
- 首页 title 是 `Free GPT Image 2 & Nano Banana Prompts Gallery`，首页本身就是 gallery 和搜索入口。
- 首页可索引内容里包含 prompt 卡片、图片、作者、模型、likes/views 和详情链接。
- prompt detail URL 是 `/prompt/{id}`，页面有 canonical、OG image、Twitter card、JSON-LD。
- prompt detail 的 JSON-LD 包含 `ImageObject`、`CreativeWork`、`WebPage`、作者 attribution、likes/views、source URL、model。
- `llms.txt` 明确写了每个 prompt 页面包含 full prompt、preview、original author、engagement metrics、model、JSON-LD。

我们不应该复制它的 prompt 数据，但应该复制它的机制：

```text
社媒上已经验证的视觉内容
-> 站内可复用 prompt 页面
-> 一键生成 / copy prompt
-> 社媒再把页面反向分发出去
```

## VogueAI 当前真实状态

代码里已有的基础：

- 首页已经是 prompt gallery。
- `src/lib/prompts.ts` 已经有 prompt entry 数据结构、`getPromptEntryById`、gallery count、model/category 过滤。
- `/api/gpt-image-2-prompts/entries?id=...` 已经能按 id 返回 prompt entry。
- `VogueGalleryWorkspace` 已经有弹窗式 prompt detail、copy、use prompt、reference image 逻辑。
- `/app` 已经能接收 prompt 并进入生成工作台。
- KKKK 外链整理已经有 X 发布预览区，支持 `media_paths` 本地图片预览。

现在缺的关键环节：

- 没有公开的 `/prompts` 独立 gallery 路由。
- 没有公开的 `/prompts/[slug]` prompt detail URL。
- `src/app/sitemap.ts` 当前没有把 prompt pages 放进 sitemap。
- social queue 里已经写了 `target_url`，但这些 URL 还没有真实页面。
- 今天队列里的 `media_paths` 只有测试图，不是 VogueAI 自己生成的最终图。
- 还没有把本地生成图上传/镜像成站内可用的 CDN/R2 URL。
- 预览台还没有检查 `target_url` 是否 200、页面是否已部署、图片是否来自自己生成。

## 内容系列设计

不要做太多系列。先用 5 个系列覆盖 80% 的社媒内容，每个系列都有一个聚合页。

| 系列 | 站内 URL | 内容用途 | X 上怎么发 |
| --- | --- | --- | --- |
| AI Poster Prompts | `/prompts/series/ai-poster-prompts` | travel poster、double exposure、festival poster、movie poster | 视觉强，适合单图 + prompt structure |
| Product & Ad Creative Prompts | `/prompts/series/ai-ad-creative-prompts` | product photography、UGC ads、key visual、ecommerce | 最贴近商业转化和 Google Ads 素材 |
| Character & Portrait Consistency | `/prompts/series/character-consistency-prompts` | face lock、same character、avatar、headshot | 容易收藏，适合 thread |
| Fashion Editorial Prompts | `/prompts/series/fashion-editorial-prompts` | magazine cover、fashion shoot、studio portrait、clay fashion | 和 VogueAI 品牌名最顺 |
| Image-to-Video Storyboards | `/prompts/series/image-to-video-prompts` | storyboard、first frame、camera move、short video prompt | 后续可扩到 TikTok/YouTube Shorts |

今天已有 10 条草稿可以映射成：

| draft | prompt asset | series |
| --- | --- | --- |
| watercolor travel poster | watercolor travel poster AI prompt | AI Poster Prompts |
| image-to-video workflow | image to video AI prompt workflow | Image-to-Video Storyboards |
| double-exposure city poster | double exposure city poster AI prompt | AI Poster Prompts |
| face-lock street fashion | face lock street fashion AI prompt | Character & Portrait Consistency |
| clay fashion cover | clay fashion magazine cover AI prompt | Fashion Editorial Prompts |
| brand key visual poster | AI brand key visual poster prompt | Product & Ad Creative Prompts |

## 页面结构

### `/prompts`

作用：独立 prompt gallery，承接 `ai image prompt gallery`、`copy paste ai image prompts`、`free ai image prompts`。

需要：

- model filter：GPT Image 2、Nano Banana、Midjourney、Video。
- series/category filter。
- search。
- prompt card：image、title、series、model、source credit、Use Prompt、Copy、View Page。
- canonical。
- ItemList JSON-LD。
- sitemap entry。

### `/prompts/[slug]`

这是每条 X/Pinterest/TikTok 内容的主要承接页。

页面必须有：

- hero image。
- 3-6 张生成变体。
- full prompt。
- rewritten prompt / original inspiration 区分。
- `Use this prompt in VogueAI` CTA，跳到 `/app?target=image&model=...&prompt=...`。
- `Copy prompt`。
- `Why this prompt works`，用 3-5 条解释 prompt 结构。
- `Prompt variables`，比如 `[SUBJECT]`、`[PRODUCT]`、`[BACKGROUND]`。
- source credit：`Inspired by @xxx`、source URL、collected date。
- takedown text：如果来源创作者不希望被引用，可联系删除。
- related prompts：同系列 4-8 条。
- OG image / Twitter card 使用 hero image。
- JSON-LD：`CreativeWork` + `ImageObject` + `WebPage` + `BreadcrumbList`。

### `/prompts/series/[seriesSlug]`

作用：把每日零散 prompt 变成可长期沉淀的系列页。

页面必须有：

- series 说明：这个系列解决什么创作任务。
- 8-30 个 prompt cards。
- 适合 Pinterest 的标题和描述。
- 内链到每个 `/prompts/[slug]`。
- CTA 到 `/app`。
- sitemap entry。

## Prompt Asset 数据模型

后续自动化的核心不是 post，而是 prompt asset。

建议新增生成数据文件：

```ts
type VogueSocialPromptAsset = {
  id: string;
  slug: string;
  seriesSlug: string;
  status: 'draft' | 'generated' | 'page_ready' | 'approved' | 'published';
  title: string;
  hook: string;
  rewrittenPrompt: string;
  originalPrompt?: string;
  generationBrief: string;
  modelId: 'gptimage2' | 'nanobanana' | 'nanobanana2' | 'midjourney' | 'video';
  localMediaPaths: string[];
  imageUrls: string[];
  heroImageUrl: string;
  sourceUrl?: string;
  sourceAuthor?: string;
  sourceHandle?: string;
  creditLine?: string;
  collectedAt: string;
  targetUrl: string;
  tags: string[];
  xCopies: string[];
  pinterestCopies: string[];
  tiktokScript?: string;
  youtubeShortsCopy?: string;
  metrics?: {
    xPostUrl?: string;
    xViews?: number;
    xLikes?: number;
    clicks?: number;
    signups?: number;
    generationStarts?: number;
  };
};
```

现有 `data/posts/YYYY-MM-DD.csv` 继续保留，但它应该从 `prompt asset` 派生，不应该成为源头。

## 每日生产流程

### 1. 找 prompt

每天候选来源：

- X 视觉/prompt 账号池。
- MeiGen / PromptsRef / 类似 prompt gallery 的 trending cards。
- AI Daily 里的 image/video prompt 信号。
- Pinterest 热门 AI poster / product photo / fashion editorial。
- Reddit 里高收藏的 AI image prompt 问题。

入选标准：

1. 视觉能让人停住。
2. 能改成商业用途或 creator workflow。
3. 能归入 5 个系列之一。
4. 能做出 3-6 张自生成变体。
5. 能产生一个具体内页。
6. 来源可记录，必要时可 credit / takedown。

### 2. 改写 prompt

不能直接照搬。改写要至少改 3 个维度：

- subject / role。
- scene / environment。
- style / material。
- business use case。
- composition / lens / aspect ratio。
- output format。

发布文案用 `inspired by`、`remix`、`variation`，不要说是自己原创发明了别人的 prompt。

### 3. 自己生成图片

每个 prompt asset 生成：

- 1 张 hero image。
- 2-5 张 variants。
- 1 张适合 X/Pinterest 的 4:5 或 1:1 版本。
- 可选 1 张横版 16:9 给 YouTube/TikTok 封面。

本地文件保存：

```text
social-automation/assets/YYYY-MM-DD/{assetId}/
  hero.png
  variant-01.png
  variant-02.png
  pinterest.png
  source.json
```

站内页面不能长期引用本地路径，必须上传或镜像到 VogueAI 可访问的 CDN/R2。

### 4. 上页面

每个 unique prompt asset 上一个 `/prompts/[slug]`。

如果某个系列当天有 3 条以上新 prompt，同时更新 `/prompts/series/[seriesSlug]`。

页面上线前必须检查：

- URL 200。
- hero image 可加载。
- OG image 正常。
- prompt 可以 copy。
- `Use Prompt` 能进入 `/app`。
- source credit 存在。
- sitemap 包含。

### 5. 生成社媒内容

不要把 30 条社媒理解为 30 个不同 prompt。推荐是：

```text
每天 8-12 个 unique prompt assets
-> X 英文 8-10 条
-> X 中文 3-5 条
-> Pinterest 8-12 个 pins
-> TikTok / YouTube Shorts 3-5 条脚本或短视频
-> Reddit 1-2 条高质量参与或帖子
```

X 英文账号内容比例：

```text
60% prompt result + prompt structure
20% workflow / why it works
10% build in public
10% question / community feedback
```

新号不要每条主帖都放链接。建议：

- 30%-40% 主帖直接放 `/prompts/[slug]`。
- 40%-50% 主帖只发图和结构，第一条 reply 放页面。
- 10%-20% 不放链接，只做人设和互动。

### 6. 预览和审核

KKKK 外链整理的 X 发布预览区需要补这些状态：

- series filter。
- asset status：draft / generated / page_ready / approved / published。
- image source：local demo / VogueAI generated / uploaded CDN。
- target_url status：missing / 200 / deployed but not indexed。
- page preview：title、hero image、prompt、source credit。
- legal status：original / remix with credit / high risk。
- UTM preview。
- final post preview。
- one-click copy。

没有通过这些检查的 post 不进入发布队列。

### 7. 发布

发布顺序：

```text
page deployed
-> preview passes
-> user approves
-> X publish
-> first reply link if needed
-> Pinterest pin
-> TikTok / YouTube Shorts script/video queue
-> save publish URL
```

### 8. 复盘

每天看 3 组指标：

| 层级 | 指标 | 用途 |
| --- | --- | --- |
| 社媒 | views、likes、bookmarks、replies、profile visits | 判断内容 hook 和图片是否有效 |
| 页面 | clicks、sessions、scroll、copy prompt、use prompt | 判断页面承接是否有效 |
| 产品 | signup、generation start、paid conversion | 判断是不是带来有效用户 |

每个 prompt asset 最终要能回答：

```text
这条 prompt 是否值得继续做成系列？
这个系列是否值得每天发？
这类图片是否带来点击？
页面是否让用户复制/生成？
```

## 现在最缺什么

按优先级：

1. `/prompts/[slug]` 详情页。
2. `/prompts/series/[seriesSlug]` 系列页。
3. prompt asset JSON/CSV 数据层。
4. 图片生成后上传到 VogueAI CDN/R2 的流程。
5. sitemap 加 prompt 和 series pages。
6. X 预览区增加 page status、series、image provenance。
7. 每日任务脚本：候选发现 -> prompt 改写 -> 图片生成 -> 页面数据 -> 社媒文案。
8. 复盘数据表：post URL、target URL、views、clicks、signups、generation starts。

## 今天可以直接落地的最小闭环

今天不需要等 500 个 prompt 页面。先做 6 个页面，把今天 10 条 X 草稿中的核心 prompt 变成可发资产：

1. `/prompts/watercolor-travel-poster-ai-prompt`
2. `/prompts/image-to-video-ai-prompt-workflow`
3. `/prompts/double-exposure-city-poster-ai-prompt`
4. `/prompts/face-lock-street-fashion-ai-prompt`
5. `/prompts/clay-fashion-magazine-cover-ai-prompt`
6. `/prompts/ai-brand-key-visual-poster-prompt`

同时建 5 个 series 页面。今天 X 先发 10 条，其中 4 条主帖带链接，4 条第一条 reply 带链接，2 条纯互动/人设。

## 我能做什么，你需要判断什么

我可以做：

- 设计 prompt asset 数据 schema。
- 实现 `/prompts`、`/prompts/[slug]`、`/prompts/series/[seriesSlug]`。
- 把页面加进 sitemap。
- 写自动生成页面数据的脚本。
- 把 KKKK 外链整理预览区补成 page + image + series 审核台。
- 根据候选 prompt 改写成原创版本。
- 生成 X/Pinterest/TikTok/YouTube 文案。
- 做本地预览、构建和测试。

你需要判断：

- 5 个系列是否就是当前主线。
- 哪些 prompt 视觉审美过关。
- 是否使用、署名或避开某个来源创作者。
- 最终是否发布。
- 新号阶段每条链接放主帖还是评论。
- 付费推广号是否投放，以及预算。

## 最终目标

目标不是每天机械发 30 条，而是每天新增 8-12 个可复用 prompt assets，并把它们分发成 30 条中英文社媒内容。

真正的资产是：

```text
prompt asset
生成图
prompt detail page
series page
社媒发布记录
复盘数据
```

只要这个链路跑通，X、Pinterest、TikTok、YouTube、Reddit 都只是不同分发出口；VogueAI 的 prompt 页面才是沉淀和转化中心。
