import React from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingOverlay from './LoadingOverlay';
import { useResponsive } from '../../../utils/hooks/useResponsive';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarCollapsed } = useSelector((state: RootState) => state.master);
  const { isMobile } = useResponsive();

  return (
    <Layout className="min-h-screen">
      <LoadingOverlay />
      <Sidebar isMobile={isMobile} />
      <Layout className={`transition-all duration-300 ${
        isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <Header />
        <Content className="m-3 sm:m-6 p-3 sm:p-6 bg-white rounded-lg shadow-sm overflow-auto">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;