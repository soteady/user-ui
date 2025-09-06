import { createApiRequest } from '../../config/axios';

const api = createApiRequest();

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    phone?: string;
    address?: string;
    gender?: 'male' | 'female' | 'other';
    birthDate?: string;
    avatar?: string;
    role: string;
    permissions: string[];
  };
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
}

// TODO: Implement API calls
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    // TODO: Uncomment when API is ready
    // const response = await api.post('/auth/login', data);
    // return response.data;

    // Mock response for development
    console.log('Login API called with:', data);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful response
    return {
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      user: {
        id: '1',
        username: data.username,
        email: data.username + '@example.com',
        role: 'Admin',
        permissions: ['read', 'write', 'delete'],
      },
    };
  } catch (error) {
    throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
  }
};

export const registerUser = async (data: RegisterRequest): Promise<void> => {
  try {
    // TODO: Uncomment when API is ready
    // await api.post('/auth/register', data);

    // Mock response for development
    console.log('Register API called with:', data);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock successful response
    return;
  } catch (error) {
    throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
  }
};

export const refreshToken = async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
  try {
    // TODO: Uncomment when API is ready
    // const response = await api.post('/auth/refresh', { refreshToken });
    // return response.data;

    // Mock response for development
    console.log('Refresh token API called with:', refreshToken);

    return {
      token: 'new-mock-jwt-token-' + Date.now(),
      refreshToken: 'new-mock-refresh-token-' + Date.now(),
    };
  } catch (error) {
    throw new Error('Refresh token failed');
  }
};
