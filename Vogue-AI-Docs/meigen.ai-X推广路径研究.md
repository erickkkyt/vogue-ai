# meigen.ai X 推广路径研究

> 当前版本：2026-05-27  
> 研究对象：[meigen.ai](https://www.meigen.ai/)  
> 归属：[[VogueAI/价值主张与核心竞对]] / 竞对分析  
> 数据来源：meigen.ai 官网与文档、GitHub、X 公开数据检索、`twitterapi.io` X 数据接口。X 指标为 2026-05-27 抓取时点的公开指标。

## 一句话判断

MeiGen 的增长不是靠 `@meigen7982` 单个品牌号自然做大，而是把 X 上已经有传播力的 AI prompt 内容变成产品资产，再用创作者署名、外部 AI 大号推广、GitHub/MCP 开发者分发，把“看 X 爆款 prompt -> 收藏/复用 -> 一键生成”做成闭环。

对 VogueAI 最有参考价值的是这条链路：

```text
X 上的高互动视觉 prompt
-> MeiGen 收录、按模型/场景分类、保留作者与 X 原帖
-> 官网 gallery 形成可浏览资产
-> 主账号转发/引用创作者与推广帖
-> AI 创作者账号用“免费 / Pinterest / viral prompts / no prompt engineering”话术二次传播
-> GitHub prompt repo + MCP server 打进 Claude Code / Cursor / OpenClaw 等开发者圈层
```

## 产品与账号基础

| 项目 | 观察 |
| --- | --- |
| 官网定位 | “Free GPT Image 2 & Nano Banana Prompts Gallery”，主承诺是浏览免费 prompt、复制、用 GPT Image 2 / Nano Banana 2 / Seedance 2.0 / Veo 3.1 / Midjourney 等模型一键生成。 |
| X 主账号 | [`@meigen7982`](https://x.com/meigen7982)，名称 `MeiGen AI`，2025-08-19 创建，抓取时约 585 followers、215 following，bio 是 `AI image & video Prompts Gallery & generation for creators`。官网 metadata 仍写有 `@meigen_ai`，但 X 接口未找到该账号；当前应以 `@meigen7982` 为活跃账号。 |
| 开发者身份 | GitHub 用户 [`jau123`](https://github.com/jau123) 的 GitHub API `twitter_username` 指向 `meigen7982`。没有发现一个可信的独立“开发者 X 账号”；当前看起来是品牌号与开发者分发账号合一。 |
| 公司主体 | Terms / Privacy 显示发布主体为 `Meigen Creative L.L.C.`，地址在 Wyoming。 |
| 内容来源 | Privacy 明确说明会索引第三方平台公开 AI artwork，目前主要是 X/Twitter，并允许创作者通过 `support@meigen.ai` 请求移除。 |
| 注意区分 | GitHub 上还有 [`MeiGen-AI`](https://github.com/MeiGen-AI) 研究组织，包含 MultiTalk / InfiniteTalk / PosterCraft 等开源项目；X 搜索会混入这些内容，不能直接当作 meigen.ai prompt gallery 的传播数据。 |

## X 推广结构

### 1. 主账号：弱品牌号，但会做内容分发和关系维护

`@meigen7982` 自身粉丝不大，近期原帖大多是产品更新、模型上线、精选 prompt 分享、引用创作者内容。它更像“产品 + 转发中枢”，不是主要流量源。

近期典型动作：

| 时间 | 帖子 | 指标 | 判断 |
| --- | --- | --- | --- |
| 2026-05-26 | 转发 [`@Just_sharon7`](https://x.com/Just_sharon7/status/2059212550253035998) 的 MeiGen 推荐帖 | 原帖约 55.3K views、705 likes、130 retweets、154 bookmarks | 主账号借外部 AI creator 的受众放大，而不是自己首发。 |
| 2026-05-25 | 发布 Seedance 2 prompt share，署名 [`@ShamiWeb3`](https://x.com/ShamiWeb3) | 约 418 views、10 likes | 用“Prompt by @creator”维持创作者关系。 |
| 2026-05-20 | 引用 [`@AmirMushich`](https://x.com/AmirMushich/status/2056833877532983430) 的设计 prompt，并说为它做了 canvas | 主帖约 6.7K views；被引用帖约 58.1K views、973 likes、1,371 bookmarks | 针对高质量设计创作者做“主题 board / canvas”，把 creator 内容产品化。 |
| 2026-05-14 | 宣称 curated top 3,000 high-quality AI prompts from 50,000+ viral posts | 约 462 views | 关键卖点是“从 X 爆款里筛出来”，不是普通 prompt 库。 |
| 2026-04-14 | 上线 200+ Seedance 2.0 video prompts，强调来自 X viral posts | 约 286 views | 持续追模型热点，把 image prompt gallery 扩到 video prompt gallery。 |

### 2. 外部大号/中腰部创作者：真正的曝光入口

这些账号不是都等于“转发大 V”，更准确说是“发帖推荐 / 引用 / 参与扩散”的外部节点。部分账号 bio 明确写了 `DM for promo / collaboration`，需要按可能的付费推广或互推来看。

| 账号 | 量级 | 代表帖 | 指标 | 推广话术 / 作用 |
| --- | ---: | --- | ---: | --- |
| [`@hasantoxr`](https://x.com/hasantoxr/status/2048035574834229535) Hasan Toor | 438K followers | 2026-04-25 介绍 MeiGen 是 “Pinterest of AI image prompts” | 117.6K views、1,763 likes、217 retweets、3,062 bookmarks | 最大的公开传播节点之一。话术极简：免费、Pinterest、viral prompts、no prompt engineering。 |
| [`@Just_sharon7`](https://x.com/Just_sharon7/status/2059212550253035998) Sharon Riley | 43K followers | 2026-05-26 推荐 `@meigen7982`，主账号随后转发 | 55.3K views、705 likes、130 retweets、154 bookmarks | 明确 AI creator / DM for promo 账号。她 2026-05-11 还发过一轮线程，约 38.6K views、577 likes。 |
| [`@AmirMushich`](https://x.com/AmirMushich/status/2056833877532983430) Amir Music | 65K followers | “15 graphic design styles” prompt 线程被 MeiGen 做成 board/canvas | 58.1K views、973 likes、1,371 bookmarks | 更像内容源和审美背书，不只是推广号。适合做“creator board”合作。 |
| [`@GitTrend0x`](https://x.com/GitTrend0x/status/2055874091958272137) GitTrend | 20K followers | 介绍 `MeiGen-AI-Design-MCP` | 8.0K views、56 likes、11 retweets | 开源/MCP/Claude Code 圈层的入口。 |
| [`@Pluvio9yte`](https://x.com/Pluvio9yte/status/2021057160768082105) 雪踏乌云 | 35K followers | 介绍 MeiGen-AI-Design-MCP 和内置 prompt 库 | 15.2K views、151 likes、234 bookmarks | 中文 AI 编程/出海圈对开发者工具的传播。 |
| [`@qisi_ai`](https://x.com/qisi_ai/status/2050782016682295681) 骑司Chase | 14K followers | 说发现了认真收录高品质提示词的网站 | 4.9K views、24 likes | 中文 AI 落地/工具圈。 |
| [`@xRahultripathi`](https://x.com/xRahultripathi/status/2053762456288370973) Rossy | 4K followers | 用“X 上保存 prompt 后找不到”的痛点推荐 MeiGen | 2.6K views、37 likes | 小号但话术贴近真实使用场景。 |
| [`@lucas_flatwhite`](https://x.com/lucas_flatwhite/status/2051227668847419838) lucas | 14K followers | 韩语推荐 “生成 AI 版 Pinterest” | 11.9K views、96 likes、25 retweets | 说明传播已经跨到韩语圈。 |
| [`@AbeerAlhasan`](https://x.com/AbeerAlhasan/status/2054504223211917405) Abeer Alhasan | 59K followers | 阿语推荐 prompt collection 网站 | 1.7K views、35 likes | 中东/阿语圈的低成本外溢测试。 |

### 3. 开发者渠道：GitHub repo 是另一条增长线

MeiGen 不只做面向创作者的 gallery，还把 prompt 数据和生成能力拆到开发者生态：

- [`jau123/nanobanana-trending-prompts`](https://github.com/jau123/nanobanana-trending-prompts)：590 stars / 77 forks；README 写明 `1,400+ curated AI image prompts from X/Twitter, ranked by engagement`，总量 1,446，按 Photography、Product & Brand、Poster Design 等分类。
- [`jau123/MeiGen-AI-Design-MCP`](https://github.com/jau123/MeiGen-AI-Design-MCP)：1.2K stars / 157 forks；定位是把 Claude Code、Cursor、Codex、OpenClaw、Hermes Agent 等变成 AI image/video design assistant。
- X 上的 `GitTrend0x`、`Pluvio9yte` 等传播点主要打的不是“prompt gallery”，而是“Claude Code / OpenClaw 专业图片视频设计神器”“MCP server + prompt library”。

这条线的价值在于：同一个内容资产被包装成两个入口。

```text
普通创作者入口：免费 gallery / copy prompt / one-click generate
开发者入口：open-source prompt dataset / MCP server / Claude Code + Cursor workflow
```

## 产品内置的 X 放大机制

MeiGen 官网和文档里有几个明确的社媒增长设计：

1. **Gallery 内容来自 X**：官网卡片直接显示原作者、`@username`、like count、view count、模型标签。
2. **View on X**：文档说明每张卡片可打开原始 X 帖，用户能看到上下文、回复和作者其他作品。
3. **Use Idea / Use as Prompt / Use as Reference**：不是只复制文字，而是把外部 X 内容直接变成生成动作。
4. **Creator credit**：每个 prompt card 保留作者头像、名称和 X 账号，降低“搬运感”，也给创作者被发现的理由。
5. **Referral 激励**：官网有 “Invite friends, get 200 credits” 的分享入口。

这使 MeiGen 的增长飞轮不是传统 SaaS 的“发帖宣传产品”，而是：

```text
X 创作者发 prompt
-> MeiGen 收录并署名
-> 用户在 MeiGen 复用
-> MeiGen 再把 creator/content 作为社媒素材发回 X
-> 创作者或 AI 工具号再转发/推荐
```

## 话术与内容模板

外部推广帖高频使用的卖点非常固定：

- `Pinterest for AI image prompts`
- `free gallery`
- `viral prompts`
- `GPT Image 2 / Nano Banana / Seedance / Veo / Midjourney`
- `no prompt engineering`
- `copy the prompts that already worked`
- `stop saving tweets / no more hunting`
- `one-click generation`

这个话术有三个优点：

1. 不教育模型原理，直接打用户痛点：不会写 prompt、收藏太乱、找不到爆款案例。
2. 借 X 的社交证明：不是 MeiGen 自称好，而是“这些 prompt 已经在 X 上爆过”。
3. 兼容多语种传播：英文、中文、日文、韩文、阿语都可以复述“AI prompt Pinterest”这个比喻。

## 对 VogueAI 的可复用打法

### 可以直接复制

1. **把 X prompt 来源产品化**  
   Gallery 卡片必须保留原作者、X 链接、指标、模型、完整 prompt；VogueAI 不要只做“漂亮图”，要做“可验证的 prompt 来源库”。

2. **做 creator board / style board**  
   MeiGen 为 `@AmirMushich` 这种设计创作者做 canvas/board 的动作值得学。VogueAI 可以做 `VogueAI Creator Board: @xxx`，比普通转发更容易让创作者愿意互动。

3. **用中腰部 AI creator 做推广测试**  
   优先找 `10K-80K followers` 的 AI tool / AI design / prompt creator 账号，不一定一开始找超大号。Sharon 这类账号的转化不一定最高，但适合测试话术和素材。

4. **双入口包装同一资产**  
   普通用户看到的是 prompt gallery；开发者看到的是 open dataset / MCP / CLI / skill。VogueAI 后续可以把精选 prompt 资产拆成 GitHub repo、JSON、Obsidian/CSV 或 MCP 搜索工具，打进 AI coding 圈层。

5. **固定一句外部传播话术**  
   VogueAI 不要每次讲不同卖点。可以测试一句类似：  
   `Browse real AI image examples from X, copy the prompt, and generate your own version.`

### 需要避开

1. **不要只靠付费推广号**  
   `DM for promo` 型账号能带曝光，但粉丝质量和转化不一定稳定。必须同时做创作者署名、SEO、GitHub/open dataset 和产品内收藏/分享。

2. **不要把 X 索引做成无 attribution 搬运**  
   MeiGen 至少保留作者、X 原帖和移除渠道。VogueAI 如果做类似内容源，也要有清晰的 credit / takedown / View on X 机制。

3. **不要混淆品牌噪音**  
   `MeiGen-AI` 研究组织的 MultiTalk / InfiniteTalk / PosterCraft 在 X 上有很多传播，但这不等于 meigen.ai prompt gallery 自身的增长。做竞对复盘时要把 prompt gallery 产品和 research-org 热度分开。

## VogueAI 下一步建议

1. 在 VogueAI 里先做一个 `X Prompt Source` 字段体系：`sourceUrl`、`sourceAuthor`、`sourceHandle`、`sourceViews`、`sourceLikes`、`sourceCollectedAt`、`sourceModel`。
2. 挑 30 个高质量 AI visual creator 做第一批 creator board，不追求全量抓取，先追求审美和署名关系。
3. 做 2 条外部推广测试话术：  
   - `Pinterest for AI image prompts` 型：打灵感和收藏痛点。  
   - `Copy prompt -> generate same style` 型：打产品闭环。
4. 找 5 个中腰部账号做首轮互推/付费测试，重点观察 bookmark / profile click / signup，而不是只看 likes。
5. 做一个轻量 public repo 或 JSON export，把 VogueAI prompt gallery 包装成开发者资产，服务后续 MCP / Codex / Claude Code 场景。

## 参考来源

- [MeiGen 官网](https://www.meigen.ai/)
- [MeiGen Gallery Docs](https://docs.meigen.ai/en/features/gallery)
- [MeiGen Terms](https://www.meigen.ai/terms)
- [MeiGen Privacy Policy](https://www.meigen.ai/privacy-policy)
- [@meigen7982 / X](https://x.com/meigen7982)
- [jau123 GitHub Profile](https://github.com/jau123)
- [jau123/nanobanana-trending-prompts](https://github.com/jau123/nanobanana-trending-prompts)
- [jau123/MeiGen-AI-Design-MCP](https://github.com/jau123/MeiGen-AI-Design-MCP)
- [Hasan Toor 推广帖](https://x.com/hasantoxr/status/2048035574834229535)
- [Sharon Riley 推广帖](https://x.com/Just_sharon7/status/2059212550253035998)
- [AmirMushich 设计 prompt 帖](https://x.com/AmirMushich/status/2056833877532983430)
- [GitTrend MCP 推荐帖](https://x.com/GitTrend0x/status/2055874091958272137)
- [雪踏乌云 MCP 推荐帖](https://x.com/Pluvio9yte/status/2021057160768082105)
