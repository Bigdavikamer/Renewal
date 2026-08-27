import * as SQLite from 'expo-sqlite';

import { runMigrations } from '@/db/migrations';

const DATABASE_NAME = 'renewal.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Lazily opens (and migrates) the app's single SQLite connection. Safe to
 * call from anywhere — concurrent callers share the same in-flight open.
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabase().catch((error) => {
      // Let the next call retry instead of caching a broken connection.
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');
  await runMigrations(db);
  return db;
}
