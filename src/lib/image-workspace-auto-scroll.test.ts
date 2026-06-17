import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

test('workspace generation scrolls to the newly rendered optimistic task card', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');

  assert.match(source, /activeTimelineItemRef/);
  assert.match(source, /pendingAutoScrollTaskIdRef/);
  assert.match(source, /lastAutoScrolledTaskIdRef/);
  assert.match(source, /requestCurrentTaskScroll\(provisionalTaskId\);/);
  assert.match(source, /setResultFilter\('all'\);/);
  assert.match(source, /activeItemRef=\{setActiveTimelineItemRef\}/);
  assert.match(
    source,
    /cardRef=\{\s*currentTask\?\.taskId === item\.taskId \? activeItemRef : undefined\s*\}/
  );
  assert.match(source, /scroll-mt-6 scroll-mb-56/);
  assert.match(source, /window\.requestAnimationFrame/);
  assert.ok(source.includes('element.scrollIntoView({'));
  assert.ok(source.includes("behavior: prefersReducedMotion ? 'auto' : 'smooth'"));
  assert.ok(source.includes("block: 'center'"));
  assert.ok(source.includes("inline: 'nearest'"));
});

test('workspace history defaults to the newest generated card after initial load', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');

  assert.match(source, /timelineBottomRef/);
  assert.match(source, /hasScrolledInitialTimelineRef/);
  assert.match(source, /bottomRef=\{setTimelineBottomRef\}/);
  assert.match(source, /recentAssetsQuery\.isSuccess/);
  assert.ok(source.includes('scrollToTimelineBottom'));
  assert.ok(source.includes('element.scrollIntoView({'));
  assert.ok(source.includes("behavior: 'auto'"));
  assert.ok(source.includes("block: 'end'"));
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /scroll-mb-56/);
});
