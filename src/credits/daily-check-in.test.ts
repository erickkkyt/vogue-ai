import assert from 'node:assert/strict';
import Module from 'node:module';
import test from 'node:test';

type DailyCheckInModule = typeof import('./daily-check-in');

async function loadDailyCheckInModule(): Promise<DailyCheckInModule> {
  const moduleLoader = Module as unknown as {
    _load: (
      request: string,
      parent: unknown,
      isMain: boolean
    ) => unknown;
  };
  const originalLoad = moduleLoader._load;
  moduleLoader._load = function loadWithServerOnlyShim(
    request,
    parent,
    isMain
  ) {
    if (request === 'server-only') return {};
    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    return await import('./daily-check-in');
  } finally {
    moduleLoader._load = originalLoad;
  }
}

test('daily check-in grants three credits once per UTC day', async () => {
  const {
    DAILY_CHECK_IN_CREDITS,
    claimDailyCheckInReward,
    createInMemoryDailyCheckInStore,
    getDailyCheckInRewardState,
  } = await loadDailyCheckInModule();
  const store = createInMemoryDailyCheckInStore();
  const userId = 'user-1';
  const now = new Date('2026-06-18T15:30:00.000Z');

  const before = await getDailyCheckInRewardState(userId, { store, now });
  const claimed = await claimDailyCheckInReward(userId, { store, now });
  const after = await getDailyCheckInRewardState(userId, { store, now });

  assert.equal(DAILY_CHECK_IN_CREDITS, 3);
  assert.equal(before.available, true);
  assert.equal(before.complete, false);
  assert.equal(before.creditsGranted, 0);
  assert.equal(claimed.available, false);
  assert.equal(claimed.complete, true);
  assert.equal(claimed.creditsGranted, 3);
  assert.equal(claimed.currentCredits, 3);
  assert.equal(after.available, false);
  assert.equal(after.complete, true);
  assert.equal(after.creditsGranted, 3);
  assert.equal(after.currentCredits, 3);
});

test('daily check-in rejects a second claim for the same user and day', async () => {
  const { claimDailyCheckInReward, createInMemoryDailyCheckInStore } =
    await loadDailyCheckInModule();
  const store = createInMemoryDailyCheckInStore();
  const userId = 'user-1';
  const now = new Date('2026-06-18T23:59:00.000Z');

  await claimDailyCheckInReward(userId, { store, now });

  await assert.rejects(
    () => claimDailyCheckInReward(userId, { store, now }),
    /cooldown/
  );
});

test('daily check-in resets on the next UTC day', async () => {
  const { claimDailyCheckInReward, createInMemoryDailyCheckInStore } =
    await loadDailyCheckInModule();
  const store = createInMemoryDailyCheckInStore();
  const userId = 'user-1';

  const first = await claimDailyCheckInReward(userId, {
    store,
    now: new Date('2026-06-18T23:59:00.000Z'),
  });
  const second = await claimDailyCheckInReward(userId, {
    store,
    now: new Date('2026-06-19T00:01:00.000Z'),
  });

  assert.equal(first.currentCredits, 3);
  assert.equal(second.currentCredits, 6);
});

test('daily check-in state preserves existing credits before the next claim', async () => {
  const {
    claimDailyCheckInReward,
    createInMemoryDailyCheckInStore,
    getDailyCheckInRewardState,
  } = await loadDailyCheckInModule();
  const store = createInMemoryDailyCheckInStore();
  const userId = 'user-1';

  await claimDailyCheckInReward(userId, {
    store,
    now: new Date('2026-06-18T08:00:00.000Z'),
  });
  const nextDayState = await getDailyCheckInRewardState(userId, {
    store,
    now: new Date('2026-06-19T08:00:00.000Z'),
  });

  assert.equal(nextDayState.available, true);
  assert.equal(nextDayState.complete, false);
  assert.equal(nextDayState.creditsGranted, 0);
  assert.equal(nextDayState.currentCredits, 3);
});
