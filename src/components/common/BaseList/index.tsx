import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Row,
  Col,
  Pagination,
  Tooltip,
  Form
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  NumberField,
  DateField,
  DateTimeField,
  SelectField,
  DateRangeField,
  NumberRangeField,
  TextRangeField
} from '../FormFields/ExtendedFields';
import { SearchParams, SearchFilter, SearchOperator } from '../../../utils/types/common';
import { SEARCH_OPERATORS } from '../../../utils/constants';
import { formatDate, formatDateTime, formatBoolean, formatNumber } from '../../../utils/helpers/format';
import { showConfirm } from '../../../utils/helpers/message';

export interface SearchFieldConfig {
  field: string;
  label: string;
  type: 'text' | 'date' | 'datetime' | 'select' | 'number';
  required?: boolean;
  operators?: SearchOperator[];
  options?: { value: any; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface ColumnConfig {
  key: string;
  title: string;
  dataIndex: string;
  type?: 'text' | 'date' | 'datetime' | 'boolean' | 'number' | 'currency';
  sortable?: boolean;
  width?: number;
  render?: (value: any, record: any) => React.ReactNode;
}

export interface ActionConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  type?: 'default' | 'primary' | 'dashed' | 'text' | 'link';
  danger?: boolean;
  onClick: (record: any) => void;
  visible?: (record: any) => boolean;
}

export interface BaseListProps<T = any> {
  title?: string;
  data: T[];
  columns: ColumnConfig[];
  searchFields?: SearchFieldConfig[];
  actions?: ActionConfig[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: string[];
  };
  onSearch: (params: SearchParams) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  createButton?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
  cardClassName?: string;
}

interface SearchFormValues {
  [key: string]: any;
}

const BaseList = <T extends Record<string, any>>({
                                                   title,
                                                   data,
                                                   columns,
                                                   searchFields = [],
                                                   actions = [],
                                                   loading = false,
                                                   pagination,
                                                   onSearch,
                                                   onPageChange,
                                                   createButton,
                                                   className = '',
                                                   cardClassName = ''
                                                 }: BaseListProps<T>) => {
  const [sortField, setSortField] = useState<string>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>();
  const [hasSearched, setHasSearched] = useState(false);
  const [currentSearchValues, setCurrentSearchValues] = useState<SearchFormValues>({})

  // Check if there's any required field
  const hasRequiredFields = useMemo(
    () => searchFields.some(field => field.required),
    [searchFields]
  );

  // Create initial values for search form
  const initialValues = useMemo(() => {
    const values: SearchFormValues = {};
    searchFields.forEach(field => {
      values[`${field.field}_operator`] = field.operators?.[0] || 'eq';
      values[`${field.field}_value`] = field.type === 'select' && field.options?.length
        ? undefined
        : '';
    });
    return values;
  }, [searchFields]);

  // Create validation schema
  const validationSchema = useMemo(() => {
    const schemaFields: any = {};

    searchFields.forEach(field => {
      const operatorKey = `${field.field}_operator`;
      const valueKey = `${field.field}_value`;

      // Operator is always required
      schemaFields[operatorKey] = Yup.string().required('Vui lòng chọn toán tử');

      // Value validation based on field configuration
      if (field.required) {
        let valueSchema: any;

        switch (field.type) {
          case 'number':
            valueSchema = Yup.mixed().when(operatorKey, {
              is: 'between',
              then: () => Yup.array()
                .of(Yup.number().typeError('Vui lòng nhập số hợp lệ'))
                .min(2, 'Cần nhập cả giá trị từ và đến')
                .test('both-values', 'Cần nhập cả giá trị từ và đến',
                  (value) => value && value[0] !== null && value[1] !== null)
                .required(`${field.label} là bắt buộc`),
              otherwise: () => Yup.number()
                .typeError('Vui lòng nhập số hợp lệ')
                .required(`${field.label} là bắt buộc`)
                .min(field.min || -Infinity, `Giá trị tối thiểu là ${field.min}`)
                .max(field.max || Infinity, `Giá trị tối đa là ${field.max}`)
            });
            break;

          case 'date':
          case 'datetime':
            valueSchema = Yup.mixed().when(operatorKey, {
              is: 'between',
              then: () => Yup.array()
                .of(Yup.string())
                .min(2, 'Cần chọn cả ngày bắt đầu và kết thúc')
                .test('both-dates', 'Cần chọn cả ngày bắt đầu và kết thúc',
                  (value) => !!value && !!value[0] && !!value[1])
                .required(`${field.label} là bắt buộc`),
              otherwise: () => Yup.string()
                .required(`${field.label} là bắt buộc`)
            });
            break;

          case 'select':
            valueSchema = Yup.mixed().when(operatorKey, {
              is: (val: string) => ['in', 'notin'].includes(val),
              then: () => Yup.array()
                .min(1, `Vui lòng chọn ít nhất một ${field.label}`)
                .required(`${field.label} là bắt buộc`),
              otherwise: () => Yup.mixed()
                .required(`Vui lòng chọn ${field.label}`)
            });
            break;

          default:
            valueSchema = Yup.mixed().when(operatorKey, {
              is: 'between',
              then: () => Yup.array()
                .of(Yup.string().trim())
                .min(2, 'Cần nhập cả giá trị từ và đến')
                .test('both-text', 'Cần nhập cả giá trị từ và đến',
                  (value) => !!value && !!value[0] && !!value[1])
                .required(`${field.label} là bắt buộc`),
              otherwise: () => Yup.string()
                .trim()
                .required(`${field.label} là bắt buộc`)
            });
        }

        schemaFields[valueKey] = valueSchema;
      }
    });

    return Yup.object().shape(schemaFields);
  }, [searchFields]);

  // Load data on mount only if no required fields
  useEffect(() => {
    if (!hasRequiredFields && !hasSearched) {
      handleSearchSubmit(initialValues);
    }
  }, []);

  // Re-search when sort changes
  useEffect(() => {
    if (hasSearched && (sortField !== undefined || sortOrder !== undefined)) {
      // Re-search with current form values and new sort
      const filters = buildSearchFilters(currentSearchValues);
      const params: SearchParams = {
        page: 0,
        pageSize: pagination?.pageSize || 10,
        filters,
        sortField,
        sortDirection: sortOrder,
      };
      onSearch(params);
    }
  }, [sortField, sortOrder]);

  // Build search filters from form values
  const buildSearchFilters = (values: SearchFormValues): SearchFilter[] => {
    const filters: SearchFilter[] = [];

    searchFields.forEach(field => {
      const operatorKey = `${field.field}_operator`;
      const valueKey = `${field.field}_value`;

      const operator = values[operatorKey];
      const value = values[valueKey];

      if (operator && value !== undefined && value !== '' && value !== null) {
        filters.push({
          field: field.field,
          operator,
          value,
          required: field.required,
        });
      }
    });

    return filters;
  };

  const handleSearchSubmit = (values: SearchFormValues) => {
    // Save current search values for re-use when sorting
    setCurrentSearchValues(values);

    const filters = buildSearchFilters(values);
    const params: SearchParams = {
      page: 0,
      pageSize: pagination?.pageSize || 10,
      filters,
      sortField,
      sortDirection: sortOrder,
    };

    setHasSearched(true);
    onSearch(params);
  };

  const handleTableChange = (paginationInfo: any, filters: any, sorter: any) => {
    // Update sort state, useEffect will trigger re-search
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    } else {
      setSortField(undefined);
      setSortOrder(undefined);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    onPageChange?.(page - 1, pageSize);
  };

  // Convert column config to Antd columns
  const tableColumns: ColumnsType<T> = [
    ...columns.map(col => ({
      key: col.key,
      title: col.title,
      dataIndex: col.dataIndex,
      width: col.width,
      sorter: col.sortable,
      render: col.render || ((value: any) => {
        switch (col.type) {
          case 'date':
            return formatDate(value);
          case 'datetime':
            return formatDateTime(value);
          case 'boolean':
            return formatBoolean(value);
          case 'number':
            return formatNumber(value);
          case 'currency':
            return formatNumber(value) + ' VND';
          default:
            return value;
        }
      }),
    })),
    ...(actions.length > 0 ? [{
      key: 'actions',
      title: 'Thao tác',
      width: 120 + actions.length * 40,
      render: (record: T) => (
        <Space>
          {actions
            .filter(action => !action.visible || action.visible(record))
            .map(action => (
              <Tooltip key={action.key} title={action.label}>
                <Button
                  type={action.type || 'text'}
                  danger={action.danger}
                  icon={action.icon}
                  size="small"
                  onClick={() => {
                    if (action.danger) {
                      showConfirm(
                        'Xác nhận',
                        `Bạn có chắc chắn muốn ${action.label.toLowerCase()}?`,
                        () => action.onClick(record)
                      );
                    } else {
                      action.onClick(record);
                    }
                  }}
                />
              </Tooltip>
            ))}
        </Space>
      ),
    }] : []),
  ];

  // Render search field based on type
  const renderSearchField = (
    field: SearchFieldConfig,
    formik: FormikProps<SearchFormValues>
  ) => {
    const valueFieldName = `${field.field}_value`;
    const operatorFieldName = `${field.field}_operator`;
    const selectedOperator = formik.values[operatorFieldName];

    // Get available operators for this field
    const availableOperators = (field.operators || ['eq', 'ne', 'like', 'notlike'])
      .map(op => {
        const operatorOption = SEARCH_OPERATORS.find(o => o.value === op);
        return {
          value: op,
          label: operatorOption?.label || op
        };
      });

    return (
      <div className="space-y-2">
        <SelectField
          name={operatorFieldName}
          label={field.label}
          placeholder="Chọn toán tử"
          required={field.required}
          options={availableOperators}
          allowClear={false}
          showSearch={false}
          onChange={(val: string) => {
            // Gán lại operator
            formik.setFieldValue(operatorFieldName, val);

            // Clear value mỗi khi đổi operator
            formik.setFieldValue(valueFieldName, '');
          }}
          noValidate={true}
          className={'mb-0'}
        />

        {selectedOperator &&
          renderValueField(field, valueFieldName, selectedOperator)}
      </div>
    );
  };

  // Render value field based on type and operator
  const renderValueField = (
    field: SearchFieldConfig,
    fieldName: string,
    operator: string
  ) => {
    // Handle special operators
    if (operator === 'between') {
      // For between operator, use range components
      switch (field.type) {
        case 'date':
          return (
            <DateRangeField
              name={fieldName}
              placeholder={['Từ ngày', 'Đến ngày']}
              required={field.required}
              showTime={false}
            />
          );

        case 'datetime':
          return (
            <DateRangeField
              name={fieldName}
              placeholder={['Từ', 'Đến']}
              required={field.required}
              showTime={true}
            />
          );

        case 'number':
          return (
            <NumberRangeField
              name={fieldName}
              placeholder={['Từ', 'Đến']}
              required={field.required}
              min={field.min}
              max={field.max}
              step={field.step}
            />
          );

        default:
          return (
            <TextRangeField
              name={fieldName}
              placeholder={['Từ', 'Đến']}
              required={field.required}
            />
          );
      }
    }

    if (['in', 'notin'].includes(operator)) {
      // For IN/NOT IN operators, use multi-select
      if (field.type === 'select' && field.options) {
        return (
          <SelectField
            name={fieldName}
            placeholder={field.placeholder || `Chọn ${field.label}`}
            required={field.required}
            options={field.options}
            mode="multiple"
          />
        );
      }
      return (
        <SelectField
          name={fieldName}
          placeholder={`Nhập ${field.label} (Enter để thêm)`}
          required={field.required}
          options={[]}
          mode="tags"
        />
      );
    }

    // Regular single value fields
    switch (field.type) {
      case 'text':
        return (
          <TextField
            name={fieldName}
            placeholder={field.placeholder || `Nhập ${field.label}`}
            required={field.required}
          />
        );

      case 'number':
        return (
          <NumberField
            name={fieldName}
            placeholder={field.placeholder || `Nhập ${field.label}`}
            required={field.required}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'date':
        return (
          <DateField
            name={fieldName}
            placeholder={field.placeholder || `Chọn ${field.label}`}
            required={field.required}
          />
        );

      case 'datetime':
        return (
          <DateTimeField
            name={fieldName}
            placeholder={field.placeholder || `Chọn ${field.label}`}
            required={field.required}
          />
        );

      case 'select':
        return (
          <SelectField
            name={fieldName}
            placeholder={field.placeholder || `Chọn ${field.label}`}
            required={field.required}
            options={field.options || []}
          />
        );

      default:
        return (
          <TextField
            name={fieldName}
            placeholder={field.placeholder || `Nhập ${field.label}`}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className={`base-list ${className}`}>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        {title && (
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        )}
        {createButton && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={createButton.onClick}
          >
            {createButton.text}
          </Button>
        )}
      </div>

      <Card className={cardClassName}>
        {/* Search Form with Formik */}
        {searchFields.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSearchSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {(formik) => (
                <Form layout="vertical" onFinish={formik.handleSubmit}>
                  <Row gutter={[16, 16]}>
                    {searchFields.map(field => (
                      <Col key={field.field} xs={24} sm={12} lg={8}>
                        {renderSearchField(field, formik)}
                      </Col>
                    ))}
                  </Row>

                  <div className="mt-4 text-right">
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      htmlType="submit"
                      loading={loading}
                    >
                      Tìm kiếm
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* Show message if required fields not filled */}
        {hasRequiredFields && !hasSearched && (
          <div className="text-center py-8 text-gray-500">
            Vui lòng nhập thông tin tìm kiếm để xem dữ liệu
          </div>
        )}

        {/* Data Table */}
        {(!hasRequiredFields || hasSearched) && (
          <>
            <Table<T>
              columns={tableColumns}
              dataSource={data}
              loading={loading}
              pagination={false}
              onChange={handleTableChange}
              rowKey="id"
              scroll={{ x: 'max-content' }}
            />

            {/* Pagination */}
            {pagination && (
              <div className="mt-4 text-right">
                <Pagination
                  current={pagination.current + 1}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  showSizeChanger={pagination.showSizeChanger}
                  pageSizeOptions={pagination.pageSizeOptions}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} bản ghi`
                  }
                  onChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default BaseList;