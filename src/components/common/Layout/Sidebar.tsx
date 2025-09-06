import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../../store';
import { toggleSidebar } from '../../../store/slices/masterSlice';
import { menuConfig } from '../../../config/menu';
import { MenuItem } from '../../../utils/types/common';

const { Sider } = Layout;

interface SidebarProps {
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useSelector((state: RootState) => state.master);

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Chuyển đổi menu config sang format Antd Menu
  const convertToAntdMenu = (items: MenuItem[]): any[] => {
    return items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? convertToAntdMenu(item.children) : undefined,
      onClick: item.path ? () => navigate(item.path!) : undefined,
    }));
  };

  const menuItems = convertToAntdMenu(menuConfig);

  // Tìm selected keys và open keys từ current path
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

  // Tìm open keys từ selected keys
  const getOpenKeys = (selectedKeys: string[]): string[] => {
    if (selectedKeys.length === 0) return [];

    const findParentKeys = (items: MenuItem[], targetKey: string, parents: string[] = []): string[] => {
      for (const item of items) {
        if (item.key === targetKey) {
          return parents;
        }
        if (item.children) {
          const result = findParentKeys(item.children, targetKey, [...parents, item.key]);
          if (result.length > 0) return result;
        }
      }
      return [];
    };

    return findParentKeys(menuConfig, selectedKeys[0]);
  };

  const selectedKeys = getSelectedKeys();
  const defaultOpenKeys = getOpenKeys(selectedKeys);

  React.useEffect(() => {
    setOpenKeys(defaultOpenKeys);
  }, [selectedKeys.join(',')]);

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Sider
      collapsed={isMobile ? true : sidebarCollapsed}
      onCollapse={() => !isMobile && dispatch(toggleSidebar())}
      width={256}
      collapsedWidth={isMobile ? 0 : 80}
      className={`${isMobile ? 'hidden' : 'fixed'} left-0 top-0 bottom-0 z-50 shadow-lg`}
      theme="dark"
      collapsible={!isMobile}
      breakpoint={isMobile ? undefined : 'lg'}
    >
      <div className={`${isMobile ? 'h-12' : 'h-16'} flex items-center justify-center bg-primary-600 text-white font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
        {(isMobile ? true : sidebarCollapsed) ? 'S' : 'STEADY'}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={isMobile ? [] : openKeys}
        onOpenChange={isMobile ? () => {} : handleOpenChange}
        items={menuItems}
        className="border-r-0"
        inlineCollapsed={isMobile ? true : sidebarCollapsed}
      />
    </Sider>
  );
};

export default Sidebar;