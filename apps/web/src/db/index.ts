import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Database file path - uses environment variable or defaults to local data directory
const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './data/dev.db';

// Create database connection
const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrency
sqlite.pragma('journal_mode = WAL');

// Create Drizzle ORM instance with schema
export const db = drizzle(sqlite, { schema });

// Export types
export type Database = typeof db;

// Re-export schema for convenience
export * from './schema';
