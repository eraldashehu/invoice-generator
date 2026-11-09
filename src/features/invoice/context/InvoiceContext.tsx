import { createContext, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import { usePersistentReducer } from '../../../shared/hooks/usePersistentReducer';
import { nextInvoice, sampleInvoice } from '../model/defaults';
import { STORAGE_KEY, parseStoredInvoice } from '../model/storage';
import type { InvoiceValues } from '../model/types';

export interface InvoiceFormApi {
  form: FormInstance<InvoiceValues>;
  /** Values the form starts with (read once, on mount). */
  initialValues: InvoiceValues;
  /** Pass to <Form onValuesChange>: keeps the context in sync with the form. */
  onValuesChange: (changed: Partial<InvoiceValues>, all: InvoiceValues) => void;
  loadExample: () => void;
  startNext: () => void;
}

export const InvoiceValuesContext = createContext<InvoiceValues | null>(null);
export const InvoiceFormContext = createContext<InvoiceFormApi | null>(null);

const replaceReducer = (_: InvoiceValues, next: InvoiceValues) => next;

/**
 * The Ant Design form is the source of truth while editing.
 * Every change is mirrored into a persisted reducer, which feeds the
 * live preview and is saved to localStorage (debounced).
 */
export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [form] = Form.useForm<InvoiceValues>();
  // Lazy useState: the example invoice is built once, not on every render.
  const [fallback] = useState(sampleInvoice);
  const [values, setValues] = usePersistentReducer(replaceReducer, fallback, { key: STORAGE_KEY, parse: parseStoredInvoice });
  // The form reads its starting values only once, on mount.
  const [initialValues] = useState(values);

  const replaceAll = useCallback(
    (next: InvoiceValues) => {
      form.setFieldsValue(next); // setFieldsValue does not trigger onValuesChange,
      setValues(next); //            so the mirror is updated by hand.
    },
    [form, setValues]
  );

  const onValuesChange = useCallback((_: Partial<InvoiceValues>, all: InvoiceValues) => setValues(all), [setValues]);
  const loadExample = useCallback(() => replaceAll(sampleInvoice()), [replaceAll]);
  // getFieldsValue(true) returns everything in the form store, including the logo.
  const startNext = useCallback(() => replaceAll(nextInvoice(form.getFieldsValue(true))), [form, replaceAll]);

  const formApi = useMemo<InvoiceFormApi>(
    () => ({ form, initialValues, onValuesChange, loadExample, startNext }),
    [form, initialValues, onValuesChange, loadExample, startNext]
  );

  return (
    <InvoiceFormContext.Provider value={formApi}>
      <InvoiceValuesContext.Provider value={values}>{children}</InvoiceValuesContext.Provider>
    </InvoiceFormContext.Provider>
  );
}
