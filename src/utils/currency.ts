/** Formats a BRL amount, e.g. 171.79 -> "R$171.79". */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}
