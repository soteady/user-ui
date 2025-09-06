import { message, Modal, notification } from 'antd';

export const showMessage = {
  success: (content: string, duration = 3) => {
    message.success(content, duration);
  },
  error: (content: string, duration = 5) => {
    message.error(content, duration);
  },
  warning: (content: string, duration = 4) => {
    message.warning(content, duration);
  },
  info: (content: string, duration = 3) => {
    message.info(content, duration);
  },
  loading: (content: string, duration = 0) => {
    return message.loading(content, duration);
  },
};

export const showNotification = {
  success: (title: string, description?: string, duration = 4.5) => {
    notification.success({
      message: title,
      description,
      duration,
    });
  },
  error: (title: string, description?: string, duration = 4.5) => {
    notification.error({
      message: title,
      description,
      duration,
    });
  },
  warning: (title: string, description?: string, duration = 4.5) => {
    notification.warning({
      message: title,
      description,
      duration,
    });
  },
  info: (title: string, description?: string, duration = 4.5) => {
    notification.info({
      message: title,
      description,
      duration,
    });
  },
};

export const showConfirm = (
  title: string,
  content?: string,
  onOk?: () => void | Promise<void>,
  onCancel?: () => void
) => {
  Modal.confirm({
    title,
    content,
    onOk,
    onCancel,
    okText: 'Xác nhận',
    cancelText: 'Hủy',
  });
};