# Research Summary

## Keyword Row

- Source record: `66bd94d9-2726-41fe-b024-fe996df2309b`
- Primary keyword: `copy paste ai image prompts`
- Search intent: find copyable prompt examples and understand how to adapt them
- Article type: Tutorial
- Canonical target: `/`
- Information gain requirement: add VogueAI-specific example prompts, style/category tags, reference handoff, and failure/adjustment notes beyond the SERP

## Reference Source Set

- `zemith.com/en/app/tools/image-to-prompt`: image-to-prompt workflow signal; useful for the reverse-prompting angle but not VogueAI-specific.
- `promptplum.com`: prompt library pattern; useful for copyable examples and category expectations.
- `reddit.com/r/ChatGPTPromptGenius/...`: community demand signal for reusable prompt templates.
- `picsart.com/blog/ai-photo-editing-prompts/`: practical image-editing prompt categories and examples.
- `medium.com/@529dlab/...nano-banana...`: Nano Banana copy-paste prompt demand signal.

These are research inputs, not source text to rewrite. None should be treated as official VogueAI, GPT Image 2, or Nano Banana documentation.

## SERP Gap

The available references lean toward large lists of prompts or generic image-to-prompt tools. The missing piece is a reusable adaptation workflow: what to keep fixed, what to replace, when to use reference images, and how to choose the model tag after the first generation.

## Draft Strategy

Open with the production problem: copy-paste prompts fail when they are decorative instead of structured. Then teach the reusable prompt skeleton, provide copyable English prompt blocks, and close with VogueAI-specific adaptation rules.

## Internal Link / Product Fit

- Use `/` as the canonical product handoff.
- Mention Vogue AI as the workspace where prompt blocks become generated images.
- Mention GPT Image 2, Nano Banana, and Midjourney only as model-fit choices tied to concrete output jobs.

## Media Selection

- Hero image: `https://media.vogueai.net/prompt-libraries/awesome-gptimage2-prompts/x-2055485138080014769/create-premium-square-reference-style-consumer-technology-1.jpg`
- Inline image: `https://media.vogueai.net/prompt-libraries/awesome-gptimage2-prompts/x-2055525450194268530/premium-street-food-product-photograph-crispy-fried-1.jpg`

Both images are from the existing VogueAI prompt library R2 set and match the article's product/prompt-template workflow. They are rendered unoptimized in the blog detail component so local Next image proxy failures do not hide the article artwork.

## Review Notes

- Public prompt examples stay English-only across localized articles.
- Localized article bodies are native summaries/adaptations, not direct English fallback.
- The final publish target is `src/lib/generated/auto-blog-posts.ts`, because VogueAI's current blog system is structured TypeScript data rather than MDX files.
