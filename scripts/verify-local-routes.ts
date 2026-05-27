import {
  DEFAULT_ROUTE_SMOKE_TARGETS,
  isRouteSmokeResultAccepted,
  parseRouteSmokeBaseUrl,
} from '../src/lib/routes/route-smoke';

const baseUrl = parseRouteSmokeBaseUrl();

async function main() {
  let failed = false;

  for (const target of DEFAULT_ROUTE_SMOKE_TARGETS) {
    const url = new URL(target.path, `${baseUrl}/`);

    try {
      const response = await fetch(url, {
        redirect: 'manual',
        signal: AbortSignal.timeout(10_000),
      });
      const accepted = isRouteSmokeResultAccepted(target, {
        status: response.status,
      });
      const label = accepted ? 'PASS' : 'FAIL';
      console.log(`${label} GET ${url.toString()} -> ${response.status}`);

      if (!accepted) failed = true;
    } catch (error) {
      failed = true;
      console.error(`FAIL GET ${url.toString()} -> ${(error as Error).message}`);
    }
  }

  if (failed) {
    process.exitCode = 1;
  }
}

void main();
