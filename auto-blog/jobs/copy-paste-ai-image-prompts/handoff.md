# VogueAI Blog Handoff

Source row: `66bd94d9-2726-41fe-b024-fe996df2309b`

Keyword: `copy paste ai image prompts`

Final publish module:

```text
/Users/kkkk/Documents/GitHub/vogue-ai/src/lib/generated/auto-blog-posts.ts
```

Validation:

```bash
pnpm exec tsx --test src/lib/vogue-auto-blog.test.ts
pnpm exec tsx --test src/lib/vogue-blog-layout.test.ts
pnpm exec tsx --test src/lib/vogue-localization-audit.test.ts
pnpm exec tsc --noEmit --pretty false
pnpm exec eslint src/lib/generated/auto-blog-posts.ts src/lib/blog-data.tsx src/components/blog/VogueBlogPost.tsx 'src/app/[locale]/blog/[slug]/page.tsx' src/lib/vogue-auto-blog.test.ts src/lib/vogue-blog-layout.test.ts src/lib/vogue-localization-audit.test.ts
pnpm build
```

Workbench completion command:

```bash
node "/Users/kkkk/Desktop/KKKK AI Space/产品情况/_automation/run_daily_vogueai_blog_queue.mjs" --complete --id "66bd94d9-2726-41fe-b024-fe996df2309b" --job-path "/Users/kkkk/Documents/GitHub/vogue-ai/auto-blog/jobs/copy-paste-ai-image-prompts" --draft-path "/Users/kkkk/Documents/GitHub/vogue-ai/src/lib/generated/auto-blog-posts.ts" --score "94"
```
