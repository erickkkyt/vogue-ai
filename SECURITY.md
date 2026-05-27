# Security Notes

This repo should not contain production secrets. Keep all credentials in the deployment platform and local `.env.local`.

## Required Secrets

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ZPAY_PID`
- `ZPAY_KEY`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_IMAGE_BUCKET_NAME`
- `RESEND_API_KEY`
- `EVOLINK_API_KEY`
- `KIE_API_KEY`
- `KIE_WEBHOOK_SECRET`
- `CRON_SECRET`

## Removed Legacy Secret Surfaces

The current runtime no longer uses Supabase Auth, N8N webhook URLs, or per-tool Supabase RPC credentials. Remove those variables from deployment environments after confirming there are no old deployments still serving them. Google One Tap is optional in the current login surface and should only be enabled with the current `NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED` and Google OAuth configuration.

## Operational Checks

- Rotate any secret that was previously copied into local docs or screenshots.
- Verify Stripe webhooks against `STRIPE_WEBHOOK_SECRET`.
- Call maintenance endpoints with `Authorization: Bearer $CRON_SECRET`; do not pass secrets in query strings.
- Run `npm run typecheck` and `npm run build` before deployment.
- Run `npm run db:migrate` only against the intended production database URL.
