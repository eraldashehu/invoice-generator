import { useState } from 'react';
import { Col, Grid, Layout, Row, Segmented, theme } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { InvoiceForm, InvoiceToolbar, PreviewPanel } from '../features/invoice';

type MobileView = 'edit' | 'preview';

export default function App() {
  const screens = Grid.useBreakpoint();
  const isDesktop = Boolean(screens.lg);
  const [view, setView] = useState<MobileView>('edit');
  const { token } = theme.useToken();

  return (
    <Layout className="app-layout">
      <Layout.Header className="app-header" style={{ background: token.colorBgContainer, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <InvoiceToolbar />
      </Layout.Header>
      <Layout.Content className="app-content">
        {!isDesktop && (
          <Segmented<MobileView>
            block
            className="mobile-switch"
            value={view}
            onChange={setView}
            options={[
              { label: 'Edit', value: 'edit', icon: <EditOutlined /> },
              { label: 'Preview', value: 'preview', icon: <EyeOutlined /> },
            ]}
          />
        )}
        <Row gutter={[24, 24]}>
          {/* The form stays mounted when hidden, so its state is kept when switching views. */}
          <Col xs={24} lg={12} className="form-col" hidden={!isDesktop && view !== 'edit'}>
            <InvoiceForm />
          </Col>
          <Col xs={24} lg={12} className="preview-col" hidden={!isDesktop && view !== 'preview'}>
            <PreviewPanel />
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}
