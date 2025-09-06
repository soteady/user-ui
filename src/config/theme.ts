import { ThemeConfig } from 'antd';

export const lightTheme: ThemeConfig = {
  token: {
    // Primary colors
    colorPrimary: '#0ea5e9',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#0ea5e9',

    // Background colors
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8fafc',

    // Text colors
    colorText: '#1f2937',
    colorTextSecondary: '#6b7280',
    colorTextTertiary: '#9ca3af',
    colorTextQuaternary: '#d1d5db',

    // Border
    colorBorder: '#e5e7eb',
    colorBorderSecondary: '#f3f4f6',

    // Font
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

    // Border radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // Control height
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,

    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,

    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,
  },
  components: {
    Layout: {
      bodyBg: '#f8fafc',
      headerBg: '#ffffff',
      siderBg: '#001529',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#1890ff',
      itemHoverBg: 'rgba(255, 255, 255, 0.08)',
    },
    Button: {
      borderRadius: 6,
      controlHeight: 32,
      paddingContentHorizontal: 16,
    },
    Input: {
      borderRadius: 6,
      controlHeight: 32,
      paddingInline: 12,
    },
    Card: {
      borderRadius: 8,
      boxShadowTertiary: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    Table: {
      borderRadius: 6,
      headerBg: '#fafafa',
    },
    Form: {
      itemMarginBottom: 16,
      verticalLabelPadding: '0 0 4px',
    },
  },
};

export const darkTheme: ThemeConfig = {
  ...lightTheme,
  token: {
    ...lightTheme.token,
    // Background colors
    colorBgBase: '#141414',
    colorBgContainer: '#1f1f1f',
    colorBgElevated: '#262626',
    colorBgLayout: '#000000',

    // Text colors
    colorText: '#ffffff',
    colorTextSecondary: '#a6a6a6',
    colorTextTertiary: '#737373',
    colorTextQuaternary: '#525252',

    // Border
    colorBorder: '#404040',
    colorBorderSecondary: '#303030',
  },
  components: {
    ...lightTheme.components,
    Layout: {
      bodyBg: '#000000',
      headerBg: '#141414',
      siderBg: '#001529',
    },
  },
};