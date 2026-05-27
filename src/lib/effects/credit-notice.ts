export const NO_CREDITS_CHARGED_NOTICE =
  'No credits were charged for this attempt.';

export const CREDITS_REFUNDED_NOTICE =
  'Credits were refunded for this failed generation.';

export const appendCreditNotice = (
  message: string | null | undefined,
  notice: string
) => {
  const baseMessage = message?.trim() || 'Generation failed, please retry.';
  const lowerMessage = baseMessage.toLowerCase();
  if (
    baseMessage.includes(notice) ||
    (notice === NO_CREDITS_CHARGED_NOTICE &&
      lowerMessage.includes('no credits were charged')) ||
    (notice === CREDITS_REFUNDED_NOTICE &&
      lowerMessage.includes('credits were refunded'))
  ) {
    return baseMessage;
  }
  return `${baseMessage}\n\n${notice}`;
};

