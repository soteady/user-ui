import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';
import { showMessage } from '../utils/helpers/message';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: parseInt(process.env.REACT_APP_TIMEOUT || '300000'), // 5 minutes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Gắn Bearer token và các thông tin khác
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Có thể thêm các header khác ở đây
    // config.headers['X-Request-ID'] = generateRequestId();
    // config.headers['X-User-Agent'] = 'React-Admin-App';

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý response và error chung
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Xử lý timeout
    if (error.code === 'ECONNABORTED') {
      showMessage.error('Request timeout! Vui lòng thử lại sau.');
      return Promise.reject(new Error('Request timeout'));
    }

    // Xử lý các lỗi HTTP khác
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Clear token và redirect to login
          store.dispatch({ type: 'auth/logout' });
          showMessage.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
          break;
        case 403:
          showMessage.error('Bạn không có quyền truy cập tài nguyên này.');
          break;
        case 404:
          showMessage.error('Không tìm thấy tài nguyên yêu cầu.');
          break;
        case 500:
          showMessage.error('Lỗi hệ thống. Vui lòng thử lại sau.');
          break;
        default:
          showMessage.error((data as any)?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } else if (error.request) {
      // Network error
      showMessage.error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.');
    }

    return Promise.reject(error);
  }
);

// Utility để tạo request với loading overlay
export const createApiRequest = (showLoading = true) => {
  return {
    get: <T = any>(url: string, config?: InternalAxiosRequestConfig) =>
      apiRequest<T>('GET', url, undefined, config, showLoading),
    post: <T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig) =>
      apiRequest<T>('POST', url, data, config, showLoading),
    put: <T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig) =>
      apiRequest<T>('PUT', url, data, config, showLoading),
    patch: <T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig) =>
      apiRequest<T>('PATCH', url, data, config, showLoading),
    delete: <T = any>(url: string, config?: InternalAxiosRequestConfig) =>
      apiRequest<T>('DELETE', url, undefined, config, showLoading),
  };
};

// Internal function để handle loading state
const apiRequest = async <T = any>(
  method: string,
  url: string,
  data?: any,
  config?: InternalAxiosRequestConfig,
  showLoading = true
): Promise<AxiosResponse<T>> => {
  if (showLoading) {
    store.dispatch({ type: 'master/setLoading', payload: true });
  }

  try {
    const response = await apiClient.request<T>({
      method,
      url,
      data,
      ...config,
    });

    return response;
  } finally {
    if (showLoading) {
      store.dispatch({ type: 'master/setLoading', payload: false });
    }
  }
};

// Export default axios instance
export default apiClient;