import dayjs from 'dayjs';
import { sampleInvoice } from './defaults';
import type { InvoiceValues } from './types';

export const STORAGE_KEY = 'invoicely:v2';

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const toDate = (v: unknown) => (typeof v === 'string' && v ? dayjs(v) : null);

/**
 * localStorage holds JSON, where Day.js dates become ISO strings.
 * This turns them back into Day.js objects and fills anything missing.
 */
export function parseStoredInvoice(raw: unknown): InvoiceValues | null {
  if (!isObject(raw) || !Array.isArray(raw.lines)) return null;
  const base = sampleInvoice();
  const stored = raw as Partial<Record<keyof InvoiceValues, unknown>>;
  return {
    ...base,
    ...(stored as Partial<InvoiceValues>),
    issueDate: toDate(stored.issueDate) ?? base.issueDate,
    dueDate: toDate(stored.dueDate) ?? base.dueDate,
    from: { ...base.from, ...(isObject(stored.from) ? (stored.from as Partial<InvoiceValues['from']>) : {}) },
    to: { ...base.to, ...(isObject(stored.to) ? (stored.to as Partial<InvoiceValues['to']>) : {}) },
  };
}
