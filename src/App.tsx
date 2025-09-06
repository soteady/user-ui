import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import { store } from './store';
import MainLayout from './components/common/Layout/MainLayout';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import Dashboard from './pages/dashboard/Dashboard';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={viVN} theme={{
        token: {
          colorPrimary: '#0ea5e9',
          colorSuccess: '#22c55e',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
        }
      }}>
        <Router>
          <Routes>
            <Route
              path="/*"
              element={
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/create" element={<ProductForm />} />
                    <Route path="/products/edit/:id" element={<ProductForm />} />
                    {/* Add more routes as needed */}
                    <Route path="*" element={<div className="text-center py-8 text-gray-500">Trang không tồn tại</div>} />
                  </Routes>
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  );
};

export default App;