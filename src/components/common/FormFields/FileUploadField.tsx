import React, { useState } from 'react';
import { useField } from 'formik';
import {
  Upload,
  Button,
  Progress,
  Typography,
  Alert,
  Form,
  List,
  Space
} from 'antd';
import {
  UploadOutlined,
  FileOutlined,
  DeleteOutlined,
  InboxOutlined,
  FilePdfOutlined,
  FileWordOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload';
import { showMessage } from '../../../utils/helpers/message';

const { Dragger } = Upload;
const { Text } = Typography;

interface FileUploadFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  multiple?: boolean;
  dragger?: boolean;
  uploadFunction?: (file: RcFile) => Promise<any>;
}

const FILE_TYPE_ICONS: Record<string, React.ReactNode> = {
  'pdf': <FilePdfOutlined style={{ color: '#d32f2f' }} />,
  'doc': <FileWordOutlined style={{ color: '#1976d2' }} />,
  'docx': <FileWordOutlined style={{ color: '#1976d2' }} />,
  'default': <FileOutlined />
};

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  name,
  label,
  required,
  disabled,
  className,
  maxSize = 50, // 50MB default
  allowedTypes = ['pdf', 'doc', 'docx'],
  multiple = false,
  dragger = true,
  uploadFunction
}) => {
  const [field, meta, helpers] = useField(name);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const hasError = meta.touched && !!meta.error;

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      showMessage.error(`Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ').toUpperCase()}`);
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      showMessage.error(`Kích thước file vượt quá giới hạn ${maxSize}MB. File của bạn: ${fileSizeMB.toFixed(2)}MB`);
      return false;
    }

    return true;
  };

  const handleFileChange: UploadProps['onChange'] = (info) => {
    const { fileList, file } = info;

    if (file.status === 'uploading') {
      setUploadProgress(prev => ({
        ...prev,
        [file.uid]: file.percent || 0
      }));
    }

    if (file.status === 'done') {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.uid];
        return newProgress;
      });
      showMessage.success(`${file.name} đã upload thành công.`);
    }

    if (file.status === 'error') {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.uid];
        return newProgress;
      });
      showMessage.error(`${file.name} upload thất bại. Vui lòng thử lại.`);
    }

    // Update formik field value
    const validFiles = fileList.filter(f => f.status !== 'error');
    helpers.setValue(multiple ? validFiles : validFiles[0] || null);
  };

  const beforeUpload = (file: File) => {
    return validateFile(file);
  };

  const handleRemove = (file: UploadFile) => {
    const currentValue = field.value;
    if (multiple && Array.isArray(currentValue)) {
      const newValue = currentValue.filter((f: UploadFile) => f.uid !== file.uid);
      helpers.setValue(newValue);
    } else {
      helpers.setValue(null);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return FILE_TYPE_ICONS[extension] || FILE_TYPE_ICONS.default;
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple,
    fileList: multiple ? (field.value || []) : (field.value ? [field.value] : []),
    beforeUpload,
    onChange: handleFileChange,
    onRemove: handleRemove,
    disabled,
    showUploadList: false, // We'll create custom list
    customRequest: ({ onSuccess, onError, file }) => {
      const uploadFile = file as RcFile;
      const fileUid = uploadFile.uid;
      
      if (uploadFunction) {
        // Use provided upload function
        uploadFunction(uploadFile)
          .then((response) => {
            onSuccess?.(response, uploadFile);
          })
          .catch((error) => {
            onError?.(error);
          });
      } else {
        // Mock upload for testing
        const uploadTimer = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileUid] || 0;
            const newProgress = Math.min(currentProgress + 10, 100);
            
            if (newProgress >= 100) {
              clearInterval(uploadTimer);
              onSuccess?.({}, uploadFile);
              return prev;
            }
            
            return {
              ...prev,
              [fileUid]: newProgress
            };
          });
        }, 200);

        // Simulate potential error
        if (Math.random() < 0.1) { // 10% chance of error for demo
          setTimeout(() => {
            clearInterval(uploadTimer);
            onError?.(new Error('Upload failed'));
          }, 2000);
        }
      }
    }
  };

  const renderFileList = () => {
    const files = multiple ? (field.value || []) : (field.value ? [field.value] : []);
    if (files.length === 0) return null;

    return (
      <div className="mt-4">
        <Text strong className="block mb-2">Danh sách file đã chọn:</Text>
        <List
          size="small"
          dataSource={files}
          renderItem={(file: UploadFile) => {
            const isUploading = file.status === 'uploading';
            const progress = uploadProgress[file.uid] || 0;

            return (
              <List.Item
                className="border rounded-md p-2 mb-2"
                actions={[
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(file)}
                    disabled={disabled || isUploading}
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={getFileIcon(file.name)}
                  title={
                    <Space direction="vertical" className="w-full">
                      <Text>{file.name}</Text>
                      {isUploading && (
                        <Progress
                          percent={progress}
                          size="small"
                          status={progress === 100 ? 'success' : 'active'}
                        />
                      )}
                    </Space>
                  }
                  description={
                    <Text type="secondary">
                      {file.size ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                      {file.status === 'done' && ' - Đã upload'}
                      {file.status === 'error' && ' - Lỗi upload'}
                    </Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      </div>
    );
  };

  const uploadArea = dragger ? (
    <Dragger {...uploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Nhấp hoặc kéo file vào khu vực này để upload</p>
      <p className="ant-upload-hint">
        Hỗ trợ {allowedTypes.join(', ').toUpperCase()}. Kích thước tối đa {maxSize}MB.
        {multiple ? ' Có thể chọn nhiều file.' : ' Chỉ chọn 1 file.'}
      </p>
    </Dragger>
  ) : (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />} disabled={disabled}>
        Chọn file
      </Button>
      <Text type="secondary" className="ml-2">
        Hỗ trợ {allowedTypes.join(', ').toUpperCase()}, tối đa {maxSize}MB
      </Text>
    </Upload>
  );

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError ? 'error' : ''}
      help={hasError ? meta.error : ''}
      className={className}
    >
      {uploadArea}
      {renderFileList()}
      
      {hasError && (
        <Alert
          message={meta.error}
          type="error"
          showIcon
          className="mt-2"
        />
      )}
    </Form.Item>
  );
};

export default FileUploadField;