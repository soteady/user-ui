import React, { useState } from 'react';
import { Layout, Button, Popover, Avatar, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  LoginOutlined,
  UserAddOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { RootState } from '../../../store';
import { logout } from '../../../store/slices/authSlice';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import MobileNav from './MobileNav';
import { useResponsive } from '../../../utils/hooks/useResponsive';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { globalConfig } = useSelector((state: RootState) => state.master);
  const { isMobile } = useResponsive();

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [mobileNavVisible, setMobileNavVisible] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSwitchToRegister = () => {
    setLoginModalVisible(false);
    setRegisterModalVisible(true);
  };

  const handleSwitchToLogin = () => {
    setRegisterModalVisible(false);
    setLoginModalVisible(true);
  };

  const userMenuContent = (
    <div className="w-48">
      <div className="p-3 border-b">
        <div className="font-medium">{user?.email}</div>
        <div className="text-gray-500 text-sm">{user?.role}</div>
      </div>
      <div className="p-1">
        <Button type="text" icon={<UserOutlined />} block className="text-left">
          Thông tin cá nhân
        </Button>
        <Button type="text" icon={<SettingOutlined />} block className="text-left">
          Cài đặt
        </Button>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          block
          className="text-left text-red-500"
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );

  return (
    <AntHeader className="bg-white shadow-sm px-4 sm:px-6 flex justify-between items-center sticky top-0 z-40 h-12 sm:h-16">
      {/* Mobile Menu & Logo */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileNavVisible(true)}
            size="small"
            className="flex items-center justify-center"
          />
        )}
        {/* TODO: Thay thế bằng logo thật */}
        <div className="text-base sm:text-xl font-bold text-primary-600 truncate max-w-28 sm:max-w-none">
          {globalConfig.systemName}
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {isAuthenticated ? (
          <Popover
            content={userMenuContent}
            trigger="hover"
            placement="bottomRight"
          >
            <Avatar
              src={user?.avatar}
              icon={!user?.avatar && <UserOutlined />}
              className="cursor-pointer bg-primary-500"
              size="small"
            />
          </Popover>
        ) : (
          <Space size="small">
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => setLoginModalVisible(true)}
              size="small"
              className="hidden sm:inline-flex"
            >
              Đăng nhập
            </Button>
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => setLoginModalVisible(true)}
              size="small"
              className="sm:hidden"
            />
            <Button
              icon={<UserAddOutlined />}
              onClick={() => setRegisterModalVisible(true)}
              size="small"
              className="hidden sm:inline-flex"
            >
              Đăng ký
            </Button>
            <Button
              icon={<UserAddOutlined />}
              onClick={() => setRegisterModalVisible(true)}
              size="small"
              className="sm:hidden"
            />
          </Space>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        visible={mobileNavVisible}
        onClose={() => setMobileNavVisible(false)}
      />

      {/* Modals */}
      <LoginModal
        visible={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        visible={registerModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </AntHeader>
  );
};

export default Header;