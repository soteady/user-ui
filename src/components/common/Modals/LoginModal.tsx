import React from 'react';
import { Modal, Typography, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { loginStart, loginSuccess, loginFailure } from '../../../store/slices/authSlice';
import BaseForm, { FormFieldConfig } from '../BaseForm';
import * as Yup from 'yup';
import { loginUser } from '../../../services/auth/authService';
import { useResponsive } from '../../../utils/hooks/useResponsive';

const { Title, Text } = Typography;

interface LoginModalProps {
  visible: boolean;
  onCancel: () => void;
  onSwitchToRegister?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onCancel, onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const { loginLoading } = useSelector((state: RootState) => state.auth);
  const { isMobile } = useResponsive();

  const loginFields: FormFieldConfig[] = [
    {
      name: 'username',
      type: 'text',
      label: 'Tên đăng nhập',
      placeholder: 'Nhập tên đăng nhập hoặc email',
      required: true,
      className: 'col-span-2',
      prefix: <UserOutlined className="text-gray-400" />,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Mật khẩu',
      placeholder: 'Nhập mật khẩu của bạn',
      required: true,
      className: 'col-span-2',
      prefix: <LockOutlined className="text-gray-400" />,
    },
  ];

  const loginValidationSchema = Yup.object().shape({
    username: Yup.string().required('Tên đăng nhập là bắt buộc'),
    password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
  });

  const handleLogin = async (values: { username: string; password: string }) => {
    dispatch(loginStart());
    try {
      const response = await loginUser(values);
      dispatch(loginSuccess(response));
      onCancel();
    } catch (error) {
      dispatch(loginFailure());
      throw error;
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="90vw"
      style={{ maxWidth: '420px' }}
      destroyOnClose
      centered
      className="login-modal"
      styles={{
        header: { display: 'none' },
        body: { 
          padding: isMobile ? '20px 16px 16px' : '24px 28px 20px'
        }
      }}
    >
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-2 sm:mb-3">
          <LoginOutlined className="text-base sm:text-lg text-white" />
        </div>
        <Title level={3} className="!text-gray-800 !mb-1 !text-lg sm:!text-xl">
          Chào mừng trở lại
        </Title>
        <Text className="text-gray-500 text-xs sm:text-sm">
          Đăng nhập để tiếp tục với tài khoản của bạn
        </Text>
      </div>

      <BaseForm
        fields={loginFields}
        validationSchema={loginValidationSchema}
        onSubmit={handleLogin}
        submitButtonText="Đăng nhập"
        showCancelButton={false}
        loading={loginLoading}
        cardClassName="shadow-none border-0"
        submitButtonClassName="w-full h-9 sm:h-10 text-sm sm:text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
      />

      <Divider className="!my-3 sm:!my-4">
        <Text className="text-gray-400 text-xs">hoặc</Text>
      </Divider>

      <div className="text-center mb-3 sm:mb-4">
        <Text className="text-gray-500 text-xs sm:text-sm">
          Chưa có tài khoản?{' '}
          <a 
            href="#" 
            className="text-blue-500 hover:text-blue-600 font-medium"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToRegister?.();
            }}
          >
            Đăng ký ngay
          </a>
        </Text>
      </div>

      <div className="text-center">
        <a href="#" className="text-xs text-gray-400 hover:text-blue-500">
          Quên mật khẩu?
        </a>
      </div>
    </Modal>
  );
};

export default LoginModal;