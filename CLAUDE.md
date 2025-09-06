# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm start` - Start development server
- `npm run start:uat` - Start development server with UAT environment
- `npm run build` - Build production bundle
- `npm run build:uat` - Build UAT bundle
- `npm test` - Run tests

### Testing
- `npm test` - Run Jest tests in watch mode
- `npm test -- --coverage` - Run tests with coverage report

## Project Architecture

This is a React TypeScript admin dashboard application using:

**Core Stack:**
- React 18 + TypeScript (strict mode)
- Redux Toolkit for state management
- React Router v6 for routing
- Ant Design for UI components
- Tailwind CSS for utility styling
- Axios for HTTP requests
- Formik + Yup for forms

**Key Architecture Patterns:**

### State Management
- Redux store in `src/store/` with RTK slices
- `masterSlice.ts` - UI state (sidebar, loading)
- `authSlice.ts` - Authentication state
- Use `useSelector` and `useDispatch` hooks

### Services Layer
- All API calls go through `src/services/`
- Axios configured with interceptors in `src/config/axios.ts`
- Bearer token authentication
- 5-minute request timeout
- Automatic loading overlay management

### Component Structure
- `src/components/common/` - Reusable components
  - `BaseForm/` - Formik-based form wrapper
  - `BaseList/` - Table with pagination, search, sort
  - `Layout/` - MainLayout, Sidebar, Header components
  - `FormFields/` - Reusable form inputs
  - `Modals/` - LoginModal, RegisterModal
- `src/pages/` - Page components organized by feature

### Path Aliases (tsconfig.json)
```typescript
"@/*": ["*"]
"@/components/*": ["components/*"]
"@/pages/*": ["pages/*"]
"@/services/*": ["services/*"]
"@/utils/*": ["utils/*"]
"@/store/*": ["store/*"]
"@/config/*": ["config/*"]
```

### Configuration
- `src/config/constants.ts` - API endpoints, validation rules, app constants
- `src/config/menu.ts` - Sidebar menu structure (supports 3 levels)
- Environment files: `.env` (dev) and `.env.uat` (UAT)
- Firebase hosting configured

### Styling System
- Tailwind CSS with custom color palette (10 colors: primary, secondary, success, warning, error, info, neutral, accent, dark, light)
- Ant Design components with theme customization
- Tailwind preflight disabled to avoid conflicts with Antd
- Global styles in `src/styles/globals.css`

### Form Handling
- Use `BaseForm` component with Formik + Yup validation
- Extended field components in `FormFields/ExtendedFields.tsx`
- Consistent validation patterns in `src/config/constants.ts`

### Navigation
- Multi-level sidebar menu (up to 3 levels)
- Responsive design with mobile navigation
- Menu configuration in Vietnamese

### Development Guidelines
- TypeScript strict mode enabled
- Component naming: PascalCase
- File naming: camelCase for utils, PascalCase for components
- Use custom hooks for complex logic
- Error boundaries implemented
- All API responses should be typed with TypeScript interfaces

### Testing
- Jest + React Testing Library
- Test files in `__tests__/` directories or `.test.tsx` suffix

## Important Notes

- The application is in Vietnamese (UI text, menu items)
- Uses Firebase for deployment
- Git workflow: feature branches → develop → main
- Supports both development and UAT environments
- Loading states are handled automatically via Redux
- Authentication uses JWT tokens with automatic refresh