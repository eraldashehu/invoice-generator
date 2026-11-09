import { Card, Col, DatePicker, Flex, Form, Input, InputNumber, Row, Select, Tag } from 'antd';
import type { Dayjs } from 'dayjs';
import { useInvoiceForm } from '../../hooks/useInvoice';
import { CURRENCIES, STATUS_OPTIONS } from '../../model/defaults';
import type { InvoiceValues } from '../../model/types';
import { LineItemsSection } from './LineItemsSection';
import { LogoUpload } from './LogoUpload';
import { PartyFields } from './PartyFields';

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c, label: c }));
const STATUS_SELECT = STATUS_OPTIONS.map((s) => ({ value: s.value, label: <Tag color={s.color}>{s.label}</Tag> }));

/** The whole editor is one Ant Design Form; sections are just layout. */
export function InvoiceForm() {
  const { form, initialValues, onValuesChange } = useInvoiceForm();

  return (
    <Form<InvoiceValues>
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={onValuesChange}
      scrollToFirstError
      requiredMark={false}
    >
      <Flex vertical gap={16}>
        <Card title="Details" size="small">
          <Row gutter={12}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="number" label="Invoice number" rules={[{ required: true, message: 'Required' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="issueDate" label="Issue date" rules={[{ required: true, message: 'Required' }]}>
                <DatePicker format="D MMM YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="dueDate"
                label="Due date"
                dependencies={['issueDate']}
                rules={[
                  ({ getFieldValue }: { getFieldValue: (name: string) => unknown }) => ({
                    validator: async (_: unknown, due: Dayjs | null) => {
                      const issued = getFieldValue('issueDate') as Dayjs | null;
                      if (due && issued && due.isBefore(issued, 'day')) throw new Error('Due date is before the issue date');
                    },
                  }),
                ]}
              >
                <DatePicker format="D MMM YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Form.Item name="currency" label="Currency">
                <Select options={CURRENCY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Form.Item name="status" label="Status">
                <Select options={STATUS_SELECT} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="logo" label="Logo" style={{ marginBottom: 0 }}>
            <LogoUpload />
          </Form.Item>
        </Card>

        <Card size="small">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <PartyFields name="from" title="From" />
            </Col>
            <Col xs={24} md={12}>
              <PartyFields name="to" title="Bill to" />
            </Col>
          </Row>
        </Card>

        <LineItemsSection />

        <Card title="Payment" size="small">
          <Row gutter={12}>
            <Col xs={24} sm={8}>
              <Form.Item name="discount" label="Discount">
                <InputNumber min={0} max={100} step={0.5} addonAfter="%" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={16}>
              <Form.Item name="iban" label="IBAN">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Notes" style={{ marginBottom: 0 }}>
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
          </Form.Item>
        </Card>
      </Flex>
    </Form>
  );
}
