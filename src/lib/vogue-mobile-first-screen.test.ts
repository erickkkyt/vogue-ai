import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const cssBlockFor = (source: string, selector: string) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (
    source.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\}`))?.[1] ??
    ''
  );
};

test('mobile homepage hides default gallery filters without changing desktop filter chrome', () => {
  const globals = read('src/app/globals.css');
  const mobileMediaStart = globals.indexOf('@media (max-width: 640px)');

  assert.notEqual(mobileMediaStart, -1);

  const desktopCss = globals.slice(0, mobileMediaStart);
  const mobileCss = globals.slice(mobileMediaStart);

  assert.doesNotMatch(cssBlockFor(desktopCss, '.vogue-filter-strip'), /display:\s*none/);
  assert.match(cssBlockFor(mobileCss, '.vogue-filter-strip'), /display:\s*none/);
});

test('mobile anonymous sign in is icon-only while desktop sign in keeps text', () => {
  const shell = read('src/components/app/VogueSidebarShell.tsx');
  const mobileButton = shell.slice(
    shell.indexOf('function MobileAccountButton'),
    shell.indexOf('export default function VogueSidebarShell')
  );
  const desktopAccount = shell.slice(
    shell.indexOf('function SidebarAccount'),
    shell.indexOf('function MobileAccountButton')
  );

  assert.match(mobileButton, /vogue-mobile-anonymous-login-button[^\n]+h-9[^\n]+w-9/);
  assert.match(mobileButton, /vogue-mobile-anonymous-login-button[^\n]+translate-y-0\.5/);
  assert.match(mobileButton, /<span className="sr-only">\{copy\.common\.signIn\}<\/span>/);
  assert.doesNotMatch(
    mobileButton,
    /<span className="min-w-0 truncate">\{copy\.common\.signIn\}<\/span>/
  );

  assert.match(desktopAccount, /vogue-sidebar-anonymous-login-button[^\n]+px-5/);
  assert.match(
    desktopAccount,
    /<span className="truncate">\{copy\.common\.signIn\}<\/span>/
  );
});

test('homepage gallery remeasures columns when returning from detail navigation', () => {
  const gallery = read('src/components/prompts/VogueGalleryWorkspace.tsx');
  const columnEffect = gallery.slice(
    gallery.indexOf('const syncColumnCount = (width: number) => {'),
    gallery.indexOf('return () => {', gallery.indexOf('const syncColumnCount = (width: number) => {'))
  );

  assert.match(gallery, /const useIsomorphicLayoutEffect =/);
  assert.match(gallery, /useLayoutEffect/);
  assert.match(gallery, /useIsomorphicLayoutEffect\(\(\) =>/);
  assert.match(columnEffect, /const syncFromElement = \(\) =>/);
  assert.match(columnEffect, /syncFromElement\(\);\s+const observer = new ResizeObserver/);
  assert.match(columnEffect, /window\.addEventListener\('resize', syncFromElement\)/);
  assert.match(columnEffect, /window\.addEventListener\('pageshow', syncFromElement\)/);
  assert.match(columnEffect, /document\.addEventListener\('visibilitychange', syncOnVisible\)/);
  assert.match(gallery, /distributeGalleryEntriesIntoColumns\(filteredEntries, columnCount\)/);
  assert.match(gallery, /vogue-gallery-masonry-column/);
  assert.doesNotMatch(gallery, /gridAutoFlow:\s*'dense'/);
});
