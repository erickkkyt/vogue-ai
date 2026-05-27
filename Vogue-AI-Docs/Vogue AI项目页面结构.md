# Vogue AI 项目页面结构

> **当前项目状态**: 本文记录 Vogue AI 当前真实页面结构、路由分层、首页 gallery、`/app` 工作台和旧 SEO 页保留策略。顶部状态必须与 `src/app/**`、`src/components/**`、`src/app/sitemap.ts` 保持一致。
> **文档结构**: 先写当前页面真相，再写维护边界；旧阶段性方案不再展开保留。

## 当前项目状态

### 1. 当前页面分层

Vogue AI 当前是 Next.js App Router 项目，默认 SEO 入口使用英文 canonical 页面，同时保留 `src/app/[locale]/` locale shell routes 给产品 UI 和后续真实本地化使用。当前页面分为五层：

```text
src/app/
├── page.tsx                       # 首页：Vogue AI Prompt Gallery
├── app/page.tsx                   # 图片生成工作台
├── assets/page.tsx                # 用户生成资产，需要登录
├── pricing/page.tsx               # pricing 弹卡适配路由，重定向到首页弹卡
├── login/page.tsx                 # BetterAuth 登录页
├── payment/return/page.tsx        # Stripe Checkout 返回页
├── blog/**                        # 旧内容/博客资产
├── privacy-policy/page.tsx
├── terms-of-service/page.tsx
├── [locale]/**                    # locale shell routes，当前不作为独立 SEO 页面提交
└── legacy SEO pages               # veo-3、hailuo、baby、lipsync 等旧工具页
```

当前维护口径：

- `/` 是首页和主要 SEO 入口，保留 Vogue AI 品牌词，同时转向 prompt gallery。
- `/app` 是唯一真实图片生成工作台，不在每个旧工具页重复实现生成状态机。
- `/assets` 是用户历史资产入口，依赖 `user_asset` 和 `generation_history`。
- `/pricing` 当前不是独立 SEO 页，而是重定向到首页 pricing 弹卡。
- `/login` 等登录/内部页应保持 `noindex` 或不进入 sitemap。
- 有 GSC 曝光或历史流量的旧 SEO 工具页继续保留，因为它们代表历史搜索资产。
- `/seedance` 和 `/effect/earth-zoom` 当前仍可访问，但不进入 sitemap/sidebar/footer 主入口。

### 2. 当前公开页面清单

当前 sitemap 主动提交的公开页：

- `/`
- `/ai-baby-podcast`
- `/ai-baby-generator`
- `/veo-3-generator`
- `/hailuo-ai-video-generator`
- `/lipsync`
- `/blog`
- `/blog/[slug]`
- `/privacy-policy`
- `/terms-of-service`

当前不进入 sitemap 的页面：

- `/app`
- `/assets`
- `/login`
- `/pricing`
- `/seedance`
- `/effect`
- `/effect/earth-zoom`
- `/payment/return`
- `/api/**`
- `/zh/**`、`/fr/**`、`/ru/**`、`/pt/**`、`/ja/**`、`/ko/**` 等 locale shell routes，直到对应页面有真实本地化内容和本地化 metadata。

### 3. 首页结构

首页入口文件：

- `src/app/page.tsx`

首页当前结构：

```text
Sidebar shell
Prompt Gallery
Filter and model controls
Gallery cards
Home FAQ
Footer
```

核心数据来源：

- `src/lib/prompts.ts`
- `src/lib/generated/awesome-gptimage2-prompts.json`
- `src/components/prompts/VogueGalleryWorkspace.tsx`

首页目标：

- 保留 `Vogue AI` 品牌词搜索入口。
- 承接 `Nano Banana prompts`、`GPT Image prompts`、`image prompt examples`、`prompt gallery` 方向的需求。
- 让用户第一屏理解这是 prompt gallery + generator，而不是旧的泛工具站。
- 保持 gallery-first UX，不展示可见大 H1；SEO H1 使用 `sr-only`。
- 每张 prompt 卡片都能填入 prompt 或带参考图进入 `/app`。

### 4. `/app` 工作台结构

工作台入口：

- `src/app/app/page.tsx`
- `src/components/app/ImageWorkspace.tsx`

当前 `/app` 支持：

- 模型选择侧边栏
- gptimg 风格 prompt 输入与 GPT Image 2 6000 字上限
- 最多 6 个参考图槽位
- 本地参考图上传到 R2/对象存储
- image number
- aspect ratio
- resolution
- quality
- 登录态判断
- 生成前积分预检
- 提交 `/api/effects/generate`
- 轮询 `/api/effects/status`
- 展示当前任务和 `/api/assets/recent` 近期资产
- 复用 prompt、复用生成图作为参考图、下载生成资产
- provider 输出落入 `user_asset` / `generation_asset_link`

当前 `/app` 仍可以继续补齐：

- `/assets` 资产页的完整筛选、预览、复用动作
- 旧 SEO 工具页到新版 `/app` 的入口统一
- 后续视频/音频模型的同构 media schema

### 5. 旧 SEO 页维护边界

当前旧 SEO 页包括：

- `src/app/veo-3-generator/page.tsx`
- `src/app/hailuo-ai-video-generator/page.tsx`
- `src/app/ai-baby-generator/page.tsx`
- `src/app/ai-baby-podcast/page.tsx`
- `src/app/seedance/page.tsx`
- `src/app/lipsync/page.tsx`
- `src/app/effect/earth-zoom/page.tsx`
- `src/app/effect/page.tsx`

维护原则：

- 第一版不重写这些页面文案。
- 不删除、不 noindex、不随意 301。
- 后续如果要转成“工具内页”模板，应逐页检查 GSC 表现，再决定保留原 slug、优化 CTA、移出 sitemap 或重定向。
- 这些页面的生成入口应逐步导向 `/app`，避免继续维护旧的 per-tool API。
- `/seedance`、`/effect/earth-zoom` 当前因为没有 GSC 排名/曝光信号，不作为 sitemap 和主导航入口；若后续重新获得需求，应先恢复内容质量和内部链接，再考虑加入 sitemap。

### 6. canonical 与 sitemap

当前 sitemap 文件：

- `src/app/sitemap.ts`

当前 `BASE_URL` 固定为：

- `https://vogueai.net`

维护原则：

- sitemap 只提交公开可索引页。
- `/app`、`/assets`、`/login`、`/pricing`、`/payment/return` 不进入 sitemap。
- 当前多语言 route 是产品 shell，不是完整本地化 SEO 版本；在翻译完成前不提交 locale URL 和 hreflang alternates。
- 旧工具页只有在有 GSC 曝光/排名、历史 PV 或明确保留价值时进入 sitemap。
- 后续如果新增 prompt detail 页，应同步 sitemap、canonical 和内部链接。
