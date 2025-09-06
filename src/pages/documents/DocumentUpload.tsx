import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, Divider, Tag, Modal } from 'antd';
import { 
  FileAddOutlined, 
  ReloadOutlined, 
  EyeOutlined, 
  DeleteOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import BaseList from '../../components/common/BaseList';
import BaseForm, { FormFieldConfig } from '../../components/common/BaseForm';
import { FileUploadField } from '../../components/common/FormFields/ExtendedFields';
import * as Yup from 'yup';
import { 
  uploadDocument, 
  getDocuments, 
  deleteDocument, 
  downloadDocument,
  Document,
  DocumentListResponse 
} from '../../services/document/documentService';
import { getUsersAsOptions, UserSelectOption } from '../../services/user/userService';
import { showMessage } from '../../utils/helpers/message';
import { useResponsive } from '../../utils/hooks/useResponsive';

const { Title, Text } = Typography;
const { confirm } = Modal;

interface UploadFormData {
  file: File;
  title: string;
  description?: string;
  allowedUsers: number[];
}

const DocumentUpload: React.FC = () => {
  const { isMobile } = useResponsive();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userOptions, setUserOptions] = useState<UserSelectOption[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    loadUsers();
    loadDocuments();
  }, []);

  const loadUsers = async () => {
    try {
      const options = await getUsersAsOptions();
      setUserOptions(options);
    } catch (error) {
      showMessage.error('Không thể tải danh sách người dùng');
    }
  };

  const loadDocuments = async (params?: { page?: number; pageSize?: number; search?: string }) => {
    setLoading(true);
    try {
      const response: DocumentListResponse = await getDocuments({
        page: params?.page || pagination.current,
        pageSize: params?.pageSize || pagination.pageSize,
        search: params?.search
      });
      
      setDocuments(response.data);
      setPagination(prev => ({
        ...prev,
        current: response.page,
        total: response.total
      }));
    } catch (error) {
      showMessage.error('Không thể tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const uploadFields: FormFieldConfig[] = [
    {
      name: 'file',
      type: 'custom',
      label: 'Chọn tài liệu',
      required: true,
      className: 'col-span-2',
      customComponent: FileUploadField,
      customProps: {
        maxSize: 50,
        allowedTypes: ['pdf', 'docx', 'doc'],
        multiple: false,
        dragger: true
      }
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề tài liệu',
      placeholder: 'Nhập tiêu đề cho tài liệu',
      required: true,
      className: 'col-span-2'
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      placeholder: 'Nhập mô tả cho tài liệu (tùy chọn)',
      rows: 3,
      className: 'col-span-2'
    },
    {
      name: 'allowedUsers',
      type: 'select',
      label: 'Người dùng được xem',
      placeholder: 'Chọn người dùng có quyền xem tài liệu',
      options: userOptions,
      mode: 'multiple',
      className: 'col-span-2'
    }
  ];

  const validationSchema = Yup.object().shape({
    file: Yup.mixed().required('Vui lòng chọn file để upload'),
    title: Yup.string()
      .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
      .max(200, 'Tiêu đề không được vượt quá 200 ký tự')
      .required('Tiêu đề là bắt buộc'),
    description: Yup.string().max(500, 'Mô tả không được vượt quá 500 ký tự'),
    allowedUsers: Yup.array()
  });

  const handleUpload = async (values: UploadFormData) => {
    setIsUploading(true);
    try {
      await uploadDocument({
        file: values.file,
        title: values.title,
        description: values.description,
        allowedUsers: values.allowedUsers
      });

      showMessage.success('Upload tài liệu thành công! Tài liệu đang được xử lý.');
      setUploadModalVisible(false);
      loadDocuments(); // Refresh the list
    } catch (error: any) {
      showMessage.error(error.message || 'Upload thất bại. Vui lòng thử lại.');
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (doc: Document) => {
    confirm({
      title: 'Xóa tài liệu',
      content: `Bạn có chắc chắn muốn xóa tài liệu "${doc.title}"?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteDocument(doc.id);
          showMessage.success('Đã xóa tài liệu thành công');
          loadDocuments();
        } catch (error: any) {
          showMessage.error(error.message || 'Không thể xóa tài liệu');
        }
      }
    });
  };

  const handleDownload = async (doc: Document) => {
    try {
      const blob = await downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = doc.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showMessage.success('Tải xuống thành công');
    } catch (error: any) {
      showMessage.error(error.message || 'Không thể tải xuống tài liệu');
    }
  };

  const getStatusTag = (status: Document['status']) => {
    const statusConfig = {
      uploading: { color: 'processing', icon: <LoadingOutlined />, text: 'Đang upload' },
      processing: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Đang xử lý' },
      completed: { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoàn thành' },
      failed: { color: 'error', icon: <ExclamationCircleOutlined />, text: 'Thất bại' }
    };

    const config = statusConfig[status];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Document) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" className="text-xs">
            {record.fileName}
          </Text>
        </div>
      )
    },
    {
      title: 'Kích thước',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 120,
      render: (size: number) => {
        const sizeInMB = (size / (1024 * 1024)).toFixed(2);
        return `${sizeInMB} MB`;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: Document['status']) => getStatusTag(status)
    },
    {
      title: 'Ngày upload',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      width: 150,
      render: (_, record: Document) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            title="Xem chi tiết"
            onClick={() => {
              // TODO: Implement view details
              showMessage.info('Tính năng xem chi tiết đang được phát triển');
            }}
          />
          <Button
            type="text"
            size="small"
            icon={<DownloadOutlined />}
            title="Tải xuống"
            disabled={record.status !== 'completed'}
            onClick={() => handleDownload(record)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            title="Xóa"
            onClick={() => handleDelete(record)}
          />
        </Space>
      )
    }
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <Title level={2} className="!mb-2">
          Quản lý Tài liệu
        </Title>
        <Text type="secondary">
          Upload và quản lý các tài liệu PDF, DOCX trong hệ thống
        </Text>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Text strong className="text-base">Danh sách Tài liệu</Text>
            <br />
            <Text type="secondary" className="text-sm">
              Tổng số: {pagination.total} tài liệu
            </Text>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => loadDocuments()}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<FileAddOutlined />}
              onClick={() => setUploadModalVisible(true)}
            >
              Upload Tài liệu
            </Button>
          </Space>
        </div>

        <Divider />

        <BaseList
          data={documents}
          columns={columns}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50']
          }}
          onSearch={(params) => {
            const searchTerm = params.filters.find(f => f.field === 'search')?.value;
            loadDocuments({ search: searchTerm, page: params.page, pageSize: params.pageSize });
          }}
          onPageChange={(page, pageSize) => {
            loadDocuments({ page, pageSize });
          }}
        />
      </Card>

      {/* Upload Modal */}
      <Modal
        title="Upload Tài liệu Mới"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <BaseForm
          fields={uploadFields}
          validationSchema={validationSchema}
          onSubmit={handleUpload}
          submitButtonText="Upload Tài liệu"
          cancelButtonText="Hủy"
          showCancelButton={true}
          onCancel={() => setUploadModalVisible(false)}
          loading={isUploading}
          cardClassName="shadow-none border-0"
        />
      </Modal>
    </div>
  );
};

export default DocumentUpload;