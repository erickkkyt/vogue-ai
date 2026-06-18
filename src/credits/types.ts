export const CREDIT_TRANSACTION_TYPE = {
  DAILY_CHECK_IN: 'daily_check_in',
  REGISTER_GIFT: 'register_gift',
  PURCHASE: 'purchase',
  SUBSCRIPTION: 'subscription',
  RESERVE: 'reserve',
  CONSUME: 'consume',
  RELEASED: 'released',
  REFUND: 'refund',
} as const;

export type CreditTransactionType =
  (typeof CREDIT_TRANSACTION_TYPE)[keyof typeof CREDIT_TRANSACTION_TYPE];

export type CreditReferenceType =
  | 'daily_check_in'
  | 'register'
  | 'session'
  | 'invoice'
  | 'zpay_order'
  | 'generation'
  | 'manual';
