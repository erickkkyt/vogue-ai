type BuildProviderGenerationInputParams = {
  rawInput: Record<string, unknown>;
  prompt: string;
  callbackUrl?: string | null;
};

export function buildProviderGenerationInput({
  rawInput,
  prompt,
  callbackUrl,
}: BuildProviderGenerationInputParams): Record<string, unknown> {
  const sanitizedInput = { ...rawInput };
  delete sanitizedInput.callBackUrl;
  delete sanitizedInput.callbackUrl;

  const serverCallbackUrl = callbackUrl?.trim();
  return {
    ...sanitizedInput,
    prompt,
    ...(serverCallbackUrl ? { callBackUrl: serverCallbackUrl } : {}),
  };
}
