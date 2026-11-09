import dayjs from 'dayjs';
import { nextNumber } from '../lib/totals';
import type { Currency, InvoiceStatus, InvoiceValues, LineItem, VatRate } from './types';

export const CURRENCIES: Currency[] = ['EUR', 'USD', 'GBP', 'CHF', 'ALL'];
export const VAT_RATES: VatRate[] = [0, 4, 10, 20, 22];
export const STATUS_OPTIONS: { value: InvoiceStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'sent', label: 'Sent', color: 'processing' },
  { value: 'paid', label: 'Paid', color: 'success' },
];

export const emptyLine = (): LineItem => ({ description: '', qty: 1, price: null, vat: 22 });

export function sampleInvoice(): InvoiceValues {
  return {
    number: `INV-${dayjs().year()}-0042`,
    issueDate: dayjs(),
    dueDate: dayjs().add(30, 'day'),
    currency: 'EUR',
    status: 'draft',
    from: { name: 'Studio Lumen S.r.l.', address: 'Via Roma 12\n20121 Milano, Italy', email: 'billing@studiolumen.example', vatId: 'IT01234567890' },
    to: { name: 'Northwind Retail Ltd', address: '48 Harbour Street\nDublin D02, Ireland', email: 'accounts@northwind.example', vatId: 'IE9876543X' },
    lines: [
      { description: 'Dashboard UI design and prototype', qty: 1, price: 2400, vat: 22 },
      { description: 'React frontend development (hours)', qty: 32, price: 65, vat: 22 },
      { description: 'Accessibility audit', qty: 1, price: 450, vat: 22 },
    ],
    discount: 5,
    notes: 'Thank you for your business. Payment by bank transfer within 30 days.',
    iban: 'IT60 X054 2811 1010 0000 0123 456',
    logo: '',
  };
}

/** A fresh invoice that keeps your own company details and continues the numbering. */
export function nextInvoice(current: InvoiceValues): InvoiceValues {
  return {
    ...sampleInvoice(),
    number: nextNumber(current.number),
    from: current.from,
    logo: current.logo,
    iban: current.iban,
    notes: current.notes,
    currency: current.currency,
    to: { name: '', address: '', email: '', vatId: '' },
    lines: [emptyLine()],
    discount: 0,
  };
}
