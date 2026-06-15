# VogueAI Watermark Worker

This Worker adds the transparent Vogue AI watermark to generated images through
the Cloudflare Images binding, then writes the watermarked WebP output back to
the image R2 bucket.

The binding path is intentional: it transforms raw image bytes in the Worker,
which is a better fit for "fetch a provider image, draw a watermark, write the
result to R2" than URL-only `cf.image` subrequests.

## Runtime vars

The Worker uses:

```bash
WATERMARK_WORKER_SECRET=<secret set with wrangler secret put>
R2_PUBLIC_BASE=https://media.vogueai.net
WATERMARK_URL=https://media.vogueai.net/branding/vogueai-watermark-clean-2x.png
```

## Request

```json
{
  "sourceUrl": "https://provider-output.example/image.png",
  "objectKey": "effects/<effect-id>/images/<generation-id>-watermarked.webp"
}
```

## Response

```json
{
  "url": "https://media.vogueai.net/effects/<effect-id>/images/<generation-id>-watermarked.webp",
  "key": "effects/<effect-id>/images/<generation-id>-watermarked.webp",
  "contentType": "image/webp",
  "sizeBytes": 12345
}
```

Cloudflare Image Transformations must be tested on deployed Workers. Local
`wrangler dev` can check routing and auth, but it does not fully prove the
production image transform behavior.
