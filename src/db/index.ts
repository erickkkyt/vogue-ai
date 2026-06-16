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

export async function getDb() {
  const hyperdriveConnectionString = getHyperdriveConnectionString();
  const shouldUseCachedDb =
    !hyperdriveConnectionString &&
    !isCloudflareWorkerRuntime() &&
    process.env.NODE_ENV !== 'production';

  if (shouldUseCachedDb && globalThis.vogueDb) {
    return globalThis.vogueDb.db;
  }

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

  if (shouldUseCachedDb) {
    globalThis.vogueDb = { client, db };
  }

  return db;
}
