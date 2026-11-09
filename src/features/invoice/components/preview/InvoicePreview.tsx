import { memo } from 'react';
import { formatMoney, lineAmount } from '../../lib/totals';
import { useTotals } from '../../hooks/useInvoice';
import type { InvoiceValues, Party } from '../../model/types';

const STATUS_LABEL = { sent: 'Sent', paid: 'Paid' } as const;

interface InvoicePreviewProps {
  invoice: InvoiceValues;
}

/** The printable invoice. Plain HTML and CSS so the PDF matches the screen. */
export const InvoicePreview = memo(function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const t = useTotals(invoice);
  const m = (x: number) => formatMoney(x, invoice.currency);
  const parties: [string, Party][] = [
    ['From', invoice.from],
    ['Bill to', invoice.to],
  ];
  const lines = (invoice.lines ?? []).filter(Boolean);

  return (
    <article className="paper" aria-label="Invoice preview">
      {invoice.status !== 'draft' && <div className={`stamp ${invoice.status}`}>{STATUS_LABEL[invoice.status]}</div>}

      <header className="paper-head">
        <div>{invoice.logo ? <img src={invoice.logo} alt="" className="logo-img" /> : <div className="logo-text">{invoice.from?.name || 'Your company'}</div>}</div>
        <div className="title-block">
          <h1>Invoice</h1>
          <dl>
            <div>
              <dt>Number</dt>
              <dd>{invoice.number}</dd>
            </div>
            <div>
              <dt>Issued</dt>
              <dd>{invoice.issueDate?.format('D MMMM YYYY')}</dd>
            </div>
            <div>
              <dt>Due</dt>
              <dd>{invoice.dueDate?.format('D MMMM YYYY')}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="parties">
        {parties.map(([label, p]) => (
          <div key={label}>
            <h3>{label}</h3>
            <strong>{p?.name}</strong>
            {p?.address && <p>{p.address}</p>}
            {p?.email && <p>{p.email}</p>}
            {p?.vatId && <p>VAT: {p.vatId}</p>}
          </div>
        ))}
      </div>

      <div className="paper-table">
        <table>
          <thead>
            <tr>
              <th className="l">Description</th>
              <th>Qty</th>
              <th>Unit price</th>
              <th>VAT</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i}>
                <td className="l">{l.description || '—'}</td>
                <td>{l.qty ?? 0}</td>
                <td>{m(l.price ?? 0)}</td>
                <td>{l.vat}%</td>
                <td>{m(lineAmount(l))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="totals">
        <div>
          <span>Subtotal</span>
          <span>{m(t.subtotal)}</span>
        </div>
        {t.discountAmount > 0 && (
          <>
            <div>
              <span>Discount ({invoice.discount}%)</span>
              <span>−{m(t.discountAmount)}</span>
            </div>
            <div>
              <span>Net amount</span>
              <span>{m(t.net)}</span>
            </div>
          </>
        )}
        {t.vatLines.map((v) => (
          <div key={v.rate}>
            <span>VAT {v.rate}%</span>
            <span>{m(v.amount)}</span>
          </div>
        ))}
        <div className="grand">
          <span>Total due</span>
          <span>{m(t.total)}</span>
        </div>
      </div>

      <footer className="paper-foot">
        {invoice.iban && (
          <p>
            <b>Bank transfer</b> · IBAN {invoice.iban} · Reference {invoice.number}
          </p>
        )}
        {invoice.notes && <p>{invoice.notes}</p>}
      </footer>
    </article>
  );
});
