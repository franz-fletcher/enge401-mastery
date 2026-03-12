import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Use pooled connection for application queries
const sql = neon(process.env.DATABASE_URL!);

// Create Drizzle ORM instance with schema
export const db = drizzle(sql, { schema });

// Export types
export type Database = typeof db;

// Re-export schema for convenience
export * from './schema';
