# Vogue UI 准则

## 设计方向

Vogue AI 当前 UI 采用 gallery-first 的轻量产品界面：左侧为稳定导航，右侧优先展示图片和 prompt workflow。整体参考 MeiGen 的低边框、浅蓝 tint、轻阴影和明确主操作，但保留 Vogue AI 自己的清爽编辑感，不做厚重营销页。

## 字体系统

全站字体走 `--font-vogue-sans`：

- macOS / iOS: `SF Pro Text`, `SF Pro Display`
- Windows: `Segoe UI`
- 中文 fallback: `PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei UI`, `Noto Sans CJK SC`

正文基准来自侧边栏导航：

- 正文: `14px`
- 正文行高: `1.62`
- 正文字重: 默认 `400`; 导航、按钮和短 label 可用 `500`
- 小标签 / eyebrow: `12px`
- 卡片标题: `16px`
- 不使用负字距，`letter-spacing: 0`

## 标题层级

标题参考 MeiGen 的紧凑黑体风格：字号不要做成营销页 hero，重点靠字重、清晰层级和留白表达。

- H1 / 页面标题: `clamp(1.75rem, 2.2vw, 2rem)`, weight `700`, line-height `1.12`
- H2 / section 标题: `clamp(1.375rem, 1.6vw, 1.625rem)`, weight `700`, line-height `1.16`
- H3 / 卡片标题: `16px`, line-height `1.28`
- FAQ 问题、pricing plan name、feature card title 走 H3/card title 规则
- H1 和 H2 的差异主要在字号和上下文位置，正文不跟随标题放大

## 正文规则

模型页、定价弹层、FAQ、Footer、Assets、Effect 等页面的主体正文统一为 `14px`。对应 CSS 作用域：

- `.vogue-shell`
- `.vogue-marketing-light`
- `.vogue-pricing-light`

这些作用域下的 `p`, `li`, `summary`, `dd`, `blockquote` 都应保持 `14px / 1.62`。如果局部内容需要更大，优先把它升级为标题或数字指标，而不是放大正文段落。

## 侧边栏规则

侧边栏是全站正文尺度的基准：

- 主导航: `14px`, weight `500`
- 分组标题: `12px`, weight `500`
- Credits label: `12px`
- 用户名 / Sign in: `14px`, weight `500`
- 辅助文本如邮箱: `12px`
- 导航 icon: `16px`

侧栏底部账户区使用浅蓝 tint，不用重边框：

- 面板 tint: `rgba(246,251,255,0.92)` 到 `rgba(237,247,255,0.76)`
- ring: `#d9e8ff / 45%`
- Sign in 保持深色主按钮，避免和 Credits 混成两个同权重卡片

## Prompt Card Hover

卡片 hover 的目标是图片优先，动作轻量。

- 遮罩只在底部加强，不压暗整张图
- 图片 hover scale: 约 `1.022`
- 卡片 action 行:
  - `Use Prompt`: `32px` 高, `12px`, weight `500`, 白底
  - `Use as Ref`: 和 `Use Prompt` 完全一致
  - X/source icon: `32x32`, 黑底白标, 靠右
  - icon: `12px`
  - 圆角: `11px`
  - action 行 gap: `8px`

当前实测 hover action 尺寸：

- `Use Prompt`: 约 `116x32`
- `Use as Ref`: 约 `109x32`
- X/source: `32x32`

## Prompt Composer

`/app` 和 gallery 底部 composer 需要和 `gptimg` 的 prompt composer 保持同构，Vogue AI 只替换为浅色配色。

- 外层 panel: `rounded-[24px]`, `px-3 pb-2.5 pt-2.5`, `sm:rounded-[28px]`, `lg:px-5 lg:py-4`
- Reference slot: `78x78`, `sm:88x88`, `rounded-2xl`, `border-2 border-dashed`
- textarea: `h-[86px]`, `sm:h-[76px]`, `md:h-[82px]`
- textarea text: mobile `14px`, desktop `16px`, `font-medium`, line-height `1.5 / 1.55`
- textarea padding: `px-0 pr-24 py-0`
- character counter: `10px`, pill, top-right
- control row: `min-height 46px`, `mt-2`, controls height `36px`
- model selector: `148px` minimum, `h-9`, `rounded-[16px]`, `text-[14px]`
- parameter trigger: `h-9`, `text-[14px]`, `tracking-tight`
- Generate: 和 `gptimg` 一致使用 `home-generate-button` 结构与动效，但配色必须是 Vogue 的浅色玻璃按钮；`h-11`, desktop `42px`, min-width `196px`, rounded `1.1rem`
- Generate 内部展示积分，不在 composer control row 里再放一组独立 credits pill

## App Workspace

`/app` 顶部信息也要回到正文体系，不要用过重的 uppercase tracking。

- Eyebrow: `14px`, weight `500`, `tracking-normal`
- H1: `28-30px`, weight `700`, line-height `1.12`
- Timeline label: `14px`, weight `500`, `tracking-normal`
- Timeline H2: `22-24px`, weight `700`, line-height `1.16`
- 顶部 Credits / Estimate pill: `14px`, weight `500`
- Timeline 外框保持轻：浅白面板、弱 ring、低阴影；空状态不要再用大虚线框

## Assets / Creations Page

资产页外层参考 MeiGen Creations 的大画布框架，但内部资产行为保留。

- Page background: soft side tint gradient
- Main canvas: near-full viewport white panel, `rounded-[36px]` desktop
- Top bar: `Back` + `Creations` left aligned, view toggle icons right aligned
- Empty state centered: compact icon, `The canvas is blank`, body `14px`
- Asset actions keep `Use Prompt`, `Use as Ref`, `Download`, and existing prompt/reference handoff logic

## Pricing Card

Pricing card 遵循正文 14px，不再用大段 `text-lg/text-xl` 做说明。

- plan name: card title `16px`
- description/features: `14px / 1.62`
- price 数字可以大，作为数据指标保留 `text-3xl/text-4xl`
- CTA: `14px`, weight `600-700`
- badge/label: `11-12px`, uppercase 可保留但不要过宽

## 页面实现原则

新页面优先套已有作用域，而不是单独堆字号：

- 公共产品/模型页根节点用 `.vogue-marketing-light`
- 定价弹层用 `.vogue-pricing-light`
- 侧栏包裹的应用/画廊页面走 `.vogue-shell`

写新组件时，默认正文不要超过 `text-sm`。如果想强调内容，优先调整布局、字重、颜色、留白或标题层级，不要把正文扩大到 `text-lg/text-xl`。
