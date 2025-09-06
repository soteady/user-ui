import React from 'react';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  TeamOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import { MenuItem } from '../utils/types/common';

export const menuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: React.createElement(DashboardOutlined),
    path: '/dashboard',
    level: 1,
  },
  {
    key: 'products',
    label: 'Quản lý sản phẩm',
    icon: React.createElement(ShoppingOutlined),
    level: 1,
    children: [
      {
        key: 'products-list',
        label: 'Danh sách sản phẩm',
        path: '/products',
        level: 2,
      },
      {
        key: 'products-create',
        label: 'Tạo sản phẩm mới',
        path: '/products/create',
        level: 2,
      },
      {
        key: 'products-categories',
        label: 'Danh mục sản phẩm',
        path: '/products/categories',
        level: 2,
      },
    ],
  },
  {
    key: 'documents',
    label: 'Quản lý tài liệu',
    icon: React.createElement(CloudUploadOutlined),
    path: '/documents',
    level: 1,
  },
  {
    key: 'users',
    label: 'Quản lý người dùng',
    icon: React.createElement(UserOutlined),
    level: 1,
    children: [
      {
        key: 'users-list',
        label: 'Danh sách người dùng',
        path: '/users',
        level: 2,
      },
      {
        key: 'users-roles',
        label: 'Phân quyền',
        path: '/users/roles',
        level: 2,
      },
    ],
  },
  {
    key: 'reports',
    label: 'Báo cáo',
    icon: React.createElement(FileTextOutlined),
    level: 1,
    children: [
      {
        key: 'reports-sales',
        label: 'Báo cáo bán hàng',
        level: 2,
        children: [
          {
            key: 'reports-sales-daily',
            label: 'Báo cáo theo ngày',
            path: '/reports/sales/daily',
            level: 3,
          },
          {
            key: 'reports-sales-monthly',
            label: 'Báo cáo theo tháng',
            path: '/reports/sales/monthly',
            level: 3,
          },
        ],
      },
      {
        key: 'reports-users',
        label: 'Báo cáo người dùng',
        path: '/reports/users',
        level: 2,
      },
    ],
  },
  {
    key: 'system',
    label: 'Hệ thống',
    icon: React.createElement(SettingOutlined),
    level: 1,
    children: [
      {
        key: 'system-settings',
        label: 'Cấu hình hệ thống',
        path: '/system/settings',
        level: 2,
      },
      {
        key: 'system-logs',
        label: 'Nhật ký hệ thống',
        path: '/system/logs',
        level: 2,
      },
    ],
  },
];