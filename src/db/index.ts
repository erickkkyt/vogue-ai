import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

declare global {
  var vogueDb:
    | {
        client: ReturnType<typeof postgres>;
        db: PostgresJsDatabase<typeof schema>;
      }
    | undefined;
}

export async function getDb() {
  if (globalThis.vogueDb) {
    return globalThis.vogueDb.db;
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  const client = postgres(url, {
    max: 5,
    prepare: false,
    idle_timeout: 5,
    connect_timeout: 10,
  });
  const db = drizzle(client, { schema });

  if (process.env.NODE_ENV !== 'production') {
    globalThis.vogueDb = { client, db };
  }

  return db;
}
