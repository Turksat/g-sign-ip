# GSIGN - Patent Application Management System

## Overview

GSIGN is a comprehensive patent application management system that provides a multi-step form interface for users to submit patent applications. The system includes both frontend and backend components with blockchain integration for patent registration and AI-powered likelihood assessment.

## Project Structure

```
gsign_ip/
├── gsign/                   # Frontend project (Next.js)
│   ├── src/                 # Frontend source code
│   ├── FRONTEND_DOCUMENTATION.md # Complete frontend documentation
│   └── PROJECT_SUMMARY.md   # Project overview and features
└── backend/                 # Backend project (Spring Boot)
    ├── src/                 # Backend source code
    └── BACKEND_DOCUMENTATION.md # Complete backend documentation
```

## Quick Start

### Frontend Development

```bash
cd gsign
npm install
npm run dev
```

### Backend Development

```bash
cd ../backend
./mvnw spring-boot:run
```

## Key Features

### Core Functionality

- **Multi-step Form**: 7-step patent application process
- **Real-time Validation**: Form validation with React Hook Form
- **File Upload**: Document upload and management with retry mechanism
- **AI Integration**: Likelihood assessment using external AI service
- **Blockchain Integration**: Ethereum smart contract integration
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Authentication**: JWT-based user authentication
- **State Management**: React Context + Session Storage

### Admin Features

- **Application Management**: View, approve, reject applications
- **Feedback System**: Send feedback to applicants
- **Patent Search**: Search granted patents
- **Dashboard Statistics**: Monthly application statistics
- **User Management**: Manage user accounts and roles

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different access levels for users and admins
- **Input Validation**: Comprehensive frontend and backend validation
- **CORS Configuration**: Secure cross-origin resource sharing
- **File Security**: File type and size validation

## Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom UI library (@edk/ui-react)
- **State Management**: React Context API + Session Storage
- **Form Handling**: React Hook Form
- **Animation**: Framer Motion
- **HTTP Client**: Fetch API with custom hooks

### Backend

- **Framework**: Spring Boot 3.3.4
- **Language**: Java 17+
- **Database**: PostgreSQL with gsignip schema
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local file system + Cloud storage
- **Blockchain**: Ethereum integration with Web3j
- **HTTP Client**: OkHttp for external services
- **JSON Processing**: GSON library
- **Containerization**: Docker + Kubernetes

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/users/create` - User registration

### Application Management

- `POST /api/backend/applications/create` - Create new application
- `PUT /api/backend/applications/update/stage-{1-7}/{applicationNo}` - Update application stages
- `GET /api/backend/applications/summary/{applicationNo}` - Get application summary
- `POST /api/backend/applications/check-likelihood` - AI likelihood assessment

### Data Endpoints

- `GET /api/countries/getall` - Get countries list
- `GET /api/states/getall` - Get states list (with countryId parameter)
- `GET /api/genders/getall` - Get gender options
- `GET /api/application-types/all` - Get application types
- `GET /api/patent-classifications/all` - Get patent classifications

### Admin Endpoints

- `GET /api/backend/applications/filter` - Filter applications
- `POST /api/send-feedback/approve` - Approve application
- `POST /api/send-feedback/send` - Send feedback
- `POST /api/send-feedback/reject` - Reject application
- `POST /api/backend/patent-search/search` - Search patents

### File Management

- `POST /api/upload` - Upload file
- `GET /api/upload/download/{id}` - Download file
- `DELETE /api/upload/{id}` - Delete file

## Database Schema

### Core Tables

- **users**: User accounts and authentication
- **applications**: Patent application data
- **application_documents**: File metadata and storage
- **payments**: Payment information
- **send_feedback**: Admin feedback and decisions

### Reference Tables

- **countries**: Country data with codes
- **states**: State/province data
- **genders**: Gender options
- **application_types**: Patent application types
- **patent_classifications**: Patent classification codes
- **feedback_categories**: Feedback category options
- **rejection_categories**: Rejection reason categories

## Recent Updates

### Latest Features (v1.7)

- **AI Likelihood Assessment**: Integration with external AI service for patent success probability
- **Admin Feedback System**: Complete feedback and rejection workflow
- **Patent Search**: Search functionality for granted patents
- **Security Enhancements**: Open redirect vulnerability fixes
- **Performance Optimization**: OkHttp client and GSON integration
- **Database Schema**: Added gsignip schema prefix to all queries

### Security Updates

- **Frontend Security**: Replaced `window.location.href` with Next.js router
- **Backend Security**: Updated Spring Boot to 3.3.4 for security patches
- **Input Validation**: Enhanced validation for all user inputs
- **CORS Configuration**: Secure cross-origin resource sharing

## Documentation

- **[Frontend Documentation](./FRONTEND_DOCUMENTATION.md)** - Complete frontend architecture, components, and implementation details
- **[Backend Documentation](../backend/BACKEND_DOCUMENTATION.md)** - Complete backend API, database schema, and deployment information
- **[Project Summary](./PROJECT_SUMMARY.md)** - Comprehensive project overview and feature list

## Development

### Prerequisites

- Node.js 18+ (Frontend)
- Java 17+ (Backend)
- PostgreSQL 13+ (Database)
- Maven 3.6+ (Backend build)

### Environment Setup

1. Clone the repository
2. Set up PostgreSQL database with gsignip schema
3. Configure environment variables in backend/src/main/resources/
4. Install dependencies: `npm install` (frontend) and `./mvnw install` (backend)
5. Run migrations and seed data
6. Start development servers

### Testing

- Frontend: `npm run test`
- Backend: `./mvnw test`

## Deployment

### Docker

- Frontend: `docker build -f k8s/Dockerfile.prod .`
- Backend: `docker build -f k8s/Dockerfile.prod .`

### Kubernetes

- Use provided YAML files in `k8s/` directory
- Configure environment-specific values
- Deploy with `kubectl apply -f k8s/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software developed for TURKSAT.
