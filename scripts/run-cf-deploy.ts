import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import dotenv from 'dotenv';

const hyperdriveLocalEnvKey =
  'CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE';

function readEnvFile(path: string) {
  if (!existsSync(path)) return {};

  return dotenv.parse(readFileSync(path));
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

async function main() {
  const localEnv = readEnvFile('.env.local');
  const devVars = readEnvFile('.dev.vars');
  const hyperdriveLocalConnectionString =
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
    ...process.env,
    ...devVars,
    [hyperdriveLocalEnvKey]: hyperdriveLocalConnectionString,
  };

  await run('opennextjs-cloudflare', ['build'], env);
  await run('opennextjs-cloudflare', ['deploy', ...process.argv.slice(2)], env);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
