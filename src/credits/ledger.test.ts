import assert from 'node:assert/strict';
import test from 'node:test';
import { planCreditBucketDeduction } from './ledger';

test('plans FIFO credit bucket deductions without overdrawing a bucket', () => {
  const plan = planCreditBucketDeduction(
    [
      { id: 'old', remainingAmount: 3 },
      { id: 'new', remainingAmount: 10 },
    ],
    7
  );

  assert.deepEqual(plan, {
    allocations: [
      { id: 'old', deductAmount: 3, nextRemainingAmount: 0 },
      { id: 'new', deductAmount: 4, nextRemainingAmount: 6 },
    ],
    remainingToDeduct: 0,
  });
});

test('reports the remaining amount when credits are insufficient', () => {
  const plan = planCreditBucketDeduction(
    [{ id: 'only', remainingAmount: 2 }],
    5
  );

  assert.equal(plan.remainingToDeduct, 3);
});
