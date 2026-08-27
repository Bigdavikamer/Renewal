import type { BillingFrequency, Subscription } from '@/types/subscription';

const AVERAGE_WEEKS_PER_MONTH = 4.345;

function toMonthlyAmount({ amount, frequency }: Pick<Subscription, 'amount' | 'frequency'>): number {
  switch (frequency) {
    case 'yearly':
      return amount / 12;
    case 'quarterly':
      return amount / 3;
    case 'weekly':
      return amount * AVERAGE_WEEKS_PER_MONTH;
    case 'monthly':
      return amount;
  }
}

/**
 * Sums each subscription's monthly-normalized amount. V1 assumes a single
 * household currency (no FX conversion), so mixed-currency totals are only
 * meaningful if every subscription shares the same currency.
 */
export function getMonthlyTotal(subscriptions: Subscription[]): number {
  return subscriptions.reduce((total, subscription) => total + toMonthlyAmount(subscription), 0);
}

export function getYearlyTotal(subscriptions: Subscription[]): number {
  return getMonthlyTotal(subscriptions) * 12;
}

export function sortByNextRenewal(subscriptions: Subscription[]): Subscription[] {
  return [...subscriptions].sort(
    (a, b) => new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime()
  );
}

export function formatFrequency(frequency: BillingFrequency): string {
  switch (frequency) {
    case 'yearly':
      return 'Yearly';
    case 'quarterly':
      return 'Quarterly';
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
  }
}
