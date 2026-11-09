import { useDeferredValue } from 'react';
import { useInvoiceValues } from '../../hooks/useInvoice';
import { InvoicePreview } from './InvoicePreview';

/** The preview follows the form with useDeferredValue, so typing never waits for it. */
export function PreviewPanel() {
  const values = useInvoiceValues();
  const deferred = useDeferredValue(values);
  return (
    <div className="preview-panel" style={{ opacity: deferred === values ? 1 : 0.85 }}>
      <InvoicePreview invoice={deferred} />
    </div>
  );
}
