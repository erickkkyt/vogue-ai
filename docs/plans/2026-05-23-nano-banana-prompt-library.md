# Nano Banana Prompt Library Implementation Plan

**Goal:** Build a Nano Banana prompt corpus in `/Users/kkkk/Desktop/awesome-ai prompts`, import it into Vogue AI, and expose a Nano Banana model filter on the homepage gallery.

**Architecture:** Keep the source corpus and product repo separate. The `awesome-ai prompts` repo owns X discovery, local assets, prompt cleaning, generated GitHub collection files, and a copy-friendly JSON export. Vogue AI owns R2 upload, generated website JSON, model labels, filtering, and page verification.

**Tech Stack:** Python ingest/build scripts, TwitterAPI.io search, Pillow image metadata, Node/TypeScript import script, Cloudflare R2 via AWS SDK, Next.js gallery components.

---

### Task 1: Source Repo Setup

**Files:**
- Modify: `/Users/kkkk/Desktop/awesome-ai prompts/.gitignore`
- Create: `/Users/kkkk/Desktop/awesome-ai prompts/scripts/ingest_latest_x_nano_banana.py`
- Create: `/Users/kkkk/Desktop/awesome-ai prompts/scripts/build_model_gallery.py`

**Steps:**
1. Add model-aware raw data folders for Nano Banana while preserving existing GPT Image 2 files.
2. Reuse the old prompt-cleaning helpers.
3. Write Nano Banana records to `data/nano-banana/*.json`.
4. Export public data to `prompts/nano-banana-prompts.json`.

### Task 2: X Ingest

**Files:**
- Create/update: `/Users/kkkk/Desktop/awesome-ai prompts/data/nano-banana/x-discussions-verified.json`
- Create/update: `/Users/kkkk/Desktop/awesome-ai prompts/data/nano-banana/x-prompt-image-pairs.json`
- Create/update: `/Users/kkkk/Desktop/awesome-ai prompts/assets/nano-banana-x-discussions/*`

**Steps:**
1. Run a dry run with target 200.
2. Inspect rejection reasons and sample accepted URLs.
3. Run real ingest.
4. Rebuild the Nano Banana collection.
5. Check every exported card has prompt text, image metadata, source URL, and model id.

### Task 3: Vogue Import

**Files:**
- Create: `/Users/kkkk/Documents/GitHub/vogue-ai/scripts/import-awesome-ai-prompts.ts`
- Modify: `/Users/kkkk/Documents/GitHub/vogue-ai/package.json`
- Create/update: `/Users/kkkk/Documents/GitHub/vogue-ai/src/lib/generated/awesome-ai-prompts-nano-banana.json`

**Steps:**
1. Read `prompts/nano-banana-prompts.json` from the source repo.
2. Upload local images to R2 using stable keys under `prompt-libraries/awesome-ai-prompts/nano-banana/`.
3. Write Vogue-compatible entries with `modelId: "nanobanana"`.
4. Preserve source attribution and dimensions.

### Task 4: Gallery Integration

**Files:**
- Modify: `/Users/kkkk/Documents/GitHub/vogue-ai/src/lib/prompts.ts`
- Modify: `/Users/kkkk/Documents/GitHub/vogue-ai/src/components/prompts/VogueGalleryWorkspace.tsx`

**Steps:**
1. Include the Nano Banana generated JSON in the same prompt entry pipeline.
2. Label model filters from the workspace model registry.
3. Ensure selecting a Nano Banana card fills the composer with `nanobanana`.

### Task 5: Verification

**Commands:**
- `python3 scripts/build_model_gallery.py nano-banana`
- `python3 scripts/clean_prompt_shells.py --check data/nano-banana/x-discussions-verified.json data/nano-banana/x-prompt-image-pairs.json prompts/nano-banana-prompts.json`
- `npm run typecheck`
- `npm run build`
- Browser check on the homepage model filter and Nano Banana card flow.

**Expected Result:** Vogue homepage shows a Nano Banana model tab with imported prompt cards, images render from R2, and using a card selects Nano Banana in the composer.
