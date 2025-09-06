import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
  LineChartOutlined
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={1234}
              prefix={<ShoppingOutlined className="text-primary-500" />}
              valueStyle={{ color: '#0ea5e9' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={567}
              prefix={<UserOutlined className="text-success-500" />}
              valueStyle={{ color: '#22c55e' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={1234567}
              prefix={<DollarOutlined className="text-warning-500" />}
              valueStyle={{ color: '#f59e0b' }}
              suffix="VND"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn hàng"
              value={89}
              prefix={<LineChartOutlined className="text-accent-500" />}
              valueStyle={{ color: '#d946ef' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mt-6">
        <Col xs={24} lg={12}>
          <Card title="Hoạt động gần đây" className="h-80">
            <div className="text-center py-8 text-gray-500">
              {/* TODO: Implement recent activities */}
              Chưa có hoạt động gần đây
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Thống kê nhanh" className="h-80">
            <div className="text-center py-8 text-gray-500">
              {/* TODO: Implement quick stats */}
              Biểu đồ thống kê sẽ được hiển thị ở đây
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;