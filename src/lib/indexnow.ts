const DEFAULT_INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_INDEXNOW_KEY_PATH = '/indexnow-key.txt';
const DEFAULT_SITE_URL = 'https://vogueai.net';
const MAX_URLS_PER_REQUEST = 10_000;

type IndexNowEnv = NodeJS.ProcessEnv | Record<string, string | undefined>;

export type IndexNowRuntimeConfig = {
  endpoint: string;
  key: string;
  keyLocation: string;
  siteUrl: string;
};

export type IndexNowPayload = {
  host: string;
  key: string;
  keyLocation?: string;
  urlList: string[];
};

export function getIndexNowKeyLocation(
  siteUrl: string,
  override?: string | null
): string {
  if (override?.trim()) {
    return normalizeAbsoluteUrl(override);
  }

  return `${normalizeSiteUrl(siteUrl)}${DEFAULT_INDEXNOW_KEY_PATH}`;
}

export function getIndexNowRuntimeConfig(
  env: IndexNowEnv = process.env
): IndexNowRuntimeConfig {
  const key = env.INDEXNOW_KEY?.trim();
  if (!key) {
    throw new Error('INDEXNOW_KEY is required to use IndexNow.');
  }

  const siteUrl = normalizeSiteUrl(
    env.NEXT_PUBLIC_BASE_URL?.trim() || DEFAULT_SITE_URL
  );

  return {
    endpoint: normalizeAbsoluteUrl(
      env.INDEXNOW_ENDPOINT?.trim() || DEFAULT_INDEXNOW_ENDPOINT
    ),
    key,
    keyLocation: getIndexNowKeyLocation(
      siteUrl,
      env.INDEXNOW_KEY_LOCATION?.trim()
    ),
    siteUrl,
  };
}

export function buildIndexNowPayload({
  key,
  keyLocation,
  siteUrl,
  urls,
}: {
  key: string;
  keyLocation: string;
  siteUrl: string;
  urls: string[];
}): IndexNowPayload {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const siteHost = new URL(normalizedSiteUrl).host;

  const urlList = Array.from(
    new Set(
      urls
        .map((url) => safeNormalizeUrl(url))
        .filter((url): url is string => Boolean(url))
        .filter((url) => new URL(url).host === siteHost)
        .filter((url) => isIndexNowEligiblePath(new URL(url).pathname))
    )
  );

  const payload: IndexNowPayload = {
    host: siteHost,
    key,
    urlList,
  };

  if (!isRootKeyLocationForKey(keyLocation, key, normalizedSiteUrl)) {
    payload.keyLocation = normalizeAbsoluteUrl(keyLocation);
  }

  return payload;
}

export function chunkIndexNowUrls(urls: string[]): string[][] {
  const chunks: string[][] = [];

  for (let index = 0; index < urls.length; index += MAX_URLS_PER_REQUEST) {
    chunks.push(urls.slice(index, index + MAX_URLS_PER_REQUEST));
  }

  return chunks;
}

export async function submitIndexNowUrls(
  urls: string[],
  config: IndexNowRuntimeConfig
) {
  const payload = buildIndexNowPayload({
    key: config.key,
    keyLocation: config.keyLocation,
    siteUrl: config.siteUrl,
    urls,
  });

  const chunks = chunkIndexNowUrls(payload.urlList);
  const responses: Array<{
    status: number;
    statusText: string;
    chunkSize: number;
    body: string;
  }> = [];

  for (const chunk of chunks) {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        ...payload,
        urlList: chunk,
      }),
    });

    responses.push({
      status: response.status,
      statusText: response.statusText,
      chunkSize: chunk.length,
      body: await response.text(),
    });
  }

  return {
    payload,
    responses,
  };
}

function normalizeSiteUrl(siteUrl: string): string {
  const normalized = normalizeAbsoluteUrl(siteUrl);
  const url = new URL(normalized);
  url.pathname = '';
  url.search = '';
  url.hash = '';
  return url.toString().replace(/\/$/, '');
}

function normalizeAbsoluteUrl(url: string): string {
  return new URL(url.trim()).toString().replace(/\/$/, '');
}

function safeNormalizeUrl(url: string): string | null {
  try {
    return new URL(url.trim()).toString();
  } catch {
    return null;
  }
}

function isIndexNowEligiblePath(pathname: string): boolean {
  return ![
    '/api/',
    '/auth/',
    '/payment/',
    '/assets/',
    '/projects/',
    '/dashboard/',
  ].some((prefix) => pathname.startsWith(prefix));
}

function isRootKeyLocationForKey(
  keyLocation: string,
  key: string,
  siteUrl: string
): boolean {
  try {
    const normalizedLocation = normalizeAbsoluteUrl(keyLocation);
    const expectedLocation = `${normalizeSiteUrl(siteUrl)}/${key}.txt`;
    return normalizedLocation === expectedLocation;
  } catch {
    return false;
  }
}
