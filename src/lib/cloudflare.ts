import { getCloudflareContext } from '@opennextjs/cloudflare';

type HyperdriveBinding = {
  connectionString?: string;
};

type VogueCloudflareEnv = CloudflareEnv & {
  HYPERDRIVE?: HyperdriveBinding;
};

export function getCloudflareEnv() {
  try {
    return getCloudflareContext().env as VogueCloudflareEnv;
  } catch {
    return undefined;
  }
}

export function getHyperdriveConnectionString() {
  return getCloudflareEnv()?.HYPERDRIVE?.connectionString;
}

export function isCloudflareWorkerRuntime() {
  return Boolean(getCloudflareEnv());
}
