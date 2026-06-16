export type AssetOutputRecord = {
  publicUrl: string | null;
  createdAt: Date | null;
  providerUrl?: string | null;
};

const uniqueStrings = (values: string[]) => Array.from(new Set(values));

export const getOutputFallbackUrls = (output: unknown) => {
  if (!output || typeof output !== 'object') return [] as string[];
  const payload = output as Record<string, unknown>;
  const urls: string[] = [];
  if (Array.isArray(payload.image_urls)) {
    for (const item of payload.image_urls) {
      if (typeof item === 'string' && item) urls.push(item);
    }
  }
  if (typeof payload.result_url === 'string' && payload.result_url) {
    urls.push(payload.result_url);
  }
  return uniqueStrings(urls);
};

export const readProviderUrlFromAssetMetadata = (metadata: unknown) => {
  if (!metadata || typeof metadata !== 'object') return null;
  const providerUrl = (metadata as Record<string, unknown>).providerUrl;
  return typeof providerUrl === 'string' && providerUrl ? providerUrl : null;
};

export const getLinkedOutputUrls = (records: AssetOutputRecord[]) => {
  const seen = new Set<string>();
  const urls: string[] = [];

  for (const record of records
    .filter((item) => item.publicUrl)
    .sort(
      (a, b) =>
        (a.createdAt ?? new Date(0)).getTime() -
        (b.createdAt ?? new Date(0)).getTime()
    )) {
    const dedupeKey = record.providerUrl || record.publicUrl!;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    urls.push(record.publicUrl!);
  }

  return urls;
};

export const resolveWorkspaceMediaUrls = ({
  linkedOutputRecords,
  output,
}: {
  linkedOutputRecords: AssetOutputRecord[];
  output: unknown;
}) => {
  const outputUrls = getOutputFallbackUrls(output);
  return outputUrls.length > 0
    ? outputUrls
    : getLinkedOutputUrls(linkedOutputRecords);
};
