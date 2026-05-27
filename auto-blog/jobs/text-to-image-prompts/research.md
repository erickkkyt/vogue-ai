# Research Summary

## Keyword Row

- Source record: `9c98b480-0c27-45d5-bdeb-934ee67f5381`
- Primary keyword: `text to image prompts`
- Search intent: find copyable prompt examples and understand how to adapt them
- Article type: Tutorial
- Canonical target: `/`
- Information gain requirement: add VogueAI-specific prompt examples, model-fit advice, reference-image handoff, and first-generation revision logic beyond the SERP

## Reference Source Set

- `ai.meta.com/learn/prompts-for-ai-images-10-examples-and-tips-for-better-results/`: general prompt anatomy and copyable use cases
- `zemith.com/en/app/tools/image-to-prompt`: image-to-prompt workflow signal and intent adjacency
- `picsart.com/image-to-prompt/`: creator-facing prompt utility framing
- `adobe.com/products/firefly/features/text-to-image.html`: mainstream text-to-image expectations and terminology
- `promptbase.com/free-prompts`: demand signal for reusable prompt examples

These are research inputs, not source text to rewrite. None should be treated as official VogueAI product documentation.

## SERP Gap

Most ranking pages either collect generic prompt ideas or explain text-to-image at a high level. The missing piece is a reusable operating workflow: how to structure a prompt, what to keep fixed, when to add a reference image, and what to change after the first generation.

## Draft Strategy

Open with the production use case instead of abstract creativity. Then teach a reusable prompt formula, give English copyable prompt blocks, show one worked example, and close with model-fit and first-generation revision rules inside Vogue AI.

## Internal Link / Product Fit

- Use `/` as the canonical product handoff.
- Mention Vogue AI as the workspace where reusable prompt blocks become first drafts.
- Map GPT Image 2, Nano Banana, and Midjourney to practical output jobs rather than generic feature claims.

## Media Selection

- Hero image: `https://media.vogueai.net/blog/auto/text-to-image-prompts/bbeff09d68ad-create-premium-square-reference-style-consumer-technology-1.jpg`
- Inline image: `https://media.vogueai.net/blog/auto/text-to-image-prompts/4905f63747d7-high-impact-cinematic-sports-advertising-poster-featuring-1.jpg`

Both images are from the existing VogueAI prompt-library R2 set and match the article's reusable prompt workflow.

## Review Notes

- Public prompt examples stay English-only across localized articles.
- Localized article bodies are native adaptations, not English fallbacks.
- The final publish target is `src/lib/generated/auto-blog-posts.ts`, with the new post implemented in `src/lib/generated/auto-blog-text-to-image-post.ts` and included by the structured blog source.
