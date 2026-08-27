import type { SQLiteDatabase } from 'expo-sqlite';

type Migration = {
  version: number;
  up: (db: SQLiteDatabase) => Promise<void>;
};

/**
 * Ordered, additive schema changes. Each migration runs at most once, tracked
 * via `PRAGMA user_version`. Never drop or rewrite an existing migration —
 * append a new one instead so upgrades stay forward-compatible.
 */
const migrations: Migration[] = [
  {
    version: 1,
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          amount REAL NOT NULL,
          currency TEXT NOT NULL DEFAULT 'BRL',
          category TEXT NOT NULL,
          frequency TEXT NOT NULL,
          nextRenewalDate TEXT NOT NULL,
          trialEndDate TEXT,
          notes TEXT,
          status TEXT NOT NULL DEFAULT 'active',
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );
      `);
      await db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_subscriptions_next_renewal
          ON subscriptions (nextRenewalDate);
      `);
    },
  },
  {
    version: 2,
    up: async (db) => {
      // Nullable, no default: existing rows become NULL (no reminder) rather
      // than silently claiming a reminder is scheduled when nothing actually is.
      await db.execAsync(`ALTER TABLE subscriptions ADD COLUMN reminderDaysBefore INTEGER;`);
      await db.execAsync(`ALTER TABLE subscriptions ADD COLUMN reminderNotificationId TEXT;`);
    },
  },
];

/** Applies every migration newer than the database's current `user_version`, in order. */
export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  const currentVersion = row?.user_version ?? 0;

  const pending = migrations
    .filter((migration) => migration.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    await db.withTransactionAsync(async () => {
      await migration.up(db);
    });
    await db.execAsync(`PRAGMA user_version = ${migration.version};`);
  }
}
