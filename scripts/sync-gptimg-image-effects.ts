import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { inArray } from 'drizzle-orm';
import postgres from 'postgres';
import { STATIC_IMAGE_EFFECTS } from '../src/lib/effects/effects';
import * as schema from '../src/db/schema';
import { effect } from '../src/db/schema';

config({ path: '.env.local' });
config({ path: '.env', override: false });

const IMAGE_EFFECT_IDS = [4, 5, 6, 15, 16, 17] as const;

const main = async () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  const client = postgres(url, {
    max: 1,
    prepare: false,
    idle_timeout: 1,
    connect_timeout: 10,
  });
  const db = drizzle(client, { schema });

  try {
    const imageEffects = STATIC_IMAGE_EFFECTS.filter((item) =>
      IMAGE_EFFECT_IDS.includes(item.id as (typeof IMAGE_EFFECT_IDS)[number])
    );

    for (const item of imageEffects) {
      await db
        .insert(effect)
        .values(item)
        .onConflictDoUpdate({
          target: effect.id,
          set: {
            name: item.name,
            type: item.type,
            model: item.model,
            version: item.version,
            credit: item.credit,
            linkName: item.linkName,
            prePrompt: item.prePrompt,
            description: item.description,
            platform: item.platform,
            api: item.api,
            isOpen: item.isOpen,
            provider: item.provider,
            inputSchema: item.inputSchema,
            pricingSchema: item.pricingSchema,
          },
        });
    }

    const rows = await db
      .select({
        id: effect.id,
        name: effect.name,
        provider: effect.provider,
        pricingSchema: effect.pricingSchema,
      })
      .from(effect)
      .where(inArray(effect.id, [...IMAGE_EFFECT_IDS]))
      .orderBy(effect.id);

    console.log(
      JSON.stringify(
        rows.map((row) => ({
          id: row.id,
          name: row.name,
          provider: row.provider,
          pricingStrategy:
            row.pricingSchema &&
            typeof row.pricingSchema === 'object' &&
            'strategy' in row.pricingSchema
              ? row.pricingSchema.strategy
              : null,
          pricingRules:
            row.pricingSchema &&
            typeof row.pricingSchema === 'object' &&
            'rules' in row.pricingSchema &&
            Array.isArray(row.pricingSchema.rules)
              ? row.pricingSchema.rules.length
              : null,
        })),
        null,
        2
      )
    );
  } finally {
    await client.end();
  }
};

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
