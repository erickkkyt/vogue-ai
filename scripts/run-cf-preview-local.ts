import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import dotenv from 'dotenv';

const envFile = '.env.local';
const parsedEnv = dotenv.parse(readFileSync(envFile));
const databaseUrl = parsedEnv.DATABASE_URL?.trim();
const previewOrigin =
  process.env.CF_PREVIEW_ORIGIN?.trim() || 'http://localhost:8787';

if (!databaseUrl) {
  console.error(`DATABASE_URL is required in ${envFile} for local Hyperdrive.`);
  process.exit(1);
}

const child = spawn('npm', ['run', 'cf:preview'], {
  env: {
    ...process.env,
    CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE: databaseUrl,
    NEXT_PUBLIC_BASE_URL: previewOrigin,
    KIE_CALLBACK_URL: `${previewOrigin.replace(/\/+$/, '')}/api/effects/callback`,
  },
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
