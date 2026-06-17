import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const RUNTIME_DIRS = ['src/app', 'src/components', 'src/lib'];
const SOURCE_IMPORT_PATTERN = /['"]@\/lib\/prompts\/source['"]|['"]\.\/prompts\/source['"]|['"]\.\.\/prompts\/source['"]/;
const PROMPTS_RUNTIME_PATH = join(ROOT, 'src/lib/prompts.ts');
const WRANGLER_CONFIG_PATH = join(ROOT, 'wrangler.jsonc');
const GENERATED_IMPORT_PATTERN = /from ['"].*generated\/.*\.json['"]/;
const STATIC_RUNTIME_JSON_IMPORT_PATTERN =
  /import\s+[^;]*['"].*public\/data\/prompts\/runtime\.json['"]/;
const CORPUS_MARKERS = [
  'awesome-gptimage2-prompts.json',
  'awesome-gptimage2-site-additions.json',
  'awesome-ai-prompts-nano-banana.json',
  'awesome-ai-prompts-midjourney.json',
  'awesome-ai-prompts.i18n',
  'awesome-gptimage2-prompts.i18n',
];

function walkFiles(dir: string): string[] {
  const absoluteDir = join(ROOT, dir);
  const entries = readdirSync(absoluteDir);
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(absoluteDir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      if (path.includes('/src/lib/generated')) continue;
      files.push(...walkFiles(relative(ROOT, path)));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry)) {
      files.push(path);
    }
  }

  return files;
}

const failures: string[] = [];
const promptRuntimeSource = readFileSync(PROMPTS_RUNTIME_PATH, 'utf8');
const wranglerConfigSource = readFileSync(WRANGLER_CONFIG_PATH, 'utf8');
const topLevelWranglerVars =
  wranglerConfigSource.match(/"vars"\s*:\s*\{([\s\S]*?)\n  \}/)?.[1] ?? '';

if (GENERATED_IMPORT_PATTERN.test(promptRuntimeSource)) {
  failures.push('src/lib/prompts.ts imports generated JSON directly');
}

if (STATIC_RUNTIME_JSON_IMPORT_PATTERN.test(promptRuntimeSource)) {
  failures.push('src/lib/prompts.ts statically imports prompt runtime.json');
}

if (!/"env"\s*:\s*\{/.test(wranglerConfigSource)) {
  failures.push('wrangler.jsonc does not declare explicit environments');
}

if (
  /"NEXT_PUBLIC_BASE_URL"\s*:\s*"https:\/\/vogueai\.net"/.test(
    topLevelWranglerVars
  )
) {
  failures.push('wrangler.jsonc top-level vars point NEXT_PUBLIC_BASE_URL at production');
}

if (
  /"KIE_CALLBACK_URL"\s*:\s*"https:\/\/vogueai\.net\/api\/effects\/callback"/.test(
    topLevelWranglerVars
  )
) {
  failures.push('wrangler.jsonc top-level vars point KIE_CALLBACK_URL at production');
}

for (const dir of RUNTIME_DIRS) {
  for (const file of walkFiles(dir)) {
    const relativeFile = relative(ROOT, file);
    if (relativeFile === 'src/lib/prompts/source.ts') continue;
    if (relativeFile.endsWith('.test.ts') || relativeFile.endsWith('.test.tsx')) {
      continue;
    }

    const source = readFileSync(file, 'utf8');
    if (SOURCE_IMPORT_PATTERN.test(source)) {
      failures.push(`${relativeFile} imports src/lib/prompts/source.ts`);
    }
  }
}

const handlerPath = join(ROOT, '.open-next/server-functions/default/handler.mjs');
try {
  const handlerSource = readFileSync(handlerPath, 'utf8');
  for (const marker of CORPUS_MARKERS) {
    if (handlerSource.includes(marker)) {
      failures.push(`OpenNext handler contains source corpus marker: ${marker}`);
    }
  }
} catch {
  // cf:guard can run before cf:build; source-import guards still apply.
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Cloudflare runtime boundaries OK');
