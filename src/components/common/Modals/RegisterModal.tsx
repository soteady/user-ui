import React from 'react';
import { Modal, Typography, Divider, Space } from 'antd';
import { UserAddOutlined, UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { registerStart, registerSuccess, registerFailure } from '../../../store/slices/authSlice';
import BaseForm, { FormFieldConfig } from '../BaseForm';
import * as Yup from 'yup';
import { registerUser } from '../../../services/auth/authService';
import { GENDER_OPTIONS } from '../../../utils/constants';
import { useResponsive } from '../../../utils/hooks/useResponsive';

const { Title, Text } = Typography;

interface RegisterModalProps {
  visible: boolean;
  onCancel: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ visible, onCancel, onSwitchToLogin }) => {
  const dispatch = useDispatch();
  const { registerLoading } = useSelector((state: RootState) => state.auth);
  const { isMobile } = useResponsive();

  const registerFields: FormFieldConfig[] = [
    {
      name: 'username',
      type: 'text',
      label: 'Tên đăng nhập',
      placeholder: 'Nhập tên đăng nhập',
      required: true,
      prefix: <UserOutlined className="text-gray-400" />,
      className: 'sm:col-span-1 col-span-2',
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email',
      placeholder: 'Nhập địa chỉ email',
      required: true,
      prefix: <MailOutlined className="text-gray-400" />,
      className: 'sm:col-span-1 col-span-2',
    },
    {
      name: 'password',
      type: 'password',
      label: 'Mật khẩu',
      placeholder: 'Nhập mật khẩu (tối thiểu 6 ký tự)',
      required: true,
      prefix: <LockOutlined className="text-gray-400" />,
      className: 'sm:col-span-1 col-span-2',
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Xác nhận mật khẩu',
      placeholder: 'Nhập lại mật khẩu',
      required: true,
      prefix: <LockOutlined className="text-gray-400" />,
      className: 'sm:col-span-1 col-span-2',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Số điện thoại',
      placeholder: 'Nhập số điện thoại',
      required: true,
      prefix: <PhoneOutlined className="text-gray-400" />,
      className: 'sm:col-span-1 col-span-2',
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Ngày sinh',
      placeholder: 'Chọn ngày sinh của bạn',
      required: true,
      prefix: <CalendarOutlined className="text-gray-400" />,
      className: 'sm:col-span-1 col-span-2',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Địa chỉ',
      placeholder: 'Nhập địa chỉ chi tiết',
      rows: 3,
      className: 'col-span-2',
      prefix: <HomeOutlined className="text-gray-400" />,
    },
    {
      name: 'gender',
      type: 'radio',
      label: 'Giới tính',
      required: true,
      options: GENDER_OPTIONS,
      className: 'col-span-2',
    },
  ];

  const registerValidationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
      .required('Tên đăng nhập là bắt buộc'),
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
    password: Yup.string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .required('Mật khẩu là bắt buộc'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Xác nhận mật khẩu không khớp')
      .required('Xác nhận mật khẩu là bắt buộc'),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, 'Số điện thoại không hợp lệ')
      .required('Số điện thoại là bắt buộc'),
    address: Yup.string().required('Địa chỉ là bắt buộc'),
    gender: Yup.string().required('Giới tính là bắt buộc'),
    birthDate: Yup.string().required('Ngày sinh là bắt buộc'),
  });

  const handleRegister = async (values: any) => {
    dispatch(registerStart());
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = values;
      await registerUser(registerData);
      dispatch(registerSuccess());
      onCancel();
    } catch (error) {
      dispatch(registerFailure());
      throw error;
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="95vw"
      style={{ maxWidth: '800px' }}
      destroyOnClose
      centered
      className="register-modal"
      styles={{
        header: { display: 'none' },
        body: { 
          padding: isMobile ? '20px 16px' : '24px 32px'
        }
      }}
    >
      <div className="text-center mb-4 sm:mb-5">
        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-2 sm:mb-3">
          <UserAddOutlined className="text-base sm:text-lg text-white" />
        </div>
        <Title level={3} className="!text-gray-800 !mb-1 !text-lg sm:!text-xl">
          Tạo tài khoản mới
        </Title>
        <Text className="text-gray-500 text-xs sm:text-sm">
          Điền thông tin bên dưới để tạo tài khoản của bạn
        </Text>
      </div>

      <BaseForm
        fields={registerFields}
        validationSchema={registerValidationSchema}
        onSubmit={handleRegister}
        submitButtonText="Tạo tài khoản"
        showCancelButton={false}
        loading={registerLoading}
        cardClassName="shadow-none border-0"
        submitButtonClassName="w-full h-9 sm:h-10 text-sm sm:text-base font-medium bg-gradient-to-r from-green-500 to-green-600 border-0 hover:from-green-600 hover:to-green-700 transition-all duration-200"
      />

      <Divider className="!my-3 sm:!my-4">
        <Text className="text-gray-400 text-xs">hoặc</Text>
      </Divider>

      <div className="text-center mb-3 sm:mb-4">
        <Text className="text-gray-500 text-xs sm:text-sm">
          Đã có tài khoản?{' '}
          <a 
            href="#" 
            className="text-green-500 hover:text-green-600 font-medium"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin?.();
            }}
          >
            Đăng nhập ngay
          </a>
        </Text>
      </div>

      <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
        <Text className="text-xs text-gray-500 text-center block leading-relaxed">
          Bằng cách tạo tài khoản, bạn đồng ý với{' '}
          <a href="#" className="text-green-500 hover:text-green-600">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href="#" className="text-green-500 hover:text-green-600">
            Chính sách bảo mật
          </a>{' '}
          của chúng tôi.
        </Text>
      </div>
    </Modal>
  );
};

export default RegisterModal;