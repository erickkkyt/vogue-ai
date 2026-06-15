const DEFAULT_WATERMARK_WIDTH = 142;
const DEFAULT_WATERMARK_MARGIN = 24;
const OUTPUT_CONTENT_TYPE = 'image/webp';
const SUPPORTED_SOURCE_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

function parseAllowedOrigins(value) {
  return String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isLocalOrPrivateHostname(hostname) {
  const normalized = hostname.toLowerCase();

  if (
    normalized === 'localhost' ||
    normalized.endsWith('.localhost') ||
    normalized === '0.0.0.0'
  ) {
    return true;
  }

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(normalized)) {
    const parts = normalized.split('.').map((part) => Number(part));
    const [first, second] = parts;

    return (
      first === 10 ||
      first === 127 ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168) ||
      (first === 169 && second === 254)
    );
  }

  return false;
}

function validateSourceUrl(sourceUrl, allowedOrigins) {
  let parsed;

  try {
    parsed = new URL(sourceUrl);
  } catch {
    throw new Error('sourceUrl must be a valid URL');
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('sourceUrl must use https');
  }

  if (isLocalOrPrivateHostname(parsed.hostname)) {
    throw new Error('sourceUrl points to a private host');
  }

  if (allowedOrigins.length > 0 && !allowedOrigins.includes(parsed.origin)) {
    throw new Error('sourceUrl origin is not allowed');
  }

  return parsed.toString();
}

function validateObjectKey(objectKey) {
  const normalized = String(objectKey || '').trim();

  if (!normalized) {
    throw new Error('objectKey is required');
  }

  if (
    normalized.startsWith('/') ||
    normalized.includes('..') ||
    !normalized.endsWith('.webp') ||
    !/^(effects|watermark-tests)\//.test(normalized)
  ) {
    throw new Error('objectKey is not allowed');
  }

  return normalized;
}

function requireSecret(request, env) {
  const configuredSecret = env.WATERMARK_WORKER_SECRET;

  if (!configuredSecret) {
    return false;
  }

  return request.headers.get('authorization') === `Bearer ${configuredSecret}`;
}

async function handleWatermark(request, env) {
  if (!requireSecret(request, env)) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  if (!env.IMAGES) {
    return jsonResponse({ error: 'IMAGES binding is not configured' }, 500);
  }

  if (!env.IMAGE_BUCKET) {
    return jsonResponse(
      { error: 'IMAGE_BUCKET binding is not configured' },
      500
    );
  }

  if (!env.WATERMARK_URL) {
    return jsonResponse({ error: 'WATERMARK_URL is not configured' }, 500);
  }

  if (!env.R2_PUBLIC_BASE) {
    return jsonResponse({ error: 'R2_PUBLIC_BASE is not configured' }, 500);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Request body must be JSON' }, 400);
  }

  let sourceUrl;
  let objectKey;

  try {
    sourceUrl = validateSourceUrl(
      body.sourceUrl,
      parseAllowedOrigins(env.ALLOWED_SOURCE_ORIGINS)
    );
    objectKey = validateObjectKey(body.objectKey);
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }

  const margin = Number(env.WATERMARK_MARGIN || DEFAULT_WATERMARK_MARGIN);
  const watermarkWidth = Number(
    env.WATERMARK_WIDTH || DEFAULT_WATERMARK_WIDTH
  );
  const watermarkOpacity = Number(env.WATERMARK_OPACITY || 1);
  const outputQuality = Number(env.WATERMARK_OUTPUT_QUALITY || 92);

  const [sourceResponse, watermarkResponse] = await Promise.all([
    fetch(sourceUrl),
    fetch(env.WATERMARK_URL),
  ]);

  if (!sourceResponse.ok || !sourceResponse.body) {
    return jsonResponse(
      {
        error: 'Source image fetch failed',
        status: sourceResponse.status,
      },
      502
    );
  }

  const sourceContentType =
    sourceResponse.headers.get('content-type')?.toLowerCase() || '';
  if (
    !SUPPORTED_SOURCE_CONTENT_TYPES.some((contentType) =>
      sourceContentType.includes(contentType)
    )
  ) {
    return jsonResponse(
      { error: 'sourceUrl did not return a supported image type' },
      400
    );
  }

  if (!watermarkResponse.ok || !watermarkResponse.body) {
    return jsonResponse(
      {
        error: 'Watermark image fetch failed',
        status: watermarkResponse.status,
      },
      502
    );
  }

  const transformed = (
    await env.IMAGES.input(sourceResponse.body)
      .draw(
        env.IMAGES.input(watermarkResponse.body).transform({
          width: watermarkWidth,
        }),
        {
          top: margin,
          left: margin,
          opacity: watermarkOpacity,
        }
      )
      .output({
        format: OUTPUT_CONTENT_TYPE,
        quality: outputQuality,
      })
  ).response();

  if (!transformed.ok || !transformed.body) {
    return jsonResponse(
      {
        error: 'Cloudflare image transform failed',
        status: transformed.status,
      },
      502
    );
  }

  const imageBytes = await transformed.arrayBuffer();

  await env.IMAGE_BUCKET.put(objectKey, imageBytes, {
    httpMetadata: {
      cacheControl: 'public, max-age=31536000, immutable',
      contentType: OUTPUT_CONTENT_TYPE,
    },
  });

  const publicBase = String(env.R2_PUBLIC_BASE).replace(/\/+$/, '');

  return jsonResponse({
    url: `${publicBase}/${objectKey}`,
    key: objectKey,
    contentType: OUTPUT_CONTENT_TYPE,
    sizeBytes: imageBytes.byteLength,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== 'POST' || url.pathname !== '/watermark') {
      return jsonResponse({ error: 'Not found' }, 404);
    }

    return handleWatermark(request, env);
  },
};
