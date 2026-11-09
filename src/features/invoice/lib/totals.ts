// Pure money logic, no React: easy to test.
import type { Currency, LineItem, Totals, VatLine, VatRate } from '../model/types';

export const round2 = (x: number): number => Math.round((x + Number.EPSILON) * 100) / 100;
export const lineAmount = (l: Pick<LineItem, 'qty' | 'price'> | undefined): number => (l?.qty ?? 0) * (l?.price ?? 0);

/**
 * Discount is applied before VAT, and VAT is grouped by rate,
 * the way most European invoices show it. Amounts are rounded to cents.
 */
export function computeTotals(lines: (LineItem | undefined)[], discountPct: number | null): Totals {
  const factor = 1 - Math.min(Math.max(discountPct ?? 0, 0), 100) / 100;
  const subtotal = round2(lines.reduce((s, l) => s + lineAmount(l), 0));
  const discountAmount = round2(subtotal * (1 - factor));

  const byRate = new Map<VatRate, number>();
  for (const l of lines) {
    if (!l) continue;
    byRate.set(l.vat, (byRate.get(l.vat) ?? 0) + (lineAmount(l) * factor * l.vat) / 100);
  }
  const vatLines: VatLine[] = [...byRate.entries()]
    .filter(([rate]) => rate > 0)
    .map(([rate, amount]) => ({ rate, amount: round2(amount) }))
    .sort((a, b) => b.rate - a.rate);

  const vatTotal = round2(vatLines.reduce((s, v) => s + v.amount, 0));
  const net = round2(subtotal - discountAmount);
  return { subtotal, discountAmount, net, vatLines, vatTotal, total: round2(net + vatTotal) };
}

const formatters = new Map<Currency, Intl.NumberFormat>();
/** Cached Intl formatters: creating one is relatively expensive. */
export function formatMoney(amount: number, currency: Currency): string {
  let f = formatters.get(currency);
  if (!f) {
    f = new Intl.NumberFormat('en-GB', { style: 'currency', currency });
    formatters.set(currency, f);
  }
  return f.format(amount);
}

/** "INV-2026-0042" -> "INV-2026-0043" */
export function nextNumber(number: string): string {
  const m = number.match(/^(.*?)(\d+)$/);
  if (!m) return `${number}-1`;
  return m[1] + String(Number(m[2]) + 1).padStart(m[2].length, '0');
}
