import {
  buildIndexNowPayload,
  getIndexNowRuntimeConfig,
  submitIndexNowUrls,
} from '@/lib/indexnow';

type CliOptions = {
  dryRun: boolean;
  limit?: number;
  siteUrl?: string;
  urls: string[];
};

async function main() {
  const options = parseCliOptions(process.argv.slice(2));
  const config = getIndexNowRuntimeConfig({
    ...process.env,
    ...(options.siteUrl ? { NEXT_PUBLIC_BASE_URL: options.siteUrl } : {}),
  });
  const candidateUrls =
    options.urls.length > 0
      ? options.urls
      : await getUrlsFromSitemap(`${config.siteUrl}/sitemap.xml`);

  const boundedUrls = options.limit
    ? candidateUrls.slice(0, options.limit)
    : candidateUrls;

  const payload = buildIndexNowPayload({
    key: config.key,
    keyLocation: config.keyLocation,
    siteUrl: config.siteUrl,
    urls: boundedUrls,
  });

  if (payload.urlList.length === 0) {
    console.log('No eligible URLs found for IndexNow submission.');
    return;
  }

  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          endpoint: config.endpoint,
          ...payload,
        },
        null,
        2
      )
    );
    return;
  }

  const result = await submitIndexNowUrls(payload.urlList, config);

  console.log(
    JSON.stringify(
      {
        endpoint: config.endpoint,
        host: result.payload.host,
        keyLocation:
          result.payload.keyLocation ?? `${config.siteUrl}/${config.key}.txt`,
        submitted: result.payload.urlList.length,
        responses: result.responses,
      },
      null,
      2
    )
  );
}

async function getUrlsFromSitemap(sitemapUrl: string): Promise<string[]> {
  let response: Response;
  try {
    response = await fetch(sitemapUrl, {
      headers: {
        accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8',
      },
    });
  } catch {
    throw new Error(
      `Failed to fetch sitemap from ${sitemapUrl}. Pass --site-url https://vogueai.net or set NEXT_PUBLIC_BASE_URL accordingly.`
    );
  }

  if (!response.ok) {
    throw new Error(
      `Failed to load sitemap from ${sitemapUrl}: ${response.status} ${response.statusText}`
    );
  }

  const xml = await response.text();
  return Array.from(
    xml.matchAll(/<loc>(.*?)<\/loc>/g),
    (match) => match[1]?.trim() ?? ''
  ).filter(Boolean);
}

function parseCliOptions(args: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: false,
    urls: [],
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--') {
      continue;
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--limit') {
      const nextValue = args[index + 1];
      if (!nextValue || Number.isNaN(Number(nextValue))) {
        throw new Error('--limit requires a numeric value.');
      }

      options.limit = Number(nextValue);
      index += 1;
      continue;
    }

    if (arg === '--url') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        throw new Error('--url requires a value.');
      }

      options.urls.push(nextValue);
      index += 1;
      continue;
    }

    if (arg === '--site-url') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        throw new Error('--site-url requires a value.');
      }

      options.siteUrl = nextValue;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : 'Failed to submit IndexNow URLs.'
  );
  process.exitCode = 1;
});
