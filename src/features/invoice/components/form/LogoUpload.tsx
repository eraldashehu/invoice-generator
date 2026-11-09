import { App, Button, Flex, Upload } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';

const MAX_BYTES = 500_000;

interface LogoUploadProps {
  /** Injected by <Form.Item name="logo">: custom controls receive value and onChange. */
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * A custom form control: Form.Item passes `value` and `onChange`,
 * so it works with validation and getFieldsValue like any built-in input.
 * The image is read in the browser with FileReader and never uploaded.
 */
export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const { message } = App.useApp();

  const beforeUpload = (file: File) => {
    if (file.size > MAX_BYTES) {
      message.error('Please choose an image under 500 KB.');
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = () => onChange?.(String(reader.result));
    reader.readAsDataURL(file);
    return false; // stop Ant Design from sending the file anywhere
  };

  return (
    <Flex align="center" gap={12} wrap>
      {value && <img src={value} alt="Logo preview" className="logo-thumb" />}
      <Upload accept="image/png,image/jpeg,image/svg+xml" showUploadList={false} beforeUpload={beforeUpload} maxCount={1}>
        <Button icon={<UploadOutlined />}>{value ? 'Change logo' : 'Upload logo'}</Button>
      </Upload>
      {value && (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onChange?.('')}>
          Remove
        </Button>
      )}
    </Flex>
  );
}
