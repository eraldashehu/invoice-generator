import { useContext, useMemo } from 'react';
import { InvoiceFormContext, InvoiceValuesContext } from '../context/InvoiceContext';
import type { InvoiceFormApi } from '../context/InvoiceContext';
import { computeTotals } from '../lib/totals';
import type { InvoiceValues, Totals } from '../model/types';

export function useInvoiceValues(): InvoiceValues {
  const values = useContext(InvoiceValuesContext);
  if (!values) throw new Error('useInvoiceValues must be used inside <InvoiceProvider>');
  return values;
}

export function useInvoiceForm(): InvoiceFormApi {
  const api = useContext(InvoiceFormContext);
  if (!api) throw new Error('useInvoiceForm must be used inside <InvoiceProvider>');
  return api;
}

/** Totals for the given values, recalculated only when lines or discount change. */
export function useTotals(values: Pick<InvoiceValues, 'lines' | 'discount'>): Totals {
  const { lines, discount } = values;
  return useMemo(() => computeTotals(lines ?? [], discount), [lines, discount]);
}
