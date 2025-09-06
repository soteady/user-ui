export const developmentGuidelines = `
# Development Guidelines

## 📝 Coding Standards

### TypeScript
- Always use TypeScript for type safety
- Define interfaces for all data structures
- Use enums for constants with multiple values
- Avoid \`any\` type, use proper typing

### Component Structure
\`\`\`
ComponentName/
├── index.tsx          # Main component
├── types.ts           # Component-specific types
├── styles.css         # Component styles (if needed)
└── __tests__/         # Tests
└── index.test.tsx
\`\`\`

### Naming Conventions
- **Components**: PascalCase (e.g., \`ProductList\`)
- **Files**: camelCase for utilities, PascalCase for components
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: kebab-case or use Tailwind

### State Management
- Use Redux Toolkit for global state
- Use local state (useState) for component-specific state
- Create reusable selectors in separate files
- Follow the ducks pattern for Redux organization

### API Integration
- All API calls through services layer
- Use TypeScript interfaces for request/response
- Implement proper error handling
- Use axios interceptors for common functionality

### Form Handling
- Use Formik + Yup for complex forms
- Create reusable form components
- Implement consistent validation patterns
- Handle loading states properly

### Styling
- Primary: Tailwind CSS for utilities
- Secondary: Ant Design components
- Custom CSS only when necessary
- Follow the defined color palette

### Testing
- Unit tests for utilities and hooks
- Integration tests for components
- Test user interactions, not implementation details
- Maintain >80% code coverage

## 🚀 Performance Guidelines

### Code Splitting
- Lazy load pages and heavy components
- Use React.memo for expensive renders
- Implement proper dependency arrays in useEffect

### Bundle Optimization
- Keep bundle size under 500kb (gzipped)
- Use tree shaking
- Optimize images and assets
- Implement proper caching strategies

## 🔧 Development Workflow

### Git Workflow
1. Create feature branch from \`develop\`
2. Make atomic commits with descriptive messages
3. Create pull request with proper description
4. Get code review approval
5. Merge to \`develop\`
6. Deploy to UAT for testing
7. Merge to \`main\` for production

### Code Review Checklist
- [ ] Code follows established patterns
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Responsive design is maintained
- [ ] Accessibility guidelines are followed
- [ ] Performance considerations are addressed

### Environment Management
- Development: Local development server
- UAT: User acceptance testing environment
- Production: Live environment

## 📦 Project Structure Best Practices

### File Organization
- Group by feature, not by file type
- Keep related files close together
- Use barrel exports (index.ts files)
- Maintain clear separation of concerns

### Component Design Principles
- Single Responsibility Principle
- Composition over inheritance
- Props drilling should be minimal
- Use custom hooks for complex logic

### Error Handling
- Implement global error boundary
- Use try-catch in async operations
- Provide meaningful error messages
- Log errors properly for debugging

## 🎯 Quality Assurance

### Code Quality Tools
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking
- Husky for git hooks

### Performance Monitoring
- Monitor bundle size
- Track Core Web Vitals
- Implement proper logging
- Use React DevTools for optimization

## 📚 Resources
- [React Documentation](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Ant Design Documentation](https://ant.design/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
  `;