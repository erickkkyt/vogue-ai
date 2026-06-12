type EnsurePaymentRecord = () => Promise<{ inserted: boolean }>;
type GrantCredits = () => Promise<void>;

export type StripeFulfillmentResult = {
  paymentInserted: boolean;
  creditGrantAttempted: boolean;
};

export async function fulfillStripePayment({
  paid,
  creditAmount,
  ensurePaymentRecord,
  grantCredits,
}: {
  paid: boolean;
  creditAmount: number;
  ensurePaymentRecord: EnsurePaymentRecord;
  grantCredits: GrantCredits;
}): Promise<StripeFulfillmentResult> {
  const paymentRecord = await ensurePaymentRecord();
  const shouldGrantCredits = paid && Number.isFinite(creditAmount) && creditAmount > 0;

  if (shouldGrantCredits) {
    await grantCredits();
  }

  return {
    paymentInserted: paymentRecord.inserted,
    creditGrantAttempted: shouldGrantCredits,
  };
}
