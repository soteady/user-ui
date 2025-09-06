import { createApiRequest } from '../../config/axios';

const api = createApiRequest();

export interface User {
  id: number;
  username: string;
  email?: string;
  name?: string;
  password?: string;
}

export interface UserSelectOption {
  value: number;
  label: string;
  disabled?: boolean;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    throw new Error('Không thể tải danh sách người dùng. Vui lòng thử lại.');
  }
};

export const getUsersAsOptions = async (): Promise<UserSelectOption[]> => {
  try {
    const users = await getUsers();
    return users.map(user => ({
      value: user.id,
      label: user.email || user.username || `User ${user.id}`,
      disabled: false
    }));
  } catch (error) {
    throw error;
  }
};