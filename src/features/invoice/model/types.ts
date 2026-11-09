import type { Dayjs } from 'dayjs';

export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'ALL';
export type VatRate = 0 | 4 | 10 | 20 | 22;
export type InvoiceStatus = 'draft' | 'sent' | 'paid';

export interface Party {
  name: string;
  address: string;
  email: string;
  vatId: string;
}

export interface LineItem {
  description: string;
  qty: number | null;
  price: number | null;
  vat: VatRate;
}

/** Shape of the Ant Design form, and of everything the preview shows. */
export interface InvoiceValues {
  number: string;
  issueDate: Dayjs | null;
  dueDate: Dayjs | null;
  currency: Currency;
  status: InvoiceStatus;
  from: Party;
  to: Party;
  lines: LineItem[];
  /** Percent, 0–100 */
  discount: number | null;
  notes: string;
  iban: string;
  /** Data URL of the uploaded logo, or empty */
  logo: string;
}

export interface VatLine {
  rate: VatRate;
  amount: number;
}

export interface Totals {
  subtotal: number;
  discountAmount: number;
  net: number;
  vatLines: VatLine[];
  vatTotal: number;
  total: number;
}
