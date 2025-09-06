import { createApiRequest } from '../../config/axios';
import apiClient from '../../config/axios';

const api = createApiRequest();

export interface DocumentUploadRequest {
  file: File;
  title?: string;
  description?: string;
  allowedUsers?: number[];
}

export interface Document {
  id: number;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  description?: string;
  uploadedBy: number;
  allowedUsers: number[];
}

export interface DocumentListResponse {
  data: Document[];
  total: number;
  page: number;
  pageSize: number;
}

export const uploadDocument = async (request: DocumentUploadRequest): Promise<Document> => {
  try {
    const formData = new FormData();
    formData.append('file', request.file);
    
    if (request.title) {
      formData.append('title', request.title);
    }
    
    if (request.description) {
      formData.append('description', request.description);
    }
    
    if (request.allowedUsers && request.allowedUsers.length > 0) {
      formData.append('allowedUsers', JSON.stringify(request.allowedUsers));
    }

    const response = await api.post('/api/documents/upload', formData);

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 413) {
      throw new Error('File quá lớn. Vui lòng chọn file có kích thước nhỏ hơn.');
    }
    if (error.response?.status === 415) {
      throw new Error('Định dạng file không được hỗ trợ.');
    }
    throw new Error('Upload tài liệu thất bại. Vui lòng thử lại.');
  }
};

export const getDocuments = async (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<DocumentListResponse> => {
  try {
    // Build query string manually
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/api/documents?${queryString}` : '/api/documents';
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Không thể tải danh sách tài liệu. Vui lòng thử lại.');
  }
};

export const getDocumentById = async (id: number): Promise<Document> => {
  try {
    const response = await api.get(`/api/documents/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Không thể tải thông tin tài liệu.');
  }
};

export const deleteDocument = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/documents/${id}`);
  } catch (error) {
    throw new Error('Không thể xóa tài liệu. Vui lòng thử lại.');
  }
};

export const downloadDocument = async (id: number): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/api/documents/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw new Error('Không thể tải xuống tài liệu.');
  }
};