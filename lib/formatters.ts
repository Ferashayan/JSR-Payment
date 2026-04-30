/**
 * Utility functions for consistent formatting across server and client
 * Avoids hydration mismatches from locale-dependent formatting
 */

/**
 * Format a number with thousand separators (e.g., 1000 -> 1,000)
 * Uses standard English format for consistency
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency amount in Arabic
 */
export function formatCurrency(amount: number, currency: string = 'ر.س'): string {
  return `${formatNumber(Math.abs(amount))} ${currency}`;
}

/**
 * Format positive or negative amount
 */
export function formatSignedAmount(amount: number, currency: string = 'ر.س'): string {
  const sign = amount >= 0 ? '+' : '-';
  return `${sign} ${formatNumber(Math.abs(amount))} ${currency}`;
}
