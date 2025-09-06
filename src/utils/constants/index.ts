export const SEARCH_OPERATORS = [
  { value: 'eq', label: 'Bằng' },
  { value: 'ne', label: 'Không bằng' },
  { value: 'like', label: 'Chứa' },
  { value: 'notlike', label: 'Không chứa' },
  { value: 'in', label: 'Trong danh sách' },
  { value: 'notin', label: 'Không trong danh sách' },
  { value: 'between', label: 'Trong khoảng' },
  { value: 'gt', label: 'Lớn hơn' },
  { value: 'gte', label: 'Lớn hơn hoặc bằng' },
  { value: 'lt', label: 'Nhỏ hơn' },
  { value: 'lte', label: 'Nhỏ hơn hoặc bằng' },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const TIME_FORMAT = 'HH:mm:ss';