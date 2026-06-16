import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const configPath = 'src/components/app/app-query-config.ts';
const read = (path: string) => readFileSync(path, 'utf8');

async function loadConfig() {
  assert.equal(existsSync(configPath), true);
  return import('./app-query-config');
}

test('app query defaults stay conservative for Vercel functions and paid state', async () => {
  const { APP_QUERY_DEFAULT_OPTIONS } = await loadConfig();

  assert.equal(APP_QUERY_DEFAULT_OPTIONS.queries.retry, 1);
  assert.equal(APP_QUERY_DEFAULT_OPTIONS.queries.refetchOnWindowFocus, false);
  assert.equal(APP_QUERY_DEFAULT_OPTIONS.queries.staleTime, 5_000);
  assert.equal(APP_QUERY_DEFAULT_OPTIONS.mutations.retry, false);
});

test('workspace query keys keep app state scoped and explicit', async () => {
  const { APP_QUERY_KEYS } = await loadConfig();

  assert.deepEqual(APP_QUERY_KEYS.credits('user-1'), [
    'app',
    'credits',
    'user-1',
  ]);
  assert.deepEqual(APP_QUERY_KEYS.recentAssets('user-1'), [
    'app',
    'recent-assets',
    'user-1',
  ]);
  assert.deepEqual(APP_QUERY_KEYS.generationStatus('task-1'), [
    'app',
    'generation-status',
    'task-1',
  ]);
});

test('workspace generation polling only continues for active server tasks', async () => {
  const {
    WORKSPACE_STATUS_POLL_INTERVAL_MS,
    shouldPollWorkspaceGenerationStatus,
  } = await loadConfig();

  assert.equal(WORKSPACE_STATUS_POLL_INTERVAL_MS, 4_000);
  assert.equal(shouldPollWorkspaceGenerationStatus('pending'), true);
  assert.equal(shouldPollWorkspaceGenerationStatus('processing'), true);
  assert.equal(shouldPollWorkspaceGenerationStatus('succeeded'), false);
  assert.equal(shouldPollWorkspaceGenerationStatus('failed'), false);
  assert.equal(shouldPollWorkspaceGenerationStatus(undefined), false);
});

test('app query provider is shared by the sidebar shell instead of nested in the workspace', () => {
  const appPage = read('src/app/app/page.tsx');
  const localeLayout = read('src/app/[locale]/layout.tsx');
  const homePage = read('src/app/page.tsx');
  const standaloneLayout = read('src/app/non-prompt-standalone-layout.tsx');

  assert.doesNotMatch(
    appPage,
    /<AppQueryProvider>\s*<ImageWorkspace \/>\s*<\/AppQueryProvider>/
  );
  assert.match(
    appPage,
    /<AppQueryProvider>\s*<VogueSidebarShell>\s*<AppPageContent \/>\s*<\/VogueSidebarShell>\s*<\/AppQueryProvider>/
  );
  assert.match(localeLayout, /AppQueryProvider/);
  assert.match(homePage, /AppQueryProvider/);
  assert.match(standaloneLayout, /AppQueryProvider/);
});

test('image workspace uses app query for external state and active task polling', () => {
  const source = read('src/components/app/ImageWorkspace.tsx');

  assert.match(source, /useQueryClient/);
  assert.match(source, /useQuery/);
  assert.match(source, /useMutation/);
  assert.match(source, /APP_QUERY_KEYS/);
  assert.match(source, /useAppCreditsQuery\(sessionUserId\)/);
  assert.match(source, /shouldPollWorkspaceGenerationStatus/);
  assert.match(source, /refetchInterval:\s*\(query\) =>/);
  assert.match(source, /queryClient\.invalidateQueries/);
  assert.doesNotMatch(source, /const refreshCredits = useCallback/);
  assert.doesNotMatch(source, /const refreshRecentAssets = useCallback/);
  assert.doesNotMatch(source, /window\.setInterval\(poll, 4000\)/);
});

test('sidebar and account billing reuse app credits query instead of hand-rolled credits fetches', () => {
  const sidebar = read('src/components/app/VogueSidebarShell.tsx');
  const account = read('src/components/account/VogueAccountCenter.tsx');
  const hooks = read('src/components/app/app-query-hooks.ts');

  assert.match(hooks, /APP_QUERY_KEYS\.credits\(userId \?\? 'anonymous'\)/);
  assert.match(sidebar, /useAppCreditsQuery\(userId\)/);
  assert.match(account, /useAppCreditsQuery\(user\.id\)/);
  assert.match(sidebar, /queryClient\.removeQueries\(\{ queryKey: \['app'\] \}\)/);
  assert.match(account, /queryClient\.removeQueries\(\{ queryKey: \['app'\] \}\)/);
  assert.doesNotMatch(sidebar, /fetch\('\/api\/user\/credits'/);
  assert.doesNotMatch(account, /fetch\('\/api\/user\/credits'/);
});
