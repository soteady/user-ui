import React from 'react';
import { useField } from 'formik';
import {
  Input,
  InputNumber,
  Select,
  DatePicker,
  Radio,
  Checkbox,
  Form
} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface BaseFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** Nếu field không bao giờ invalid thì set true để ẩn feedback */
  noValidate?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

// Text Input Field
export const TextField: React.FC<BaseFieldProps> = ({
                                                      name,
                                                      label,
                                                      placeholder,
                                                      required,
                                                      disabled,
                                                      className,
                                                      noValidate,
                                                      prefix,
                                                      suffix
                                                    }) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      hasFeedback={!noValidate}
      className={className}
    >
      <Input
        {...field}
        placeholder={placeholder}
        disabled={disabled}
        status={hasError ? 'error' : ''}
        prefix={prefix}
        suffix={suffix}
      />
    </Form.Item>
  );
};

// Password Input Field
export const PasswordField: React.FC<BaseFieldProps> = ({
                                                          name,
                                                          label,
                                                          placeholder,
                                                          required,
                                                          disabled,
                                                          className,
                                                          noValidate,
                                                          prefix,
                                                          suffix
                                                        }) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      hasFeedback={!noValidate}
      className={className}
    >
      <Input.Password
        {...field}
        placeholder={placeholder}
        disabled={disabled}
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        prefix={prefix}
        suffix={suffix}
      />
    </Form.Item>
  );
};

// Textarea Field  
export const TextAreaField: React.FC<BaseFieldProps & { rows?: number }> = ({
                                                                              name,
                                                                              label,
                                                                              placeholder,
                                                                              required,
                                                                              disabled,
                                                                              className,
                                                                              noValidate,
                                                                              prefix,
                                                                              suffix,
                                                                              rows = 4
                                                                            }) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      hasFeedback={!noValidate}
      className={className}
    >
      <TextArea
        {...field}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
      />
    </Form.Item>
  );
};

// Number Input Field
export const NumberField: React.FC<BaseFieldProps & {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}> = ({
        name,
        label,
        placeholder,
        required,
        disabled,
        className,
        noValidate,
        min,
        max,
        step,
        precision
      }) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      hasFeedback={!noValidate}
      className={className}
    >
      <InputNumber
        {...field}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        precision={precision}
        onChange={(value) => helpers.setValue(value)}
        className="w-full"
      />
    </Form.Item>
  );
};

// Date Picker Field
export const DateField: React.FC<BaseFieldProps & { format?: string }> = ({
                                                                            name,
                                                                            label,
                                                                            placeholder,
                                                                            required,
                                                                            disabled,
                                                                            className,
        noValidate,
                                                                            format = 'DD/MM/YYYY'
                                                                          }) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      hasFeedback={!noValidate}
      className={className}
    >
      <DatePicker
        value={field.value ? dayjs(field.value) : null}
        placeholder={placeholder}
        disabled={disabled}
        format={format}
        onChange={(date) => helpers.setValue(date ? date.toISOString() : '')}
        className="w-full"
      />
    </Form.Item>
  );
};

// DateTime Picker Field
export const DateTimeField: React.FC<BaseFieldProps & { format?: string }> = ({
                                                                                name,
                                                                                label,
                                                                                placeholder,
                                                                                required,
                                                                                disabled,
                                                                                className,
        noValidate,
                                                                                format = 'DD/MM/YYYY HH:mm:ss'
                                                                              }) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      hasFeedback={!noValidate}
      className={className}
    >
      <DatePicker
        showTime
        value={field.value ? dayjs(field.value) : null}
        placeholder={placeholder}
        disabled={disabled}
        format={format}
        onChange={(date) => helpers.setValue(date ? date.toISOString() : '')}
        className="w-full"
      />
    </Form.Item>
  );
};

// Select Field
interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export const SelectField: React.FC<BaseFieldProps & {
  options: SelectOption[];
  mode?: 'multiple' | 'tags';
  allowClear?: boolean;
  showSearch?: boolean;
  onChange?: (value: any) => void; // <-- thêm prop này
}> = ({
        name,
        label,
        placeholder,
        required,
        disabled,
        className,
        noValidate,
        options,
        mode,
        allowClear = true,
        showSearch = true,
        onChange
      }) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={noValidate ? undefined : hasError ? 'error' : ''}
      help={noValidate ? undefined : hasError ? meta.error : ''}
      hasFeedback={!noValidate}
      className={className}
    >
      <Select
        {...field}
        placeholder={placeholder}
        disabled={disabled}
        mode={mode}
        allowClear={allowClear}
        showSearch={showSearch}
        value={field.value} // đảm bảo controlled
        onChange={(value) => {
          helpers.setValue(value);
          onChange?.(value); // gọi onChange custom nếu có
        }}
        className="w-full"
        filterOption={(input, option) => {
          const label = option?.label || option?.children;
          if (typeof label === 'string') {
            return label.toLowerCase().includes(input.toLowerCase());
          }
          return false;
        }}
      >
        {options.map((option) => (
          <Select.Option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

// Radio Group Field
export const RadioGroupField: React.FC<BaseFieldProps & {
  options: SelectOption[];
  direction?: 'horizontal' | 'vertical';
}> = ({
        name,
        label,
        required,
        disabled,
        className,
        noValidate,
        options,
        direction = 'horizontal'
      }) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      hasFeedback={!noValidate}
      className={className}
    >
      <Radio.Group
        {...field}
        disabled={disabled}
        className={direction === 'vertical' ? 'flex flex-col gap-2' : ''}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

// Checkbox Group Field
export const CheckboxGroupField: React.FC<BaseFieldProps & {
  options: SelectOption[];
  direction?: 'horizontal' | 'vertical';
}> = ({
        name,
        label,
        required,
        disabled,
        className,
        noValidate,
        options,
        direction = 'horizontal'
      }) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      hasFeedback={!noValidate}
      className={className}
    >
      <Checkbox.Group
        value={field.value || []}
        onChange={(value) => helpers.setValue(value)}
        disabled={disabled}
        className={direction === 'vertical' ? 'flex flex-col gap-2' : ''}
      >
        {options.map((option) => (
          <Checkbox
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Form.Item>
  );
};

// Single Checkbox Field
export const CheckboxField: React.FC<BaseFieldProps & {
  text: string;
}> = ({
        name,
        label,
        required,
        disabled,
        className,
        noValidate,
        text
      }) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      hasFeedback={!noValidate}
      className={className}
    >
      <Checkbox
        checked={field.value}
        onChange={(e) => helpers.setValue(e.target.checked)}
        disabled={disabled}
      >
        {text}
      </Checkbox>
    </Form.Item>
  );
};