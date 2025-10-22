# Frontend Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Component Structure](#component-structure)
4. [State Management](#state-management)
5. [Navigation & Routing](#navigation--routing)
6. [Form Handling](#form-handling)
7. [API Integration](#api-integration)
8. [Security Implementation](#security-implementation)
9. [Recent Updates](#recent-updates)

## Project Overview

GSIGN Frontend is a Next.js 14 application that provides a comprehensive patent application management system. It features a multi-step form interface, real-time validation, file upload capabilities, and AI-powered likelihood assessment.

## Architecture

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom UI library (@edk/ui-react)
- **State Management**: React Context API + Session Storage
- **Form Handling**: React Hook Form
- **Animation**: Framer Motion
- **HTTP Client**: Fetch API with custom hooks

### Project Structure

```
gsign/src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin pages
│   ├── allapplications/   # Application listing
│   ├── application-summary/ # Application summary
│   ├── cancel-application/ # Application cancellation
│   ├── login/             # Authentication
│   ├── newapplication/    # Multi-step form
│   ├── patent-detail/     # Patent details
│   ├── payment/           # Payment processing
│   ├── register/          # User registration
│   ├── similarapplications/ # Similar applications
│   ├── test-application/  # Test application
│   └── view-feedback/     # Feedback viewing
├── components/            # Reusable UI components
│   ├── application_information/ # Application info components
│   ├── common/           # Common components
│   ├── providers/        # Context providers
│   └── steps/            # Step components (Step1-Step7)
├── containers/           # Page containers
│   ├── form/            # Form containers
│   └── main/            # Main layout containers
├── context/              # React Context definitions
├── hooks/                # Custom hooks
├── libs/                 # Utility libraries
├── types/                # TypeScript type definitions
└── text/                 # Content text definitions
```

## Component Structure

### Step Components

#### Step1: Applicant/Inventor Information

- **Purpose**: Collect personal and contact information
- **Features**: Dynamic country/state loading, gender selection, residency type handling
- **Validation**: Required field validation, email format, phone number format
- **API Integration**: Countries, states, and genders APIs

#### Step2: Application Type & Patent Classification

- **Purpose**: Select application type and patent classifications
- **Features**: Multi-select patent classifications, geographical origin flags
- **Validation**: Required application type, at least one classification
- **API Integration**: Application types and patent classifications APIs

#### Step3: Detailed Description & File Upload

- **Purpose**: Upload documents and perform AI likelihood assessment
- **Features**: File upload with retry mechanism, AI analysis integration
- **Validation**: File type and size validation
- **API Integration**: File upload API, likelihood assessment API

#### Step4: First Inventor to File

- **Purpose**: Collect inventor information and prior art details
- **Features**: Multiple inventor support, prior art disclosure
- **Validation**: Required inventor information

#### Step5: Authorization to Permit Access

- **Purpose**: Collect authorization and disclosure information
- **Features**: Government funding flags, AIA compliance
- **Validation**: Required authorization fields

#### Step6: Application Summary

- **Purpose**: Display application summary and likelihood rate
- **Features**: Read-only summary, likelihood rate display
- **API Integration**: Application summary API

#### Step7: Payment Information

- **Purpose**: Process payment for patent application
- **Features**: Payment form, payment status tracking
- **API Integration**: Payment processing API

### Common Components

#### FileUpload

- **Purpose**: Handle file uploads with validation and retry mechanism
- **Features**: Drag & drop, file type validation, progress tracking, error handling
- **Props**: `onFileChange`, `acceptedTypes`, `maxSize`, `multiple`

#### ApplicationNumber

- **Purpose**: Display application number with formatting
- **Features**: Dynamic application number display, loading states

#### LikelihoodRateDisplay

- **Purpose**: Display AI-calculated likelihood rate
- **Features**: Percentage formatting, color coding, alert styling

#### LoadingSpinner

- **Purpose**: Show loading states throughout the application
- **Features**: Customizable size and styling

### Admin Components

#### ApplicationTable

- **Purpose**: Display applications in tabular format
- **Features**: Sorting, filtering, pagination, action buttons

#### FeedbackForm

- **Purpose**: Send feedback or make decisions on applications
- **Features**: Multi-select categories, file upload, decision types

## State Management

### FormContext

- **Purpose**: Manage form data across all steps
- **Features**: Data persistence, validation state, step navigation
- **Storage**: Session storage for persistence

### Custom Hooks

#### useApi

- **Purpose**: Centralized API communication
- **Features**: Authentication headers, error handling, loading states

#### useApplicationSteps

- **Purpose**: Handle step-specific operations
- **Features**: Step validation, data submission, navigation

#### useCountries, useStates, useGenders

- **Purpose**: Fetch reference data
- **Features**: Caching, loading states, error handling

#### useApplicationSummary

- **Purpose**: Fetch and manage application summary data
- **Features**: Data transformation, caching

## Navigation & Routing

### App Router Structure

- **Dynamic Routes**: `/newapplication/step/[step]/[applicationNo]`
- **Admin Routes**: `/admin/*` with role-based access
- **Public Routes**: `/login`, `/register`, `/`
- **Protected Routes**: All application-related routes

### Navigation Features

- **Step Navigation**: Forward/backward navigation with validation
- **Deep Linking**: Direct access to specific steps
- **Breadcrumbs**: Step progress indication
- **Role-based Access**: Different navigation for users and admins

## Form Handling

### React Hook Form Integration

- **Validation**: Real-time validation with custom rules
- **Error Handling**: Field-level and form-level error display
- **Data Transformation**: Backend DTO mapping
- **Persistence**: Session storage integration

### Form Features

- **Multi-step Validation**: Step-by-step validation
- **Conditional Fields**: Dynamic field display based on selections
- **File Upload Integration**: Seamless file handling
- **Data Persistence**: Auto-save form data

## API Integration

### Authentication

- **JWT Tokens**: Secure authentication with token refresh
- **Role-based Access**: Different API access based on user roles
- **Token Storage**: Secure token storage in session storage

### API Endpoints

- **Application Management**: CRUD operations for applications
- **File Upload**: Multipart file upload with progress tracking
- **Reference Data**: Countries, states, classifications, etc.
- **AI Integration**: Likelihood assessment API
- **Admin Operations**: Feedback, approval, rejection

### Error Handling

- **Network Errors**: Retry mechanisms and user feedback
- **Validation Errors**: Field-level error display
- **Authentication Errors**: Automatic redirect to login
- **File Upload Errors**: Retry and error recovery

## Security Implementation

### Frontend Security

- **Next.js Router**: Secure navigation using Next.js router instead of `window.location.href`
- **Input Validation**: Client-side validation for all inputs
- **XSS Prevention**: Proper data sanitization
- **CSRF Protection**: Token-based CSRF protection

### Authentication Security

- **JWT Validation**: Token validation on every API call
- **Role-based Access**: Component-level access control
- **Session Management**: Secure session storage handling
- **Auto-logout**: Token expiration handling

### File Upload Security

- **File Type Validation**: Strict file type checking
- **File Size Limits**: Maximum file size enforcement
- **Virus Scanning**: Backend virus scanning integration
- **Secure Upload**: HTTPS-only file uploads

## Recent Updates

### v1.7 - Security & Performance

- **Security Fixes**: Open redirect vulnerability fixes
- **Performance**: OkHttp client integration for external services
- **AI Integration**: Likelihood assessment with external AI service
- **Admin Features**: Complete feedback and rejection system

### v1.6 - Admin System

- **Admin Dashboard**: Application management interface
- **Feedback System**: Send feedback to applicants
- **Patent Search**: Search granted patents
- **Statistics**: Monthly application statistics

### v1.5 - File Management

- **File Upload**: Enhanced file upload with retry mechanism
- **Document Management**: Better document organization
- **File Validation**: Improved file type and size validation

### v1.4 - State Management

- **Form Persistence**: Better form data persistence
- **Loading States**: Improved loading state management
- **Error Handling**: Enhanced error handling and user feedback

## Development Guidelines

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Component Structure**: Consistent component organization

### Testing

- **Unit Tests**: Component-level testing
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end user flow testing

### Performance

- **Code Splitting**: Dynamic imports for better performance
- **Image Optimization**: Next.js image optimization
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching**: Strategic caching for API calls

## Deployment

### Build Process

```bash
npm run build
npm run start
```

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_ENV`: Environment (dev, test, prod)

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **Form Data Not Persisting**: Check session storage availability
2. **API Calls Failing**: Verify authentication token
3. **File Upload Issues**: Check file type and size limits
4. **Navigation Problems**: Ensure proper Next.js router usage

### Debug Tools

- **React DevTools**: Component inspection
- **Network Tab**: API call monitoring
- **Console Logs**: Error tracking
- **Session Storage**: Data persistence debugging
