import { createApiRequest } from '../../config/axios';
import { ApiResponse, PaginatedResponse, SearchParams } from '@/utils/types/common';

const api = createApiRequest();

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {}

// TODO: Implement API calls
export const getProducts = async (params: SearchParams): Promise<PaginatedResponse<Product>> => {
  try {
    // TODO: Uncomment when API is ready
    // const response = await api.get('/products', { params });
    // return response.data;

    // Mock response for development
    console.log('Get products API called with:', params);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Laptop Dell XPS 13',
        description: 'Laptop cao cấp cho doanh nhân',
        price: 25000000,
        category: 'laptop',
        stock: 10,
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        name: 'iPhone 15 Pro',
        description: 'Điện thoại thông minh mới nhất',
        price: 28000000,
        category: 'phone',
        stock: 5,
        status: 'active',
        createdAt: '2024-01-16T11:00:00Z',
        updatedAt: '2024-01-16T11:00:00Z',
      },
      {
        id: '3',
        name: 'MacBook Pro M3',
        description: 'Laptop cho nhà phát triển',
        price: 45000000,
        category: 'laptop',
        stock: 3,
        status: 'inactive',
        createdAt: '2024-01-17T12:00:00Z',
        updatedAt: '2024-01-17T12:00:00Z',
      },
    ];

    return {
      data: mockProducts,
      total: mockProducts.length,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(mockProducts.length / params.pageSize),
    };
  } catch (error) {
    throw new Error('Không thể tải danh sách sản phẩm');
  }
};

export const getProduct = async (id: string): Promise<Product> => {
  try {
    // TODO: Uncomment when API is ready
    // const response = await api.get(`/products/${id}`);
    // return response.data;

    // Mock response for development
    console.log('Get product API called with id:', id);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock data - return first product for demo
    return {
      id,
      name: 'Laptop Dell XPS 13',
      description: 'Laptop cao cấp cho doanh nhân',
      price: 25000000,
      category: 'laptop',
      stock: 10,
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    };
  } catch (error) {
    throw new Error('Không thể tải thông tin sản phẩm');
  }
};

export const createProduct = async (data: ProductCreateRequest): Promise<ApiResponse<Product>> => {
  try {
    // TODO: Uncomment when API is ready
    // const response = await api.post('/products', data);
    // return response.data;

    // Mock response for development
    console.log('Create product API called with:', data);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful response
    const newProduct: Product = {
      id: 'new-' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: newProduct,
      message: 'Tạo sản phẩm thành công',
    };
  } catch (error) {
    throw new Error('Không thể tạo sản phẩm');
  }
};

export const updateProduct = async (id: string, data: ProductUpdateRequest): Promise<ApiResponse<Product>> => {
  try {
    // TODO: Uncomment when API is ready
    // const response = await api.put(`/products/${id}`, data);
    // return response.data;

    // Mock response for development
    console.log('Update product API called with:', { id, data });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful response
    const updatedProduct: Product = {
      id,
      name: data.name || 'Updated Product',
      description: data.description || 'Updated description',
      price: data.price || 0,
      category: data.category || 'general',
      stock: data.stock || 0,
      status: data.status || 'active',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: updatedProduct,
      message: 'Cập nhật sản phẩm thành công',
    };
  } catch (error) {
    throw new Error('Không thể cập nhật sản phẩm');
  }
};

export const deleteProduct = async (id: string): Promise<ApiResponse<void>> => {
  try {
    // TODO: Uncomment when API is ready
    // await api.delete(`/products/${id}`);

    // Mock response for development
    console.log('Delete product API called with id:', id);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      data: undefined,
      message: 'Xóa sản phẩm thành công',
    };
  } catch (error) {
    throw new Error('Không thể xóa sản phẩm');
  }
};