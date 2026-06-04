import { writeFile } from 'node:fs/promises';

import { getLocalizedPromptEntries } from '../src/lib/prompts';
import { createPromptSeoSlug } from '../src/lib/prompt-slug-utils';

const OUTPUT_PATH = 'src/lib/generated/prompt-seo-slugs.json';

async function main() {
  const entries = getLocalizedPromptEntries('en');
  const slugMap = Object.fromEntries(
    entries
      .map((entry) => [entry.publicId, createPromptSeoSlug(entry)] as const)
      .toSorted(([leftId], [rightId]) => leftId.localeCompare(rightId))
  );

  await writeFile(OUTPUT_PATH, `${JSON.stringify(slugMap, null, 2)}\n`);

  console.log(`Wrote ${entries.length} prompt SEO slugs to ${OUTPUT_PATH}`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
