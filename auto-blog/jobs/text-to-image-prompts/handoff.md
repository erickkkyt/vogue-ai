# VogueAI Blog Handoff

Source row: `9c98b480-0c27-45d5-bdeb-934ee67f5381`

Keyword: `text to image prompts`

Final publish module:

```text
/Users/kkkk/Documents/GitHub/vogue-ai/src/lib/generated/auto-blog-posts.ts
```

Structured post module:

```text
/Users/kkkk/Documents/GitHub/vogue-ai/src/lib/generated/auto-blog-text-to-image-post.ts
```

Validation:

```bash
pnpm exec tsx --test src/lib/vogue-auto-blog.test.ts
pnpm exec tsx --test src/lib/vogue-localization-audit.test.ts
pnpm exec tsx --test src/lib/vogue-blog-layout.test.ts
pnpm exec tsc --noEmit --pretty false
pnpm build
```

Workbench completion command:

```bash
node "/Users/kkkk/Desktop/KKKK AI Space/产品情况/_automation/run_daily_vogueai_blog_queue.mjs" --complete --id "9c98b480-0c27-45d5-bdeb-934ee67f5381" --job-path "/Users/kkkk/Documents/GitHub/vogue-ai/auto-blog/jobs/text-to-image-prompts" --draft-path "/Users/kkkk/Documents/GitHub/vogue-ai/src/lib/generated/auto-blog-posts.ts" --score "93"
```
