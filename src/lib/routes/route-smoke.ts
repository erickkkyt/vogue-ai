export type RouteSmokeTarget = {
  path: string;
  acceptedStatuses?: readonly number[];
};

export type RouteSmokeResult = {
  status: number;
};

export const DEFAULT_ROUTE_SMOKE_TARGETS: readonly RouteSmokeTarget[] = [
  { path: '/app' },
  { path: '/login' },
  { path: '/zh' },
  { path: '/zh/app' },
  { path: '/auth/login' },
  { path: '/ai-image-prompt' },
  { path: '/gpt-image-prompt' },
  { path: '/nano-banana-prompt' },
  { path: '/midjourney-prompt' },
] as const;

export function isRouteSmokeResultAccepted(
  target: RouteSmokeTarget,
  result: RouteSmokeResult
) {
  return (target.acceptedStatuses ?? [200]).includes(result.status);
}

export function parseRouteSmokeBaseUrl(
  argv: readonly string[] = process.argv.slice(2),
  env: Record<string, string | undefined> = process.env
) {
  const equalsArg = argv.find((arg) => arg.startsWith('--base-url='));
  const flagIndex = argv.indexOf('--base-url');
  const raw =
    equalsArg?.slice('--base-url='.length) ||
    (flagIndex >= 0 ? argv[flagIndex + 1] : null) ||
    env.ROUTE_SMOKE_BASE_URL ||
    'http://localhost:3000';
  const parsed = new URL(raw);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Route smoke base URL must use http or https.');
  }

  const path = parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/+$/, '');
  return `${parsed.origin}${path}`;
}
