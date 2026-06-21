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

test('sidebar exposes daily free credit claim through the rewards API', () => {
  const sidebar = read('src/components/app/VogueSidebarShell.tsx');
  const account = read('src/components/account/VogueAccountCenter.tsx');
  const claimButtonIndex = sidebar.indexOf('vogue-sidebar-daily-claim-button');
  const accountButtonIndex = sidebar.indexOf('vogue-sidebar-account-button');
  const anonymousLoginIndex = sidebar.indexOf(
    'vogue-sidebar-anonymous-login-button'
  );
  const claimButtonMarkup = sidebar.slice(
    Math.max(0, claimButtonIndex - 1200),
    sidebar.indexOf('</button>', claimButtonIndex) + '</button>'.length
  );
  const anonymousLoginButtonMarkup = sidebar.slice(
    Math.max(0, anonymousLoginIndex - 400),
    sidebar.indexOf('</button>', anonymousLoginIndex) + '</button>'.length
  );

  assert.match(sidebar, /claimDailyCredits/);
  assert.match(sidebar, /fetch\('\/api\/rewards\/check-in'/);
  assert.match(sidebar, /method:\s*'POST'/);
  assert.match(sidebar, /accountCopy\.billing\.dailyClaimCta/);
  assert.match(sidebar, /accountCopy\.billing\.dailyClaimClaimed/);
  assert.match(sidebar, /invalidateAppCredits\(queryClient,\s*userId\)/);
  assert.match(
    claimButtonMarkup,
    /h-11 w-full items-center gap-2\.5 overflow-hidden rounded-\[16px\] border border-\[rgba\(79,103,255,0\.16\)\]/
  );
  assert.match(claimButtonMarkup, /text-\[13px\]/);
  assert.match(claimButtonMarkup, /font-semibold text-slate-800/);
  assert.match(
    claimButtonMarkup,
    /shadow-\[inset_0_1px_0_rgba\(255,255,255,0\.92\),0_10px_24px_rgba\(72,55,44,0\.075\)\]/
  );
  assert.match(
    claimButtonMarkup,
    /before:bg-\[linear-gradient\(180deg,#14a8ff_0%,#5666ff_52%,#a45cff_100%\)\]/
  );
  assert.match(
    claimButtonMarkup,
    /inline-flex h-7 w-7 shrink-0 items-center justify-center text-\[var\(--vogue-accent-strong\)\]/
  );
  assert.match(claimButtonMarkup, /text-\[var\(--vogue-accent-strong\)\]/);
  assert.doesNotMatch(claimButtonMarkup, /\+\{DAILY_CHECK_IN_CREDITS\}|\+3/);
  assert.doesNotMatch(claimButtonMarkup, /rounded-\[10px\]|bg-white\/72|shadow-\[0_5px_14px_rgba\(79,103,255,0\.08\)\]/);
  assert.doesNotMatch(claimButtonMarkup, /<Check/);
  assert.doesNotMatch(sidebar, /Sparkles/);
  assert.doesNotMatch(claimButtonMarkup, /border-\[3px\]|w-\[calc|-mx-2|size-20|size-24|backdrop-blur|hover:-translate/);
  assert.doesNotMatch(claimButtonMarkup, /#00FF88|emerald|lime|#D7FF00|#F2FF9A/);
  assert.match(
    anonymousLoginButtonMarkup,
    /vogue-sidebar-anonymous-login-button inline-flex h-10 w-full min-w-0/
  );
  assert.doesNotMatch(
    claimButtonMarkup,
    /disabled:(?:border-slate|bg-none|bg-slate|text-slate|shadow-none)/
  );
  assert.ok(claimButtonIndex > -1);
  assert.ok(claimButtonIndex < accountButtonIndex);
  assert.ok(claimButtonIndex < anonymousLoginIndex);
  assert.doesNotMatch(account, /fetch\('\/api\/rewards\/check-in'/);
});
