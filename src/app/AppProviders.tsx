import { App as AntApp, ConfigProvider } from 'antd';
import enGB from 'antd/locale/en_GB';
import type { ReactNode } from 'react';
import { InvoiceProvider } from '../features/invoice';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={enGB}>
      <AntApp>
        <InvoiceProvider>{children}</InvoiceProvider>
      </AntApp>
    </ConfigProvider>
  );
}
