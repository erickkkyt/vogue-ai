# VogueAI Prompt Detail Indexing Batch - 2026-06-29

## Summary

- Added 40 prompt detail pages to the indexable allowlist.
- Indexable prompt detail pages: 173 -> 213.
- Prompt library size: 1960 entries.
- Selection focus: high-intent long-tail searches around product images, ecommerce mockups, brand/logo prompts, portrait/headshot prompts, YouTube/social thumbnails, UI mockups, infographics, and poster prompts.
- Guardrails: skipped known brand/IP-heavy prompts, weak scraped titles, duplicate series pages, and audit review/fail pages.

## Selected Pages

| # | Public ID | Cluster | Target long-tail intent | URL |
| --- | --- | --- | --- | --- |
| 1 | 010101019 | Product / ads | photorealistic product campaign prompt | /prompt/photorealistic-premium-product-campaign-poster-010101019 |
| 2 | 030101041 | Product / beauty | beauty product closeup AI prompt | /prompt/high-end-beauty-product-closeup-campaign-ai-030101041 |
| 3 | 010101086 | Product / bottle ad | glass bottle product ad prompt | /prompt/peche-silk-elegant-frosted-glass-bottle-ad-poster-010101086 |
| 4 | 010101096 | Product / visualization | technical product visualization prompt | /prompt/technical-product-visualization-ai-010101096 |
| 5 | 010101065 | Product / hero image | hero product shot prompt | /prompt/hero-product-shot-poster-010101065 |
| 6 | 010101056 | Ecommerce | ecommerce product main image prompt | /prompt/e-commerce-main-image-luxury-skincare-product-page-010101056 |
| 7 | 010101059 | Ecommerce | ecommerce main image Chinese aesthetics prompt | /prompt/e-commerce-main-image-new-chinese-aesthetics-style-010101059 |
| 8 | 010101092 | Packaging | packaging proposal board prompt | /prompt/velvet-bite-packaging-proposal-board-ai-010101092 |
| 9 | 010205052 | Product / bento grid | liquid glass product bento grid prompt | /prompt/premium-liquid-glass-bento-grid-product-010205052 |
| 10 | 010101100 | Product / packaging | collectible figure packaging prompt | /prompt/collectible-figure-packaging-poster-ai-010101100 |
| 11 | 010101075 | Brand / logo | mascot brand identity board prompt | /prompt/mascot-brand-identity-board-010101075 |
| 12 | 010101102 | Brand / logo | kawaii symbol logo prompt | /prompt/minimal-kawaii-symbol-logo-ai-010101102 |
| 13 | 010101068 | Brand / logo | Japanese logo prompt | /prompt/bold-japanese-logo-010101068 |
| 14 | 010201001 | Brand visual | brand visual prompt | /prompt/sunrise-in-heaven-brand-visual-010201001 |
| 15 | 030102056 | Brand campaign | fashion brand campaign visual prompt | /prompt/luxury-fashion-brand-campaign-visual-system-ai-030102056 |
| 16 | 010106041 | Brand / merch | anime character brand identity merch prompt | /prompt/anime-character-brand-identity-merch-board-010106041 |
| 17 | 030105025 | Portrait / avatar | consistent avatar emotion grid prompt | /prompt/consistent-avatar-emotion-grid-ai-030105025 |
| 18 | 030103019 | Portrait / founder | startup founder editorial portrait prompt | /prompt/startup-founder-editorial-portrait-ai-030103019 |
| 19 | 010103005 | Portrait / identity | identity preserved portrait prompt | /prompt/identity-preserved-editorial-portrait-010103005 |
| 20 | 030103023 | Portrait / edit | cinematic street portrait sketch board prompt | /prompt/identity-preserved-cinematic-street-portrait-with-sketch-board-030103023 |
| 21 | 010103064 | Portrait / image-to-image | image to image portrait prompt | /prompt/image-to-image-golden-hour-lakeside-editorial-portrait-010103064 |
| 22 | 010108062 | Portrait / selfie edit | selfie cartoon doodle transform prompt | /prompt/reference-selfie-cartoon-doodle-transform-010108062 |
| 23 | 010105110 | Portrait / grid | fashion portrait grid prompt | /prompt/high-fashion-3x3-grid-portrait-ai-010105110 |
| 24 | 010104032 | YouTube / thumbnail | YouTube tech tutorial thumbnail prompt | /prompt/youtube-thumbnail-tech-tutorial-thumbnail-with-ui-mockup-010104032 |
| 25 | 010102077 | YouTube / thumbnail | Japanese YouTube thumbnail prompt | /prompt/flashy-japanese-youtube-thumbnail-010102077 |
| 26 | 010102076 | YouTube / thumbnail | chibi YouTube thumbnail prompt | /prompt/youtube-thumbnail-chibi-shark-adventure-movie-poster-010102076 |
| 27 | 010106035 | YouTube / thumbnail | anime channel thumbnail prompt | /prompt/youtube-thumbnail-cute-winter-anime-channel-poster-010106035 |
| 28 | 010106038 | YouTube / poster | anime romance YouTube thumbnail prompt | /prompt/youtube-thumbnail-anime-romance-movie-poster-010106038 |
| 29 | 030105026 | Xiaohongshu / food | Xiaohongshu cooking infographic prompt | /prompt/xiaohongshu-food-step-cooking-infographic-ai-030105026 |
| 30 | 030104009 | Xiaohongshu / creator | Xiaohongshu creator profile card prompt | /prompt/xiaohongshu-style-3d-creator-profile-card-ai-030104009 |
| 31 | 010103036 | Social post | social media portrait post prompt | /prompt/social-media-post-sunlit-streetwear-jacket-portrait-010103036 |
| 32 | 010104016 | UI / mockup | laptop UI UX mockup prompt | /prompt/laptop-ui-ux-mockup-010104016 |
| 33 | 010104036 | UI / case study | marketing case study UI prompt | /prompt/dark-mode-marketing-case-study-ui-010104036 |
| 34 | 010104025 | UI / homepage | video platform homepage mockup prompt | /prompt/full-page-steampunk-video-platform-homepage-mockup-010104025 |
| 35 | 010105066 | Infographic | food lifecycle infographic prompt | /prompt/food-lifecycle-infographic-010105066 |
| 36 | 010105006 | Infographic | solar system vertical infographic prompt | /prompt/solar-system-vertical-infographic-010105006 |
| 37 | 010105030 | Infographic | world monuments infographic prompt | /prompt/world-monuments-infographic-poster-010105030 |
| 38 | 010105004 | Infographic / poster | editorial infographic poster prompt | /prompt/breathtaking-premium-editorial-infographic-poster-16-9-010105004 |
| 39 | 010105032 | Character board | character identity board prompt | /prompt/artistic-16-9-character-identity-board-010105032 |
| 40 | 010102024 | Poster / travel | Swiss modernist travel poster prompt | /prompt/swiss-modernist-travel-poster-010102024 |

## Verification Snapshot

- All 40 selected public IDs are present in `public/data/prompts/indexable-public-ids.json`.
- All 40 selected URLs are present in `public/data/prompts/sitemap.json`.
- Prompt detail SEO audit after the change: 1960 total, 213 indexable, 1747 noindex-follow, 1902 pass, 55 review, 3 fail.
- The selected 40 all pass the prompt detail SEO audit.

## Review Notes

- This is a curated first expansion batch, not a full library unlock.
- The strongest commercial clusters are product/ecommerce, brand/logo, portrait/headshot, YouTube thumbnail, and UI mockup.
- Recheck Google Search Console after deployment for impressions, CTR, and indexed status before expanding another batch.
