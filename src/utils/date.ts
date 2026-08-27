export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Whole-day difference between now and the given date, ignoring time of day. */
export function daysUntil(isoDate: string): number {
  const target = new Date(isoDate);
  const now = new Date();

  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((startOfTarget.getTime() - startOfNow.getTime()) / msPerDay);
}

const SHORT_DATE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const SHORT_DATE_FORMAT_WITH_YEAR = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/** e.g. "Sep 14" or, with `includeYear`, "Sep 14, 2026". */
export function formatDate(isoDate: string, options?: { includeYear?: boolean }): string {
  const date = new Date(isoDate);
  return (options?.includeYear ? SHORT_DATE_FORMAT_WITH_YEAR : SHORT_DATE_FORMAT).format(date);
}

export function renewalLabel(isoDate: string): string {
  const days = daysUntil(isoDate);

  if (days < 0) return days === -1 ? 'Overdue by 1 day' : `Overdue by ${Math.abs(days)} days`;
  if (days === 0) return 'Renews today';
  if (days === 1) return 'Renews tomorrow';
  if (days < 7) return `Renews in ${days} days`;
  if (days < 28) {
    const weeks = Math.round(days / 7);
    return `Renews in ${weeks} week${weeks === 1 ? '' : 's'}`;
  }
  return `Renews on ${formatDate(isoDate)}`;
}

/** Renewals this close (or overdue) get an urgency treatment in the UI. */
export const RENEWAL_SOON_THRESHOLD_DAYS = 3;

export function isRenewingSoon(isoDate: string): boolean {
  return daysUntil(isoDate) <= RENEWAL_SOON_THRESHOLD_DAYS;
}

export function getGreeting(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
