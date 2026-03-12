import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!,
  },
  // Enable strict mode for better type safety
  strict: true,
  // Enable verbose logging in development
  verbose: process.env.NODE_ENV === 'development',
} satisfies Config;
