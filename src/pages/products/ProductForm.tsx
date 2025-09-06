import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import BaseForm, { FormFieldConfig } from '../../components/common/BaseForm';
import { Product, createProduct, updateProduct, getProduct } from '../../services/products/productService';
import { showMessage } from '../../utils/helpers/message';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const isEdit = Boolean(id && id !== 'create');
  const title = isEdit ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới';

  const formFields: FormFieldConfig[] = [
    {
      name: 'name',
      type: 'text',
      label: 'Tên sản phẩm',
      placeholder: 'Nhập tên sản phẩm',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Danh mục',
      placeholder: 'Chọn danh mục',
      required: true,
      options: [
        { value: 'laptop', label: 'Laptop' },
        { value: 'phone', label: 'Điện thoại' },
        { value: 'tablet', label: 'Máy tính bảng' },
        { value: 'accessories', label: 'Phụ kiện' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      label: 'Giá (VND)',
      placeholder: 'Nhập giá sản phẩm',
      required: true,
      min: 0,
      step: 1000,
    },
    {
      name: 'stock',
      type: 'number',
      label: 'Số lượng tồn kho',
      placeholder: 'Nhập số lượng',
      required: true,
      min: 0,
    },
    {
      name: 'status',
      type: 'radio',
      label: 'Trạng thái',
      required: true,
      options: [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
      ],
      className: 'col-span-2',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      placeholder: 'Nhập mô tả sản phẩm',
      rows: 4,
      className: 'col-span-2',
    },
  ];

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự')
      .required('Tên sản phẩm là bắt buộc'),
    category: Yup.string().required('Danh mục là bắt buộc'),
    price: Yup.number()
      .min(0, 'Giá không được âm')
      .required('Giá là bắt buộc'),
    stock: Yup.number()
      .min(0, 'Số lượng không được âm')
      .required('Số lượng là bắt buộc'),
    status: Yup.string().required('Trạng thái là bắt buộc'),
    description: Yup.string(),
  });

  const fetchProduct = async () => {
    if (!isEdit || !id) return;

    setFetchLoading(true);
    try {
      const product = await getProduct(id);
      setInitialValues(product);
    } catch (error) {
      showMessage.error('Không thể tải thông tin sản phẩm');
      navigate('/products');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateProduct(id, values);
        showMessage.success('Cập nhật sản phẩm thành công');
      } else {
        await createProduct(values);
        showMessage.success('Tạo sản phẩm thành công');
      }
      navigate('/products');
    } catch (error) {
      // Error message is handled in the service
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id, isEdit]);

  if (fetchLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <BaseForm
      title={title}
      fields={formFields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      submitButtonText={isEdit ? 'Cập nhật' : 'Tạo mới'}
      cancelPath="/products"
      loading={loading}
    />
  );
};

export default ProductForm;