import React from 'react';
import { Drawer, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuConfig } from '../../../config/menu';
import { MenuItem } from '../../../utils/types/common';

interface MobileNavProps {
  visible: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ visible, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Chuyển đổi menu config sang format Antd Menu
  const convertToAntdMenu = (items: MenuItem[]): any[] => {
    return items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? convertToAntdMenu(item.children) : undefined,
      onClick: item.path ? () => {
        navigate(item.path!);
        onClose();
      } : undefined,
    }));
  };

  const menuItems = convertToAntdMenu(menuConfig);

  // Tìm selected keys từ current path
  const getSelectedKeys = (): string[] => {
    const currentPath = location.pathname;
    const findMenuItem = (items: MenuItem[], path: string): MenuItem | null => {
      for (const item of items) {
        if (item.path === path) return item;
        if (item.children) {
          const found = findMenuItem(item.children, path);
          if (found) return found;
        }
      }
      return null;
    };

    const currentItem = findMenuItem(menuConfig, currentPath);
    return currentItem ? [currentItem.key] : [];
  };

  const selectedKeys = getSelectedKeys();

  return (
    <Drawer
      title={null}
      placement="left"
      onClose={onClose}
      open={visible}
      width={280}
      className="mobile-nav-drawer"
      headerStyle={{ display: 'none' }}
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex items-center justify-center bg-primary-600 text-white font-bold text-lg py-4 mb-0">
        STEADY
      </div>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        items={menuItems}
        className="border-r-0 mt-0"
      />
    </Drawer>
  );
};

export default MobileNav;