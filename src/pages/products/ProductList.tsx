import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BaseList, { ColumnConfig, SearchFieldConfig, ActionConfig } from '../../components/common/BaseList';
import { SearchParams } from '../../utils/types/common';
import { Product, getProducts, deleteProduct } from '../../services/products/productService';
import { showMessage } from '../../utils/helpers/message';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
    total: 0,
  });

  const columns: ColumnConfig[] = [
    {
      key: 'name',
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      sortable: true,
    },
    {
      key: 'category',
      title: 'Danh mục',
      dataIndex: 'category',
      sortable: true,
    },
    {
      key: 'price',
      title: 'Giá',
      dataIndex: 'price',
      type: 'currency',
      sortable: true,
    },
    {
      key: 'stock',
      title: 'Tồn kho',
      dataIndex: 'stock',
      type: 'number',
      sortable: true,
    },
    {
      key: 'status',
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded text-xs ${
          status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      type: 'datetime',
      sortable: true,
    },
  ];

  const searchFields: SearchFieldConfig[] = [
    {
      field: 'name',
      label: 'Tên sản phẩm',
      type: 'text',
      operators: ['eq', 'like', 'notlike'],
      placeholder: 'Nhập tên sản phẩm',
    },
    {
      field: 'category',
      label: 'Danh mục',
      type: 'select',
      operators: ['eq', 'ne', 'in'],
      options: [
        { value: 'laptop', label: 'Laptop' },
        { value: 'phone', label: 'Điện thoại' },
        { value: 'tablet', label: 'Máy tính bảng' },
        { value: 'accessories', label: 'Phụ kiện' },
      ],
    },
    {
      field: 'price',
      label: 'Giá',
      type: 'number',
      operators: ['eq', 'gt', 'gte', 'lt', 'lte', 'between'],
      placeholder: 'Nhập giá sản phẩm',
    },
    {
      field: 'status',
      label: 'Trạng thái',
      type: 'select',
      operators: ['eq', 'ne'],
      options: [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
      ],
      required: true,
    },
    {
      field: 'createdAt',
      label: 'Ngày tạo',
      type: 'date',
      operators: ['eq', 'gt', 'gte', 'lt', 'lte', 'between'],
    },
  ];

  const actions: ActionConfig[] = [
    {
      key: 'edit',
      label: 'Cập nhật',
      icon: <EditOutlined />,
      type: 'text',
      onClick: (record: Product) => {
        navigate(`/products/edit/${record.id}`);
      },
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      type: 'text',
      danger: true,
      onClick: async (record: Product) => {
        try {
          await deleteProduct(record.id);
          showMessage.success('Xóa sản phẩm thành công');
          fetchProducts({
            page: pagination.current,
            pageSize: pagination.pageSize,
            filters: []
          });
        } catch (error) {
          // Error message is handled in the service
        }
      },
    },
  ];

  const fetchProducts = async (params: SearchParams) => {
    setLoading(true);
    try {
      const response = await getProducts(params);
      setProducts(response.data);
      setPagination({
        current: response.page,
        pageSize: response.pageSize,
        total: response.total,
      });
    } catch (error) {
      showMessage.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params: SearchParams) => {
    fetchProducts(params);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchProducts({
      page,
      pageSize,
      filters: []
    });
  };

  const handleCreateNew = () => {
    navigate('/products/create');
  };

  useEffect(() => {
    fetchProducts({
      page: 0,
      pageSize: 10,
      filters: []
    });
  }, []);

  return (
    <BaseList<Product>
      title="Danh sách sản phẩm"
      data={products}
      columns={columns}
      searchFields={searchFields}
      actions={actions}
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      createButton={{
        text: 'Thêm sản phẩm',
        onClick: handleCreateNew,
      }}
    />
  );
};

export default ProductList;