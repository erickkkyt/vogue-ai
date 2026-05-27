import assert from 'node:assert/strict';
import test from 'node:test';
import { getRegisterGiftCreditsAmount } from './credits';

test('uses the code default register gift credits when env is set', () => {
  const previousCredits = process.env.REGISTER_GIFT_CREDITS;
  process.env.REGISTER_GIFT_CREDITS = '999';

  try {
    assert.equal(getRegisterGiftCreditsAmount(), 10);
  } finally {
    if (previousCredits === undefined) {
      delete process.env.REGISTER_GIFT_CREDITS;
    } else {
      process.env.REGISTER_GIFT_CREDITS = previousCredits;
    }
  }
});
