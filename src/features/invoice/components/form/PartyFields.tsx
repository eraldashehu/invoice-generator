import { Form, Input } from 'antd';

interface PartyFieldsProps {
  /** "from" or "to": the nested object in the form values */
  name: 'from' | 'to';
  title: string;
}

/** Fields for one party, bound to nested form paths like ['to', 'name']. */
export function PartyFields({ name, title }: PartyFieldsProps) {
  return (
    <fieldset className="party">
      <legend>{title}</legend>
      <Form.Item name={[name, 'name']} rules={[{ required: true, whitespace: true, message: 'Company name is required' }]} style={{ marginBottom: 8 }}>
        <Input placeholder="Company name" aria-label={`${title} name`} />
      </Form.Item>
      <Form.Item name={[name, 'address']} style={{ marginBottom: 8 }}>
        <Input.TextArea placeholder="Address" autoSize={{ minRows: 2, maxRows: 4 }} aria-label={`${title} address`} />
      </Form.Item>
      <Form.Item name={[name, 'email']} rules={[{ type: 'email', message: 'Enter a valid email' }]} style={{ marginBottom: 8 }}>
        <Input placeholder="Email" aria-label={`${title} email`} />
      </Form.Item>
      <Form.Item name={[name, 'vatId']} style={{ marginBottom: 0 }}>
        <Input placeholder="VAT number" aria-label={`${title} VAT number`} />
      </Form.Item>
    </fieldset>
  );
}
