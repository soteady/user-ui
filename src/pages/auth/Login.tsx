import React from 'react';
import { Card, Typography, Button } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import BaseForm, { FormFieldConfig } from '../../components/common/BaseForm';
import * as Yup from 'yup';
import { loginUser } from '../../services/auth/authService';
import { useResponsive } from '../../utils/hooks/useResponsive';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      navigate('/');
    } catch (error) {
      dispatch(loginFailure());
      throw error;
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-left mb-6">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            className="text-gray-500 hover:text-gray-700 mb-4"
          >
            Quay lại
          </Button>
        </div>

        <Card className="shadow-lg border-0">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
              <LoginOutlined className="text-2xl text-white" />
            </div>
            <Title level={2} className="!text-gray-800 !mb-2">
              Chào mừng trở lại
            </Title>
            <Text className="text-gray-500">
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
            submitButtonClassName="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          />

          <div className="text-center mt-6">
            <a href="#" className="text-sm text-gray-400 hover:text-blue-500">
              Quên mật khẩu?
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;