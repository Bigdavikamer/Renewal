import type { CurrencyCode } from '@/types/subscription';

export const DEFAULT_CURRENCY: CurrencyCode = 'BRL';

export const SUPPORTED_CURRENCIES: CurrencyCode[] = ['BRL', 'USD', 'EUR'];

/** Formats an amount in the given currency, e.g. 171.79 -> "R$171.79". */
export function formatCurrency(amount: number, currency: CurrencyCode = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
