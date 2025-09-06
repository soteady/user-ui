import React from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { Card, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
  TextField,
  PasswordField,
  TextAreaField,
  NumberField,
  DateField,
  DateTimeField,
  SelectField,
  RadioGroupField,
  CheckboxGroupField,
  CheckboxField
} from '../FormFields';
import { showMessage } from '../../../utils/helpers/message';

export interface FormFieldConfig {
  name: string;
  type: 'text' | 'password' | 'textarea' | 'number' | 'date' | 'datetime' | 'select' | 'radio' | 'checkbox' | 'checkboxGroup' | 'custom';
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: Yup.Schema;
  prefix?: React.ReactNode; // for input prefix icon
  suffix?: React.ReactNode; // for input suffix icon
  // Custom component props
  customComponent?: React.ComponentType<any>; // for custom type
  customProps?: Record<string, any>; // for custom type
  // Specific props for different field types
  options?: { value: any; label: string; disabled?: boolean }[]; // for select, radio, checkboxGroup
  text?: string; // for single checkbox
  rows?: number; // for textarea
  min?: number; // for number
  max?: number; // for number
  step?: number; // for number
  precision?: number; // for number
  format?: string; // for date/datetime
  mode?: 'multiple' | 'tags'; // for select
  allowClear?: boolean; // for select
  showSearch?: boolean; // for select
  direction?: 'horizontal' | 'vertical'; // for radio, checkboxGroup
}

export interface BaseFormProps {
  title?: string;
  fields: FormFieldConfig[];
  initialValues?: Record<string, any>;
  validationSchema?: Yup.ObjectSchema<any>;
  onSubmit: (values: any) => Promise<void> | void;
  submitButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  cancelPath?: string;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
  cardClassName?: string;
  submitButtonClassName?: string;
}

const BaseForm: React.FC<BaseFormProps> = ({
                                             title,
                                             fields,
                                             initialValues = {},
                                             validationSchema,
                                             onSubmit,
                                             submitButtonText = 'Lưu',
                                             cancelButtonText = 'Hủy',
                                             showCancelButton = true,
                                             cancelPath,
                                             onCancel,
                                             loading = false,
                                             className = '',
                                             cardClassName = '',
                                             submitButtonClassName = ''
                                           }) => {
  const navigate = useNavigate();

  // Generate initial values from fields if not provided
  const getInitialValues = () => {
    const defaultValues: Record<string, any> = {};
    fields.forEach(field => {
      if (initialValues[field.name] !== undefined) {
        defaultValues[field.name] = initialValues[field.name];
      } else {
        // Set default values based on field type
        switch (field.type) {
          case 'checkbox':
            defaultValues[field.name] = false;
            break;
          case 'checkboxGroup':
          case 'select':
            defaultValues[field.name] = field.mode === 'multiple' ? [] : '';
            break;
          case 'number':
            defaultValues[field.name] = null;
            break;
          case 'custom':
            defaultValues[field.name] = null;
            break;
          default:
            defaultValues[field.name] = '';
        }
      }
    });
    return defaultValues;
  };

  // Generate validation schema from fields if not provided
  const getValidationSchema = () => {
    if (validationSchema) return validationSchema;

    const schemaFields: Record<string, Yup.Schema> = {};
    fields.forEach(field => {
      if (field.validation) {
        schemaFields[field.name] = field.validation;
      } else if (field.required) {
        // Default required validation based on field type
        switch (field.type) {
          case 'text':
          case 'password':
          case 'textarea':
            schemaFields[field.name] = Yup.string().required(`${field.label || field.name} là bắt buộc`);
            break;
          case 'number':
            schemaFields[field.name] = Yup.number().required(`${field.label || field.name} là bắt buộc`);
            break;
          case 'date':
          case 'datetime':
            schemaFields[field.name] = Yup.string().required(`${field.label || field.name} là bắt buộc`);
            break;
          case 'select':
            schemaFields[field.name] = field.mode === 'multiple'
              ? Yup.array().min(1, `${field.label || field.name} là bắt buộc`)
              : Yup.string().required(`${field.label || field.name} là bắt buộc`);
            break;
          case 'radio':
            schemaFields[field.name] = Yup.string().required(`${field.label || field.name} là bắt buộc`);
            break;
          case 'checkboxGroup':
            schemaFields[field.name] = Yup.array().min(1, `${field.label || field.name} là bắt buộc`);
            break;
          case 'checkbox':
            schemaFields[field.name] = Yup.boolean().oneOf([true], `${field.label || field.name} là bắt buộc`);
            break;
          case 'custom':
            // For custom fields, use mixed type with required validation
            schemaFields[field.name] = Yup.mixed().required(`${field.label || field.name} là bắt buộc`);
            break;
        }
      }
    });

    return Yup.object().shape(schemaFields);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (cancelPath) {
      navigate(cancelPath);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      showMessage.success('Lưu thành công!');
    } catch (error: any) {
      showMessage.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  const renderField = (field: FormFieldConfig) => {
    const commonProps = {
      name: field.name,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      disabled: field.disabled,
      className: field.className,
      prefix: field.prefix,
      suffix: field.suffix,
    };

    switch (field.type) {
      case 'text':
        return <TextField key={field.name} {...commonProps} />;

      case 'password':
        return <PasswordField key={field.name} {...commonProps} />;

      case 'textarea':
        return (
          <TextAreaField
            key={field.name}
            {...commonProps}
            rows={field.rows}
          />
        );

      case 'number':
        return (
          <NumberField
            key={field.name}
            {...commonProps}
            min={field.min}
            max={field.max}
            step={field.step}
            precision={field.precision}
          />
        );

      case 'date':
        return (
          <DateField
            key={field.name}
            {...commonProps}
            format={field.format}
          />
        );

      case 'datetime':
        return (
          <DateTimeField
            key={field.name}
            {...commonProps}
            format={field.format}
          />
        );

      case 'select':
        return (
          <SelectField
            key={field.name}
            {...commonProps}
            options={field.options || []}
            mode={field.mode}
            allowClear={field.allowClear}
            showSearch={field.showSearch}
          />
        );

      case 'radio':
        return (
          <RadioGroupField
            key={field.name}
            {...commonProps}
            options={field.options || []}
            direction={field.direction}
          />
        );

      case 'checkboxGroup':
        return (
          <CheckboxGroupField
            key={field.name}
            {...commonProps}
            options={field.options || []}
            direction={field.direction}
          />
        );

      case 'checkbox':
        return (
          <CheckboxField
            key={field.name}
            {...commonProps}
            text={field.text || field.label || ''}
          />
        );

      case 'custom':
        if (field.customComponent) {
          const CustomComponent = field.customComponent;
          return (
            <CustomComponent
              key={field.name}
              {...commonProps}
              {...(field.customProps || {})}
            />
          );
        }
        return <TextField key={field.name} {...commonProps} />;

      default:
        return <TextField key={field.name} {...commonProps} />;
    }
  };

  return (
    <div className={`base-form ${className}`}>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        </div>
      )}

      <Card className={cardClassName}>
        <Formik
          initialValues={getInitialValues()}
          validationSchema={getValidationSchema()}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <FormikForm>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {fields.map(renderField)}
              </div>

              <div className={`mt-4 sm:mt-6 ${showCancelButton ? 'flex justify-end' : 'flex justify-center'}`}>
                <Space size="small">
                  {showCancelButton && (
                    <Button
                      onClick={handleCancel}
                      disabled={isSubmitting || loading}
                      size="small"
                      className="sm:h-8"
                    >
                      {cancelButtonText}
                    </Button>
                  )}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting || loading}
                    className={submitButtonClassName}
                  >
                    {submitButtonText}
                  </Button>
                </Space>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default BaseForm;