import React from 'react';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const LoadingOverlay: React.FC = () => {
  const { loading } = useSelector((state: RootState) => state.master);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-[100]">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Spin size="large" />
        <div className="mt-3 text-center">Đang xử lý...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;