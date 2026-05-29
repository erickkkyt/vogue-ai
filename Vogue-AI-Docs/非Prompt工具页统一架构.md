# Vogue AI 非 Prompt 工具页统一架构

更新时间：2026-05-29

## 目标

Vogue AI 的非 prompt 页面统一改成 Tool-first landing page：首屏就是真实工具区，后续再承接示例、解释、功能、用例、FAQ 和内链。页面不是纯营销页上挂按钮，而是一个可承载后续 API 接入的产品工作台页面。

适用页面：

- `/veo-3-generator`
- `/hailuo-ai-video-generator`
- `/seedance`
- `/lipsync`
- `/ai-baby-generator`
- `/ai-baby-podcast`
- `/effect/earth-zoom`
- `/effect`

## 当前落地方式

已改成一套模板 + JSON 配置：

- 统一模板：`src/components/non-prompt/NonPromptToolPage.tsx`
- 配置类型和 registry：`src/lib/non-prompt-pages.ts`
- metadata 工厂：`src/lib/non-prompt-page-metadata.ts`
- 页面配置：`src/config/pages/non-prompt/*.json`
- 结构校验：`src/lib/non-prompt-pages.test.ts`

各路由只保留三件事：

1. 引入 `NonPromptToolPage`
2. 用 `createNonPromptPageMetadata(slug)` 生成 SEO metadata
3. 用 `getNonPromptPageConfig(slug)` 读取 JSON 配置

这样后续新增非 prompt 工具页时，不需要复制一组 React 组件，只需要新增 JSON、注册 slug、加路由入口和测试覆盖。

## 标准页面顺序

1. Tool Workspace 首屏
   - 左侧：H1、简短价值描述、prompt、上传、参数、Generate。
   - 右侧：预览、示例输出、生成状态、最近结果入口。
   - 工具本身就是 hero，不再用大幅营销 hero 抢首屏。

2. Example Gallery
   - 3-6 个真实示例。
   - 优先展示输入、prompt、输出效果。

3. What This Tool Creates
   - 解释当前页面主旨，不写泛品牌段落。
   - 例如 Earth Zoom 页解释 close-up to orbital Earth reveal。

4. How It Works
   - Add input。
   - Customize prompt/settings。
   - Generate and download。

5. Core Features
   - 4 个和当前工具强相关的能力点。

6. Best Use Cases
   - 4-6 个搜索意图明确的应用场景。

7. Topic-Specific Value Section
   - 标题必须匹配当前页面主题。
   - 例：`Why Earth Zoom Out Videos Work`、`Why Lip-Sync Videos Need Clean Audio-to-Face Matching`。

8. Related Tools
   - 同类工具互链，并导向核心工作台和核心模型页。

9. FAQ
   - 5-8 个高质量问题。
   - 覆盖用户搜索意图：输入格式、怎么做、生成时间、平台比例、商用、隐私、效果质量、常见失败原因。

10. Final Tool CTA
   - 回到 `#tool`，不再做单独大营销区。

## 首屏工具区布局

桌面端采用左右结构：

- 左侧 45%：Prompt / Upload / Settings / Generate。
- 右侧 55%：Preview / Example / Result / History。

移动端采用上下结构：

- 上：工具输入。
- 下：预览和结果。

## 页面差异

| 页面 | 左侧输入 | 右侧预览 |
| --- | --- | --- |
| `/veo-3-generator` | prompt、参考图、duration、aspect、quality | cinematic video preview |
| `/hailuo-ai-video-generator` | prompt/上传图、motion style、duration | image-to-video preview |
| `/seedance` | dance prompt、人物/参考图、motion style、duration | dance motion preview |
| `/lipsync` | 上传视频、上传音频/台词、语言 | lip-sync 前后对比 |
| `/ai-baby-generator` | 上传父母照片/描述、style、ratio | baby portrait preview |
| `/ai-baby-podcast` | topic/script、avatar style、voice、duration | podcast video preview |
| `/effect/earth-zoom` | 上传图片、zoom preset、duration、quality | Earth zoom out video preview |
| `/effect` | 上传图/prompt、effect preset、ratio、quality | 通用 effect preview |

## 新增页面流程

1. 在 `src/config/pages/non-prompt/` 新增 `<slug>.json`。
2. 在 `src/lib/non-prompt-pages.ts` import 并注册配置。
3. 新增或更新 `src/app/[locale]/<route>/page.tsx`，只渲染统一模板。
4. 如果有根路径 fallback，保持 redirect 到 `/en/<route>`；如果根路径需要承接 SEO，则复用 locale 页面。
5. 跑 `npx tsx --test src/lib/non-prompt-pages.test.ts` 和 `npm run typecheck`。
6. 本地打开该页面，同时抽查 `/`、`/app`、prompt gallery，确认没有被非 prompt 模板影响。

## 竞对参考要点

这次参考的不是逐字文案，而是页面信息架构和 FAQ 搜索意图：

- Flyne Earth Zoom：首屏直接是上传/生成工具，后面依次接 examples、features、advantages、use cases、manual、FAQ、related tools。
- EaseMate AI Image Generator：首屏同时承载 mode、upload、prompt 和模型选择。
- SuperMaker GPT Image 2：模型页采用 breadcrumb、工具区、相关工具、How-to、features、use cases、FAQ 的长页结构。
- Kapwing Veo、Hailuo Image-to-Video、Seedance、Media.io Lip Sync、Baby Generator、My Baby Podcast：FAQ 重点覆盖输入格式、prompt 写法、比例/时长、音频/语言、隐私/权利、商用和失败原因。

## UI 原则

- 保持 Vogue AI 当前浅色、精致、工具型视觉：`--vogue-page`、`--vogue-panel`、`--vogue-border`、`--font-vogue-sans`。
- 首屏工具区要稳定，不因上传、hover、按钮状态导致布局跳动。
- 卡片圆角控制在 8px 左右，避免旧页面那种过重的营销卡片感。
- 文案先服务工具任务，再服务 SEO。
- 原有 SEO 文案尽量保留，但必须重排到新框架中。
