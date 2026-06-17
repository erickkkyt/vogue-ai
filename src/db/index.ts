import { AsyncLocalStorage } from 'node:async_hooks';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import {
  getHyperdriveConnectionString,
  isCloudflareWorkerRuntime,
} from '@/lib/cloudflare';

declare global {
  var vogueDb:
    | {
        client: ReturnType<typeof postgres>;
        db: PostgresJsDatabase<typeof schema>;
      }
    | undefined;
}

type DbBundle = {
  client: ReturnType<typeof postgres>;
  db: PostgresJsDatabase<typeof schema>;
};

type RequestDbContext = {
  dbBundle?: DbBundle;
};

const requestDbStorage = new AsyncLocalStorage<RequestDbContext>();

type HyperdriveConnectionString = string | null | undefined;

function shouldUseCachedDb(hyperdriveConnectionString: HyperdriveConnectionString) {
  return (
    !hyperdriveConnectionString &&
    !isCloudflareWorkerRuntime() &&
    process.env.NODE_ENV !== 'production'
  );
}

function shouldUseRequestDbContext(
  hyperdriveConnectionString: HyperdriveConnectionString
) {
  return (
    Boolean(hyperdriveConnectionString) ||
    isCloudflareWorkerRuntime() ||
    process.env.NODE_ENV === 'production'
  );
}

function createDbBundle(
  hyperdriveConnectionString: HyperdriveConnectionString
): DbBundle {
  const url = hyperdriveConnectionString ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL or Cloudflare HYPERDRIVE binding is required');
  }

  const client = postgres(url, {
    max: hyperdriveConnectionString ? 1 : 5,
    prepare: false,
    idle_timeout: 5,
    connect_timeout: 10,
  });
  const db = drizzle(client, { schema });

  return { client, db };
}

export async function getDb() {
  const requestDbContext = requestDbStorage.getStore();
  if (requestDbContext) {
    requestDbContext.dbBundle ??= createDbBundle(
      getHyperdriveConnectionString()
    );

    return requestDbContext.dbBundle.db;
  }

  const hyperdriveConnectionString = getHyperdriveConnectionString();

  if (shouldUseCachedDb(hyperdriveConnectionString) && globalThis.vogueDb) {
    return globalThis.vogueDb.db;
  }

  const dbBundle = createDbBundle(hyperdriveConnectionString);

  if (shouldUseCachedDb(hyperdriveConnectionString)) {
    globalThis.vogueDb = dbBundle;
  }

  return dbBundle.db;
}

export function withDbRequestContext<T>(handler: () => T): T;
export function withDbRequestContext<T>(handler: () => Promise<T>): Promise<T>;
export function withDbRequestContext<T>(handler: () => T | Promise<T>) {
  if (
    requestDbStorage.getStore() ||
    !shouldUseRequestDbContext(getHyperdriveConnectionString())
  ) {
    return handler();
  }

  return requestDbStorage.run({}, handler);
}
