# Vogue AI 产品体验优化建议

> **创建日期**: 2026-05-23  
> **讨论背景**: Vogue AI 当前已经从旧工具站转向 `AI Prompt Gallery + Image Generator`。本文梳理下一阶段应该如何围绕 prompt gallery、图像生成、视频生成和资产沉淀做产品体验优化。

## 1. 核心判断

Vogue AI 不应该被定义成一个简单的“提示词网站”。

更准确的产品定位应该是：

```text
Prompt Library + Visual Workflow
```

也就是：

```text
用户先看到高质量案例
-> 理解这类视觉结果怎么被生成
-> 替换变量并复用 prompt / reference
-> 进入 /app 生成自己的图片或视频
-> 保存 prompt、参考图、参数和结果
-> 后续继续 remix、复现、扩展成资产
```

因此，Vogue AI 真正解决的不是“给用户一段可复制 prompt”，而是帮助用户用更少试错，把模糊想法稳定变成可复用的视觉资产。

## 2. 用户真正的需求

### 2.1 不知道要生成什么

很多用户不是带着完整 prompt 进站，而是先在社交媒体或竞品里看到某种视觉效果，然后想找一个类似的起点。

Gallery-first 的价值就在这里：

- 先给用户视觉灵感，而不是让用户先面对一个空 prompt 输入框。
- 用图片降低理解成本。
- 用分类、模型、场景和热门排序帮助用户快速找到方向。
- 让用户看到“这个效果确实能生成出来”，增强尝试意愿。

### 2.2 知道想要什么，但不会表达

用户常见表达是：

```text
我想要一个高级感产品图
我想要小红书封面
我想要广告大片
我想要那种很电影感的镜头
```

这些不是模型可以稳定执行的完整视觉指令。Vogue AI 的 prompt 资产应该承担“翻译器”角色，把用户的模糊意图拆成：

- 主体
- 场景
- 构图
- 镜头
- 光影
- 色彩
- 材质
- 风格参考
- 输出用途
- 画幅和质量

### 2.3 试错成本太高

AI 生图和生视频都有时间成本、积分成本和心理成本。用户最怕的是连续生成多次都不对。

优化方向不是只提供更多 prompt，而是提供更稳定的起点：

- 推荐模型
- 推荐参数
- 可替换变量
- 参考图绑定
- 常见失败原因
- 同 prompt 多模型对比
- 生成前 prompt 检查和增强

### 2.4 跨模型不确定

同一句 prompt 在 GPT Image、Nano Banana、Midjourney、Seedance、Veo 等模型上的表现可能完全不同。

用户真正想知道的是：

- 这个场景适合哪个模型？
- 这个 prompt 在哪个模型上更稳？
- 哪个模型更适合文字、产品、人物、广告海报、视频镜头？
- 成本、速度、质量、稳定性分别如何？

这意味着 Vogue AI 后续需要从“prompt search”升级为“prompt + model decision”。

### 2.5 一致性难

商业用户最关心的往往不是单张图好不好看，而是一组图能不能统一：

- 人物一致
- 产品不变形
- 品牌色稳定
- 海报系列风格统一
- 视频首尾帧衔接自然
- 同一个 campaign 可以持续产出不同素材

因此，Vogue AI 的资产体系必须围绕“复现”和“一致性”展开，而不是只做历史记录。

### 2.6 资产没有沉淀

一次成功生成背后至少包含：

- prompt
- reference images
- model
- aspect ratio
- quality
- generation count
- output
- source gallery entry
- user edits

如果这些信息没有自动沉淀，下次用户很难复现，也很难把一次结果变成长期资产。

## 3. 建议功能方向

### 3.1 Prompt Recipe 卡片

当前 gallery 卡片不应该只展示图片和 prompt 摘要。更理想的卡片应该是一个完整“视觉配方”。

建议每个 prompt entry 增加：

- 原始 prompt
- 推荐模型
- 推荐比例
- 推荐质量
- 适合场景
- 风格标签
- 可替换变量
- 参考图
- 来源链接
- 可复现评分
- 生成稳定性说明

卡片文案应该从“这是什么图”升级为“这个配方适合帮你完成什么任务”。

示例：

```text
适合：电商广告主图 / 社媒海报 / 品牌 KV
模型：GPT Image 2
稳定性：高
变量：[product] [brand color] [background]
```

### 3.2 一键 Remix，而不是只复制 prompt

`Copy Prompt` 是低阶动作，`Remix` 才是更强的产品动作。

建议 gallery 卡片主操作调整为：

- `Use Prompt`: 把 prompt 带入生成器。
- `Use as Reference`: 把图片作为参考图带入生成器。
- `Remix`: 打开变量替换表单。
- `Compare Models`: 查看同一 prompt 在不同模型上的适配建议。

`Remix` 可以先做轻量版本：

```text
Product / Subject:
Brand color:
Background:
Style:
Aspect ratio:
Model:
```

用户填完后，系统生成最终 prompt，再跳转 `/app`。

### 3.3 Prompt 变量系统

很多优质 prompt 本质上是模板，里面有一部分可以稳定替换。

建议把 prompt 里的变量结构化：

```text
[subject]
[product]
[brand]
[color palette]
[scene]
[camera angle]
[motion]
```

前端展示时可以把变量高亮，用户点击变量即可替换。

这个功能的价值：

- 降低普通用户编辑长 prompt 的压力。
- 让 prompt 更像可复用模板。
- 后续可以做 programmatic SEO，比如 `AI product poster prompt template`、`brand campaign prompt template`。

### 3.4 Same Prompt 多模型对比

这是值得优先做的差异化功能。

每个 prompt detail 页面可以展示：

| 模型 | 适合程度 | 优点 | 风险 |
| --- | --- | --- | --- |
| GPT Image 2 | 高 | 商业图、文字、广告视觉更稳 | 成本相对高 |
| Nano Banana | 中高 | 趣味玩法、快速改图、社媒传播 | 商业质感可能不稳定 |
| Midjourney | 中 | 美术风格强 | 可控性和复现成本高 |
| Seedance | 中高 | 可从首帧延展成短视频 | 需要更明确的镜头动作 |
| Veo | 中高 | 电影感和动态表现强 | prompt 需要视频化重写 |

这个能力能把 Vogue AI 从 prompt 复制站升级为模型选择助手。

### 3.5 Prompt QA / Enhance

用户输入 prompt 后，系统应该能主动判断这条 prompt 是否完整。

可检查维度：

- 是否缺少主体
- 是否缺少场景
- 是否缺少构图
- 是否缺少光影
- 是否缺少风格
- 是否缺少输出用途
- 是否存在冲突描述
- 视频 prompt 是否缺少镜头运动
- 是否超过当前模型字符限制

输出方式不要做成长篇解释，建议是轻量提示：

```text
This prompt may be missing lighting and composition. Enhance before generating?
```

中文 UI 可以是：

```text
这条提示词缺少光影和构图信息，建议先增强再生成。
```

### 3.6 资产 Kit

当前 `/app` 已有 reference image 和 user asset 基础。下一阶段应该把资产从“历史图片”升级为“可复用素材包”。

建议新增四类 Kit：

- `Brand Kit`: 品牌色、品牌风格、Logo、字体、产品关键词。
- `Product Kit`: 产品图、包装图、材质、卖点。
- `Character Kit`: 人物参考、角色设定、服装、表情、姿态。
- `Style Kit`: 风格图、色彩、摄影/插画风格、构图偏好。

用户可以从 gallery prompt 里选择一个配方，再绑定自己的 Kit：

```text
Use this poster prompt + my Product Kit + my Brand Kit
```

这会让 Vogue AI 从一次性生成器变成长期资产工作台。

### 3.7 视频 Shot Recipe

视频 prompt 不应该只是图片 prompt 的延伸。

视频用户真正需要的是镜头配方：

- 起始画面
- 结束画面
- 主体动作
- 镜头运动
- 节奏
- 时长
- 画幅
- 首帧/尾帧参考图
- 字幕或画面文案
- 平台用途，比如 TikTok、Reels、YouTube Shorts

建议把视频 prompt 页面命名和结构升级为 `Shot Recipe` 或 `Scene Recipe`。

示例结构：

```text
Scene:
Subject:
Motion:
Camera:
Lighting:
Duration:
First frame:
Last frame:
Negative constraints:
```

这会比普通 prompt 更贴近 Seedance、Veo、Kling、Wan 等视频模型的真实工作方式。

### 3.8 按任务搜索，而不是只按模型搜索

模型筛选有价值，但用户更常见的入口是任务。

建议一级筛选优先覆盖：

- Product & Brand
- Poster & Ads
- Portrait & Avatar
- Social Cover
- UI & Mockup
- Character Design
- Video Opening
- Ecommerce Listing
- Text Layout

模型筛选作为第二层：

- GPT Image
- Nano Banana
- Midjourney
- Seedance
- Veo

这样更符合用户心理路径：

```text
我想做一个东西
-> 看哪类模板
-> 再选择适合模型
```

而不是：

```text
我先知道某个模型
-> 再猜它能做什么
```

### 3.9 Prompt Detail 页面

Vogue AI 后续需要独立 `/prompts/[id]` 页面。

详情页承担四个职责：

- SEO 长尾承接
- 视觉配方展示
- 生成器转化
- 来源和可信度说明

建议详情页结构：

```text
Hero image / gallery images
Prompt recipe
Editable variables
Recommended model and parameters
Use Prompt / Remix / Use as Reference
Same prompt model comparison
Similar prompts
Source attribution
FAQ
JSON-LD schema
```

这比把所有内容都塞在首页更稳，也更利于 sitemap、canonical、schema 和搜索长尾。

### 3.10 可信度与可复现性标识

用户会怀疑 prompt 是否真的能生成类似结果。

建议增加：

- `Verified Prompt`
- `Generated with GPT Image 2`
- `Includes reference image`
- `Stable with product photos`
- `Best for portrait`
- `Needs manual text cleanup`
- `Last tested`

这类标签会比单纯 likes/views 更能建立信任。

## 4. 产品优先级

### P0: 把 gallery 到生成器的闭环打磨顺

目标是让用户从首页任意高质量案例进入 `/app` 后，不需要重新整理素材。

必做项：

- `Use Prompt` 带 prompt、model、参数进入 `/app`。
- `Use as Reference` 带 reference image 进入 `/app`。
- 同时点击时，prompt 和 reference 应该绑定进入同一次生成。
- `/app` 能保存生成结果、prompt 和 reference。
- 生成后可以再次 `Use Prompt` 或 `Remix`。

成功标准：

```text
看见图 -> 点击 -> 生成自己的版本
```

这个过程应在 30 秒内完成理解，不需要用户学习产品。

### P1: Prompt Recipe 与 Remix

目标是把 prompt 从长文本变成可编辑模板。

必做项：

- prompt 变量高亮
- remix 表单
- 推荐模型和参数
- prompt enhance
- prompt QA

成功标准：

- 用户不需要读完整 prompt，也知道可以改哪里。
- 普通用户能把示例改成自己的产品/人物/场景。
- 生成前 prompt 质量明显提升。

### P2: Prompt Detail 与 SEO 长尾

目标是把 gallery 内容资产变成可索引、可分享、可复访的页面。

必做项：

- `/prompts`
- `/prompts/[id]`
- 分类页
- model 页
- schema
- sitemap
- canonical
- similar prompts

成功标准：

- 搜索引擎能读到 prompt、图片、标题、描述、模型和来源。
- 每个 prompt 都有可分享 URL。
- prompt detail 能稳定导向 `/app`。

### P3: Asset Kit 与一致性工作流

目标是从一次性生成工具升级为长期创作工作台。

必做项：

- Brand Kit
- Product Kit
- Character Kit
- Style Kit
- Kit 与 gallery prompt 组合生成
- Kit 级历史和复用

成功标准：

- 用户能围绕同一个产品/角色/品牌连续生成多张一致图片。
- 用户愿意回到 Vogue AI 管理素材，而不是只把它当一次性 prompt 复制站。

### P4: 视频 Shot Recipe

目标是把视频 prompt 从文本模板升级为镜头工作流。

必做项：

- 视频 prompt 结构化
- 首帧/尾帧绑定
- 镜头运动模板
- 平台用途模板
- 图片 prompt 到视频 prompt 的转换

成功标准：

- 用户可以从一张 gallery 图片延展出短视频。
- 视频生成不是盲写 prompt，而是可编辑 shot recipe。

## 5. 页面和信息架构建议

建议长期结构：

```text
/
/app
/assets
/prompts
/prompts/[category]
/prompts/model/[model]
/prompts/[id]
/video-prompts
/video-prompts/[id]
/model-comparison
/docs 或 blog
```

首页继续保持 gallery-first，不要变回传统营销页。

首页应该承担：

- 快速展示高质量 prompt examples
- 提供搜索和筛选
- 让用户一键进入生成器
- 展示最少量品牌和信任信息

详情页承担：

- 长尾 SEO
- prompt 完整解释
- 模型和参数推荐
- source attribution
- similar prompts

`/app` 承担：

- prompt 编辑
- reference 管理
- 参数选择
- 生成
- 保存
- 再利用

`/assets` 承担：

- 生成结果管理
- prompt 历史
- reference 历史
- Kit 管理

## 6. 推荐指标

第一阶段不要只看 PV，应重点看 prompt 到生成的转化。

建议埋点：

- gallery card impression
- prompt detail view
- use prompt click
- use as reference click
- remix click
- app generation start
- app generation success
- asset saved
- prompt copied
- prompt enhanced
- prompt reused from asset

核心指标：

```text
Gallery -> App CTR
App -> Generation Start Rate
Generation Success Rate
Generated Asset Save Rate
Prompt Reuse Rate
Reference Reuse Rate
```

如果后续做 detail 页面，还需要看：

```text
Prompt Detail -> App CTR
Prompt Detail Organic Traffic
Similar Prompt Click Rate
```

## 7. 竞品启发

### MeiGen

MeiGen 的核心启发不是视觉风格，而是低 time-to-value：

```text
进入页面
-> 看到 gallery
-> 找到 prompt
-> Use Idea / reference
-> 生成
```

同时它把 prompt gallery、生成器、API/MCP、Figma/OpenClaw 等外部生态连接起来，说明 prompt 资产可以不仅服务网页用户，也可以服务开发者和创作者工具流。

对 Vogue AI 的启发：

- 首页继续 gallery-first。
- 不要让大输入框压过内容流。
- card action 必须清晰。
- prompt 和 reference 应该成对进入生成器。
- 后续可以考虑 API/MCP/Figma 插件等外部入口，但第一阶段不要分散主线。

### Krea

Krea 的启发是“创作套件”，不是单个生成器：

- 多模型
- 参考图
- 实时迭代
- 视频
- enhancer
- edit
- training / consistency

对 Vogue AI 的启发：

- 多模型选择应该围绕任务，而不是只做下拉菜单。
- reference 和 style 不应只是上传控件，而是核心创作资产。
- 长期要做一致性能力，例如 Product Kit、Brand Kit、Character Kit。

### PromptHero / PromptBase

PromptHero 代表免费 prompt 搜索和大规模社区发现。

PromptBase 代表 prompt 作为可交易资产的逻辑。

对 Vogue AI 的启发：

- 不要只拼数量，要拼“可生成、可复用、可转化”。
- prompt 需要可信度、来源和可复现性。
- 如果未来开放社区或 premium prompt，必须先有质量标准和审核机制。

## 8. 近期可执行路线

建议按四周拆：

### 第 1 周: 生成闭环

- 确认首页所有卡片的 `Use Prompt` 能正确进入 `/app`。
- 确认 `Use as Reference` 可以携带图片进入 `/app`。
- 确认 prompt + reference 同时进入生成器。
- 给 gallery action 做更明确的 hover / mobile 状态。

### 第 2 周: Recipe 数据结构

- 给 prompt entry 增加 category、scenario、tags、recommendedModel、recommendedAspectRatio。
- 给 prompt 文本增加变量识别。
- 前端高亮变量。
- 做 Remix 表单第一版。

### 第 3 周: Prompt Detail

- 新增 `/prompts/[id]`。
- 写入 SEO metadata 和 JSON-LD。
- 加 source attribution。
- 加 similar prompts。
- detail 页面主 CTA 跳 `/app`。

### 第 4 周: Prompt QA / Enhance

- 增加 prompt 检查。
- 增加 prompt enhance。
- 根据模型限制显示不同建议。
- 记录 enhance 后生成转化。

## 9. 不建议优先做的事

### 不建议优先做纯社区

开放提交、点赞、评论、关注这些功能在没有质量标准前会制造审核和内容质量问题。

更好的顺序：

```text
官方精选内容
-> 半开放投稿
-> 审核后发布
-> 创作者主页
-> 社区互动
```

### 不建议优先做 prompt marketplace

付费 prompt 会立刻带来可复现性、版权、退款和质量争议。

如果要做，应该先有：

- verified prompt
- tested model
- refund policy
- source attribution
- content moderation
- creator agreement

### 不建议把首页改成营销落地页

Vogue AI 当前最强的第一屏应该是 gallery，不是大 hero。

用户来这里不是先读愿景，而是先找可用效果。营销信息可以放在轻量 FAQ、footer、docs 或 blog 中。

## 10. 最终目标

Vogue AI 最终应该让用户形成这样的心智：

```text
我不是来这里学习 prompt engineering。
我是来这里找到一个能出结果的视觉配方，
再把它变成我的产品图、海报、头像、广告图或短视频素材。
```

如果这条心智成立，Vogue AI 的竞争点就不是 prompt 数量，而是：

- 发现效率
- 生成稳定性
- 模型选择能力
- 参考图工作流
- 资产沉淀
- 复现和一致性

这才是比单纯 prompt copy 更长期的产品价值。
