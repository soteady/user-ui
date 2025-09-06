# React Admin Base Project

## 📋 Mô tả dự án
Base project React TypeScript sử dụng Ant Design, Redux Toolkit, React Router, và Tailwind CSS cho các dự án admin dashboard quy mô vừa và lớn.

## 🛠️ Công nghệ sử dụng
- React 18 + TypeScript
- Redux Toolkit cho state management
- React Router v6 cho routing
- Ant Design cho UI components
- Tailwind CSS cho custom styling
- Axios cho HTTP requests
- Formik + Yup cho form handling
- Day.js cho xử lý ngày tháng

## 🎨 Color Palette
Hệ thống sử dụng 10 màu chính:
1. **Primary** (#0ea5e9) - Màu chính của hệ thống
2. **Secondary** (#eab308) - Màu phụ
3. **Success** (#22c55e) - Màu thành công
4. **Warning** (#f59e0b) - Màu cảnh báo
5. **Error** (#ef4444) - Màu lỗi
6. **Info** (#0ea5e9) - Màu thông tin
7. **Neutral** (#64748b) - Màu trung tính
8. **Accent** (#d946ef) - Màu nhấn
9. **Dark** (#1e293b) - Màu tối
10. **Light** (#ffffff) - Màu sáng

## 📁 Cấu trúc thư mục

```
src/
├── components/           # Reusable components
│   ├── common/          # Common components
│   │   ├── BaseForm/    # Base form component
│   │   ├── BaseList/    # Base list component  
│   │   ├── FormFields/  # Form field components
│   │   ├── Layout/      # Layout components
│   │   └── Modals/      # Modal components
│   └── ui/              # UI specific components
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   ├── products/        # Product pages
│   └── dashboard/       # Dashboard pages
├── services/            # API services
│   ├── api/             # API configurations
│   ├── auth/            # Authentication services
│   └── products/        # Product services
├── store/               # Redux store
│   ├── slices/          # Redux slices
│   │   ├── authSlice.ts
│   │   └── masterSlice.ts
│   └── index.ts
├── utils/               # Utility functions
│   ├── constants/       # Application constants
│   ├── helpers/         # Helper functions
│   ├── hooks/           # Custom hooks
│   └── types/           # TypeScript type definitions
├── styles/              # Styling files
│   ├── globals.css      # Global styles
│   └── antd-custom.css  # Antd customizations
└── config/              # Configuration files
    ├── axios.ts         # Axios configuration
    ├── menu.ts          # Menu configuration
    └── theme.ts         # Theme configuration
```

## ⚙️ Cấu hình môi trường

### Development
```bash
npm start
```

### UAT
```bash
npm run start:uat
```

## 🔧 Tính năng chính

### 1. HTTP Request Management
- Axios interceptors với Bearer token
- Timeout 5 phút cho mỗi request
- Loading overlay tự động

### 2. Form Handling
- Base form component với Formik + Yup
- Các loại input: text, password, textarea, date, datetime, number, select, radio, checkbox
- Validation tự động
- Error message display

### 3. List Management
- Base list component với pagination
- Search functionality với nhiều operators
- Sort theo column
- Action buttons (Edit, Delete)

### 4. Authentication
- Login/Register modals
- JWT token management
- User profile popover

### 5. Layout System
- Fixed sidebar menu với multi-level
- Fixed header với user controls
- Responsive content area

## 🚀 Hướng dẫn sử dụng

### 1. Cài đặt
```bash
npm install
```

### 2. Khởi chạy development
```bash
npm start
```

### 3. Build production
```bash
npm run build
```

## 📝 Development Guidelines

### Code Style
- Sử dụng TypeScript strict mode
- Component naming: PascalCase
- File naming: camelCase cho utils, PascalCase cho components
- Hook naming: use + PascalCase

### Component Structure
- Mỗi component nên có folder riêng với index.ts
- Types được định nghĩa trong file types.ts
- Styles custom trong file styles.css nếu cần

### API Integration
- Tất cả API calls đều thông qua services layer
- Sử dụng TypeScript interfaces cho request/response
- Error handling thống nhất

## 🔄 Git Workflow
1. Feature branches từ develop
2. Pull request review required
3. Merge vào develop sau khi approve
4. Release từ develop sang main

## 📞 Liên hệ
Dự án được phát triển bởi Senior Frontend Developer Team