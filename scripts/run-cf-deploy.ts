import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import dotenv from 'dotenv';

const hyperdriveLocalEnvKey =
  'CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE';
const allowedTargetEnvs = new Set(['staging', 'production']);

type WranglerConfig = {
  vars?: Record<string, string>;
  env?: Record<string, { vars?: Record<string, string> }>;
};

function readEnvFile(path: string) {
  if (!existsSync(path)) return {};

  return dotenv.parse(readFileSync(path));
}

function stripJsonComments(source: string) {
  let result = '';
  let inString = false;
  let quote = '';
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
        result += char;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      result += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        inString = false;
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
      result += char;
      continue;
    }

    if (char === '/' && next === '/') {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (char === '/' && next === '*') {
      inBlockComment = true;
      index += 1;
      continue;
    }

    result += char;
  }

  return result;
}

function readWranglerVars(targetEnv: string) {
  if (!existsSync('wrangler.jsonc')) return {};

  const wranglerConfig = JSON.parse(
    stripJsonComments(readFileSync('wrangler.jsonc', 'utf8'))
  ) as WranglerConfig;

  return {
    ...(wranglerConfig.vars ?? {}),
    ...(wranglerConfig.env?.[targetEnv]?.vars ?? {}),
  };
}

function run(command: string, args: string[], env: NodeJS.ProcessEnv) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      env,
      shell: true,
      stdio: 'inherit',
    });

    child.on('exit', (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
        return;
      }

      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });
}

function readTargetEnv(args: string[]) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--env' || arg === '-e') {
      return args[index + 1];
    }

    if (arg.startsWith('--env=')) {
      return arg.slice('--env='.length);
    }
  }

  return null;
}

function hasFlag(args: string[], flag: string) {
  return args.includes(flag);
}

function withoutFlag(args: string[], flag: string) {
  return args.filter((arg) => arg !== flag);
}

async function main() {
  const deployArgs = process.argv.slice(2);
  const targetEnv = readTargetEnv(deployArgs);
  if (!targetEnv || !allowedTargetEnvs.has(targetEnv)) {
    console.error(
      'Cloudflare deploy requires an explicit target: --env staging or --env production.'
    );
    process.exit(1);
  }
  if (targetEnv === 'production' && !hasFlag(deployArgs, '--confirm-production')) {
    console.error(
      'Production deploy requires --confirm-production in addition to --env production.'
    );
    process.exit(1);
  }

  const localEnv = readEnvFile('.env.local');
  const devVars = readEnvFile('.dev.vars');
  const wranglerVars = readWranglerVars(targetEnv);
  const hyperdriveLocalConnectionString =
    process.env[hyperdriveLocalEnvKey] ||
    process.env.DATABASE_URL ||
    devVars[hyperdriveLocalEnvKey] ||
    localEnv[hyperdriveLocalEnvKey] ||
    localEnv.DATABASE_URL;

  if (!hyperdriveLocalConnectionString) {
    console.error(
      `${hyperdriveLocalEnvKey} or DATABASE_URL is required for Cloudflare deploy.`
    );
    process.exit(1);
  }

  const env = {
    ...wranglerVars,
    ...process.env,
    ...devVars,
    [hyperdriveLocalEnvKey]: hyperdriveLocalConnectionString,
  };

  await run('opennextjs-cloudflare', ['build'], env);
  await run('npm', ['run', 'cf:guard'], env);
  await run(
    'opennextjs-cloudflare',
    ['deploy', ...withoutFlag(deployArgs, '--confirm-production')],
    env
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
