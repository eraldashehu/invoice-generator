# Invoicely

Invoice generator with line items, VAT per line, discounts, five currencies, a live A4 preview and PDF export.
Built with **React 18**, **TypeScript** and **Ant Design 5**.

**Live demo:** https://eraldashehu.github.io/invoice-generator/

## Features

- **Ant Design Form** for the whole editor, with **`Form.List`** for line items (add and remove rows).
- **Validation**: required company names and descriptions, email format, due date not before the issue date. Download PDF validates first and scrolls to the first error.
- **Correct totals**: discount applied before VAT, VAT grouped by rate, amounts rounded to cents.
- **Five currencies** with cached `Intl.NumberFormat` formatters.
- **Logo upload** with Ant Design `Upload`, read in the browser and never sent anywhere.
- **Status** (Draft, Sent, Paid) shown as a stamp on the invoice.
- **New invoice** keeps your company details and continues the numbering (INV-2026-0042 → 0043).
- **Live A4 preview**, **PDF export** through a print stylesheet, and **auto-save** to `localStorage`.

## Tech stack

- [React 18](https://react.dev) with function components and hooks
- [TypeScript](https://www.typescriptlang.org) in strict mode
- [Ant Design 5](https://ant.design) components and `@ant-design/icons`
- [Day.js](https://day.js.org) for dates
- [Vite](https://vitejs.dev) for development and builds

## Getting started

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/eraldashehu/invoice-generator.git
cd invoice-generator
npm install
npm run dev
```

Then open http://localhost:5173.

```bash
npm run typecheck # check types with tsc
npm run build     # type-check, then production build in dist/
npm run preview   # serve the build locally
```

## Architecture

```
src/
├── main.tsx
├── app/
│   ├── App.tsx                         # layout and mobile edit/preview switch
│   └── AppProviders.tsx                # ConfigProvider, AntApp, InvoiceProvider
├── shared/hooks/usePersistentReducer.ts
└── features/invoice/
    ├── index.ts                        # public API of the feature
    ├── model/
    │   ├── types.ts                    # InvoiceValues, LineItem, VatRate, Totals
    │   ├── defaults.ts                 # example invoice, next invoice, options
    │   └── storage.ts                  # JSON ↔ Day.js conversion for saved data
    ├── lib/totals.ts                   # pure money logic
    ├── context/InvoiceContext.tsx      # form instance + mirrored values, two contexts
    ├── hooks/useInvoice.ts             # useInvoiceForm, useInvoiceValues, useTotals
    └── components/
        ├── InvoiceToolbar.tsx
        ├── form/                       # InvoiceForm, PartyFields, LineItemsSection, LogoUpload
        └── preview/                    # PreviewPanel (deferred), InvoicePreview (memo)
```

### How data flows

1. The **Ant Design form** is the source of truth while you edit.
2. `onValuesChange` mirrors every change into a **persisted reducer** in `InvoiceProvider`, which saves to `localStorage` (debounced) and feeds the preview.
3. The preview reads the values with **`useDeferredValue`**, so typing never waits for it.
4. Each line's amount uses **`Form.useWatch`** on just that line, so typing in one row re-renders only its amount.

## React and Ant Design techniques used, and why

| Technique | Where | Why |
|---|---|---|
| `Form` + `Form.List` | `InvoiceForm.tsx`, `LineItemsSection.tsx` | Dynamic rows with validation and nested paths like `['lines', 0, 'price']` |
| `Form.useWatch` per line | `LineItemsSection.tsx` | Fine-grained updates: only the edited row's amount re-renders |
| Dependent validation | Due date rule | `dependencies={['issueDate']}` re-validates when the issue date changes |
| Custom form control | `LogoUpload.tsx` | Accepts `value` / `onChange`, so it works inside `Form.Item` like a built-in input |
| Context with two values | `InvoiceContext.tsx` | Form API (stable) separate from values (changing) |
| Custom hooks | `useInvoiceForm`, `useInvoiceValues`, `useTotals`, `usePersistentReducer` | Components stay focused on UI |
| `useMemo` | `useTotals` | Totals recalculate only when lines or discount change |
| Lazy `useState` | `InvoiceContext.tsx` | The example invoice and initial values are built once |
| `useDeferredValue` + `React.memo` | `PreviewPanel.tsx`, `InvoicePreview.tsx` | Smooth typing; preview renders only with new data |
| `useRef` | `usePersistentReducer.ts` | Debounce timer and the latest state for saving on tab close |
| Pure money functions | `lib/totals.ts` | Easy to unit test; no React needed |

## Deploy

**GitHub Pages (automatic):** this repository includes `.github/workflows/deploy.yml`. In the repository go to **Settings → Pages**, set **Source** to **GitHub Actions**, then push. The app is published at `https://eraldashehu.github.io/invoice-generator/`.

**GitLab Pages (automatic):** this repository includes `.gitlab-ci.yml`. Push it to GitLab and the live address appears under **Deploy → Pages**.

## Author

**Eralda Shehu**, Frontend Developer
[LinkedIn](https://www.linkedin.com/in/eralda-shehu/) · [GitHub](https://github.com/eraldashehu)
