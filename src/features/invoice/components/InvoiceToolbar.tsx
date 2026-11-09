import { App, Button, Flex, Popconfirm, Space, Typography, theme } from 'antd';
import { EuroOutlined, FileAddOutlined, FilePdfOutlined, ReloadOutlined } from '@ant-design/icons';
import { useInvoiceForm, useInvoiceValues, useTotals } from '../hooks/useInvoice';
import { formatMoney } from '../lib/totals';

export function InvoiceToolbar() {
  const { form, loadExample, startNext } = useInvoiceForm();
  const values = useInvoiceValues();
  const { total } = useTotals(values);
  const { message } = App.useApp();
  const { token } = theme.useToken();

  // Validate before printing, so no invoice goes out with missing required fields.
  const handleDownload = async () => {
    try {
      await form.validateFields();
      window.print();
    } catch {
      message.error('Please fix the highlighted fields first.');
    }
  };

  return (
    <Flex align="center" justify="space-between" wrap gap={12}>
      <Flex align="center" gap={12}>
        <span className="logo" style={{ background: token.colorPrimary }} aria-hidden="true">
          <EuroOutlined />
        </span>
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Invoicely
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
            {values.number} · {formatMoney(total, values.currency)}
          </Typography.Text>
        </div>
      </Flex>
      <Space wrap>
        <Button
          icon={<FileAddOutlined />}
          onClick={() => {
            startNext();
            message.success('New invoice started. Your company details were kept.');
          }}
        >
          New invoice
        </Button>
        <Popconfirm title="Replace the current invoice with the example?" okText="Load example" onConfirm={loadExample}>
          <Button icon={<ReloadOutlined />}>Load example</Button>
        </Popconfirm>
        <Button type="primary" icon={<FilePdfOutlined />} onClick={handleDownload}>
          Download PDF
        </Button>
      </Space>
    </Flex>
  );
}
