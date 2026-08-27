import { getDatabase } from '@/db/database';
import type { Subscription, SubscriptionInput } from '@/types/subscription';
import { generateId } from '@/utils/id';

const TABLE = 'subscriptions';

function fail(action: string, error: unknown): never {
  if (__DEV__) console.error(`[subscription-repository] ${action} failed:`, error);
  throw new Error(`Couldn't ${action}. Please try again.`);
}

export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const db = await getDatabase();
    return await db.getAllAsync<Subscription>(
      `SELECT * FROM ${TABLE} ORDER BY nextRenewalDate ASC;`
    );
  } catch (error) {
    fail('load your subscriptions', error);
  }
}

/** Same ordering as `getSubscriptions`, optionally capped — the two are equivalent for now. */
export async function getUpcomingSubscriptions(limit?: number): Promise<Subscription[]> {
  try {
    const db = await getDatabase();
    if (limit === undefined) {
      return await db.getAllAsync<Subscription>(
        `SELECT * FROM ${TABLE} ORDER BY nextRenewalDate ASC;`
      );
    }
    return await db.getAllAsync<Subscription>(
      `SELECT * FROM ${TABLE} ORDER BY nextRenewalDate ASC LIMIT ?;`,
      limit
    );
  } catch (error) {
    fail('load upcoming payments', error);
  }
}

export async function getSubscriptionById(id: string): Promise<Subscription | null> {
  try {
    const db = await getDatabase();
    return await db.getFirstAsync<Subscription>(`SELECT * FROM ${TABLE} WHERE id = ?;`, id);
  } catch (error) {
    fail('load that subscription', error);
  }
}

export async function createSubscription(input: SubscriptionInput): Promise<Subscription> {
  try {
    const db = await getDatabase();
    const now = new Date().toISOString();
    const subscription: Subscription = {
      id: generateId(),
      name: input.name,
      amount: input.amount,
      currency: input.currency,
      category: input.category,
      frequency: input.frequency,
      nextRenewalDate: input.nextRenewalDate,
      trialEndDate: input.trialEndDate ?? null,
      notes: input.notes ?? null,
      status: input.status ?? 'active',
      reminderDaysBefore: input.reminderDaysBefore,
      reminderNotificationId: input.reminderNotificationId ?? null,
      createdAt: now,
      updatedAt: now,
    };

    await db.runAsync(
      `INSERT INTO ${TABLE}
        (id, name, amount, currency, category, frequency, nextRenewalDate, trialEndDate, notes, status, reminderDaysBefore, reminderNotificationId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      subscription.id,
      subscription.name,
      subscription.amount,
      subscription.currency,
      subscription.category,
      subscription.frequency,
      subscription.nextRenewalDate,
      subscription.trialEndDate,
      subscription.notes,
      subscription.status,
      subscription.reminderDaysBefore,
      subscription.reminderNotificationId,
      subscription.createdAt,
      subscription.updatedAt
    );

    return subscription;
  } catch (error) {
    fail('save that payment', error);
  }
}

export async function updateSubscription(
  id: string,
  input: Partial<SubscriptionInput>
): Promise<void> {
  const fields = Object.keys(input) as (keyof SubscriptionInput)[];
  if (fields.length === 0) return;

  try {
    const db = await getDatabase();
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => input[field] ?? null);

    await db.runAsync(
      `UPDATE ${TABLE} SET ${setClause}, updatedAt = ? WHERE id = ?;`,
      ...values,
      new Date().toISOString(),
      id
    );
  } catch (error) {
    fail('update that subscription', error);
  }
}

export async function deleteSubscription(id: string): Promise<void> {
  try {
    const db = await getDatabase();
    await db.runAsync(`DELETE FROM ${TABLE} WHERE id = ?;`, id);
  } catch (error) {
    fail('delete that subscription', error);
  }
}
