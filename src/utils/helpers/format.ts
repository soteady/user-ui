import dayjs from 'dayjs';

export const formatDate = (date: string | Date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date, format = 'DD/MM/YYYY HH:mm:ss') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

export const formatTime = (date: string | Date, format = 'HH:mm:ss') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

export const formatBoolean = (value: boolean, trueText = 'Có', falseText = 'Không') => {
  return value ? trueText : falseText;
};

export const formatCurrency = (value: number, currency = 'VND') => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatNumber = (value: number, minimumFractionDigits = 0) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits,
  }).format(value);
};