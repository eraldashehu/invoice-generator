import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Tooltip, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { VAT_RATES, emptyLine } from '../../model/defaults';
import { formatMoney, lineAmount } from '../../lib/totals';
import type { Currency, LineItem } from '../../model/types';

/** Watches only its own line, so typing in one row re-renders just this amount. */
function LineAmount({ index }: { index: number }) {
  const form = Form.useFormInstance();
  const line = Form.useWatch<LineItem | undefined>(['lines', index], form);
  const currency = Form.useWatch<Currency | undefined>('currency', form) ?? 'EUR';
  return <Typography.Text className="line-amount">{formatMoney(lineAmount(line), currency)}</Typography.Text>;
}

const VAT_OPTIONS = VAT_RATES.map((r) => ({ value: r, label: `${r}%` }));

export function LineItemsSection() {
  return (
    <Card title="Line items" size="small">
      <Row gutter={8} className="lines-head" aria-hidden="true">
        <Col flex="auto">Description</Col>
        <Col className="col-qty">Qty</Col>
        <Col className="col-price">Unit price</Col>
        <Col className="col-vat">VAT</Col>
        <Col className="col-amount">Amount</Col>
        <Col className="col-remove" />
      </Row>

      <Form.List name="lines" rules={[{ validator: async (_: unknown, lines?: LineItem[]) => (lines?.length ? undefined : Promise.reject(new Error('Add at least one line'))) }]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }, i) => (
              <Row gutter={8} key={key} align="top" className="line-row">
                <Col flex="auto" className="col-desc">
                  <Form.Item name={[name, 'description']} rules={[{ required: true, whitespace: true, message: 'Describe the item' }]} style={{ marginBottom: 8 }}>
                    <Input placeholder="Service or product" aria-label={`Item ${i + 1} description`} />
                  </Form.Item>
                </Col>
                <Col className="col-qty">
                  <Form.Item name={[name, 'qty']} rules={[{ required: true, message: 'Qty' }]} style={{ marginBottom: 8 }}>
                    <InputNumber min={0} step={1} style={{ width: '100%' }} aria-label={`Item ${i + 1} quantity`} />
                  </Form.Item>
                </Col>
                <Col className="col-price">
                  <Form.Item name={[name, 'price']} rules={[{ required: true, message: 'Price' }]} style={{ marginBottom: 8 }}>
                    <InputNumber min={0} step={0.01} precision={2} style={{ width: '100%' }} aria-label={`Item ${i + 1} unit price`} />
                  </Form.Item>
                </Col>
                <Col className="col-vat">
                  <Form.Item name={[name, 'vat']} style={{ marginBottom: 8 }}>
                    <Select options={VAT_OPTIONS} aria-label={`Item ${i + 1} VAT rate`} />
                  </Form.Item>
                </Col>
                <Col className="col-amount">
                  <LineAmount index={name} />
                </Col>
                <Col className="col-remove">
                  <Tooltip title="Remove line">
                    <Button type="text" danger icon={<DeleteOutlined />} disabled={fields.length === 1} onClick={() => remove(name)} aria-label={`Remove item ${i + 1}`} />
                  </Tooltip>
                </Col>
              </Row>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => add(emptyLine())} block>
              Add line item
            </Button>
          </>
        )}
      </Form.List>
    </Card>
  );
}
