import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// Ensure data directory exists
const dbPath = process.env.DATABASE_PATH || './data/database.sqlite';
const dbDir = dirname(dbPath);

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// Create SQLite database connection with WAL mode for better concurrency
const sqlite = new Database(dbPath);

// Enable WAL mode for better performance and concurrency
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('synchronous = NORMAL');
sqlite.pragma('foreign_keys = ON');

// Create Drizzle instance
export const db = drizzle(sqlite, { schema, logger: false });

// Export raw SQLite connection for session store
export const sqliteDb = sqlite;
