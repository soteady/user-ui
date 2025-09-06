export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: SearchFilter[];
}

export type SearchOperator = 'eq' | 'ne' | 'like' | 'notlike' | 'in' | 'notin' | 'between' | 'gt' | 'gte' | 'lt' | 'lte';

export interface SearchFilter {
  field: string;
  operator: SearchOperator;
  value: any;
  required?: boolean;
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  level: number;
}