export type ImageOutputReplacement = {
  output: unknown;
  sourceUrls: string[];
  storedUrls: string[];
  storedKeys?: string[];
  exposeProviderResultUrl?: boolean;
  watermarked?: boolean;
};

const asObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const isUrlLike = (value: string) => /^https?:\/\//i.test(value);

const uniqueStrings = (values: string[]) => Array.from(new Set(values));

const getStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter(
        (item): item is string => typeof item === 'string' && isUrlLike(item)
      )
    : [];

export const getImageUrlsFromOutput = (output: unknown) => {
  const payload = asObject(output);
  if (!payload) return [] as string[];

  const urls: string[] = [];
  if (typeof payload.result_url === 'string' && isUrlLike(payload.result_url)) {
    urls.push(payload.result_url);
  }

  urls.push(...getStringArray(payload.image_urls));
  urls.push(...getStringArray(payload.result_urls));

  return uniqueStrings(urls);
};

const replaceExactUrlsDeep = (
  value: unknown,
  urlMap: Map<string, string>
): unknown => {
  if (typeof value === 'string') {
    return urlMap.get(value) ?? value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceExactUrlsDeep(item, urlMap));
  }

  const object = asObject(value);
  if (!object) return value;

  return Object.fromEntries(
    Object.entries(object).map(([key, item]) => [
      key,
      replaceExactUrlsDeep(item, urlMap),
    ])
  );
};

export const replaceGenerationImageUrls = ({
  output,
  sourceUrls,
  storedUrls,
  storedKeys = [],
  exposeProviderResultUrl = true,
  watermarked = false,
}: ImageOutputReplacement) => {
  const payload = asObject(output);
  if (!payload || storedUrls.length === 0) return output;

  const urlMap = new Map<string, string>();
  sourceUrls.forEach((url, index) => {
    const storedUrl = storedUrls[index];
    if (storedUrl) urlMap.set(url, storedUrl);
  });

  const replaced = asObject(replaceExactUrlsDeep(payload, urlMap)) ?? payload;
  const nextOutput: Record<string, unknown> = {
    ...replaced,
    stored_result_url: storedUrls[0],
    stored_image_keys: storedKeys,
    image_urls: storedUrls,
    result_url: storedUrls[0],
    storage_sync_failed: storedUrls.some((url, index) => url === sourceUrls[index])
      ? undefined
      : false,
  };

  if (Array.isArray(payload.result_urls)) {
    nextOutput.result_urls = storedUrls;
  }

  if (exposeProviderResultUrl && sourceUrls[0]) {
    nextOutput.provider_result_url = sourceUrls[0];
  } else {
    delete nextOutput.provider_result_url;
  }

  if (watermarked) {
    nextOutput.watermark_applied = true;
  }

  return nextOutput;
};
