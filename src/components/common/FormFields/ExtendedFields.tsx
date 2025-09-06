import React from 'react';
import { useField } from 'formik';
import {
  Input,
  InputNumber,
  DatePicker,
  Form,
  Space
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

interface BaseRangeFieldProps {
  name: string;
  label?: string;
  placeholder?: string[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Date Range Field for BETWEEN operator
export const DateRangeField: React.FC<BaseRangeFieldProps & {
  format?: string;
  showTime?: boolean;
}> = ({
        name,
        label,
        placeholder = ['Từ ngày', 'Đến ngày'],
        required,
        disabled,
        className,
        format = 'DD/MM/YYYY',
        showTime = false
      }) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  const handleChange: RangePickerProps['onChange'] = (dates) => {
    if (dates && dates[0] && dates[1]) {
      helpers.setValue([
        dates[0].toISOString(),
        dates[1].toISOString()
      ]);
    } else {
      helpers.setValue(null);
    }
  };

  // Convert value to proper tuple type for RangePicker
  const value: RangeValue = field.value && Array.isArray(field.value) && field.value.length === 2
    ? [
      field.value[0] ? dayjs(field.value[0]) : null,
      field.value[1] ? dayjs(field.value[1]) : null
    ]
    : null;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      className={className}
    >
      <RangePicker
        value={value}
        showTime={showTime}
        format={showTime ? `${format} HH:mm:ss` : format}
        placeholder={placeholder as [string, string]}
        disabled={disabled}
        onChange={handleChange}
        className="w-full"
      />
    </Form.Item>
  );
};

// Number Range Field for BETWEEN operator
export const NumberRangeField: React.FC<BaseRangeFieldProps & {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}> = ({
        name,
        label,
        placeholder = ['Từ', 'Đến'],
        required,
        disabled,
        className,
        min,
        max,
        step,
        precision
      }) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  const handleFromChange = (value: number | null) => {
    const currentValue = field.value || [null, null];
    helpers.setValue([value, currentValue[1]]);
  };

  const handleToChange = (value: number | null) => {
    const currentValue = field.value || [null, null];
    helpers.setValue([currentValue[0], value]);
  };

  const fromValue = field.value && Array.isArray(field.value) ? field.value[0] : null;
  const toValue = field.value && Array.isArray(field.value) ? field.value[1] : null;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      className={className}
    >
      <Space.Compact className="w-full">
        <InputNumber
          value={fromValue}
          placeholder={placeholder[0]}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          precision={precision}
          onChange={handleFromChange}
          className="w-1/2"
        />
        <InputNumber
          value={toValue}
          placeholder={placeholder[1]}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          precision={precision}
          onChange={handleToChange}
          className="w-1/2"
        />
      </Space.Compact>
    </Form.Item>
  );
};

// Text Range Field for BETWEEN operator
export const TextRangeField: React.FC<BaseRangeFieldProps> = ({
                                                                name,
                                                                label,
                                                                placeholder = ['Từ', 'Đến'],
                                                                required,
                                                                disabled,
                                                                className
                                                              }) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = field.value || ['', ''];
    helpers.setValue([e.target.value, currentValue[1]]);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = field.value || ['', ''];
    helpers.setValue([currentValue[0], e.target.value]);
  };

  const fromValue = field.value && Array.isArray(field.value) ? field.value[0] : '';
  const toValue = field.value && Array.isArray(field.value) ? field.value[1] : '';

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      className={className}
    >
      <Space.Compact className="w-full">
        <Input
          value={fromValue}
          placeholder={placeholder[0]}
          disabled={disabled}
          onChange={handleFromChange}
          className="w-1/2"
        />
        <Input
          value={toValue}
          placeholder={placeholder[1]}
          disabled={disabled}
          onChange={handleToChange}
          className="w-1/2"
        />
      </Space.Compact>
    </Form.Item>
  );
};

// Export all fields
export * from '../FormFields'; // Re-export existing fields
export { default as FileUploadField } from './FileUploadField';