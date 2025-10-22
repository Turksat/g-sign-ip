# GSIGN Patent Application Management System

## Overview

GSIGN is a comprehensive patent application management system that provides a complete solution for patent application processing, from initial submission to final approval. The system consists of two main components: a Next.js frontend application and a Spring Boot backend API, with integrated AI-powered likelihood assessment and blockchain connectivity.

## Project Structure

```
gsign_ip/
├── gsign/                   # Frontend Project (Next.js)
│   ├── src/                 # Frontend source code
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── next.config.ts       # Next.js configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── README.md            # Frontend documentation
│   ├── FRONTEND_DOCUMENTATION.md # Detailed frontend docs
│   └── PROJECT_SUMMARY.md   # Project overview
├── backend/                 # Backend Project (Spring Boot)
│   ├── src/                 # Backend source code
│   ├── blockchain/          # Blockchain integration
│   ├── k8s/                 # Kubernetes deployment files
│   ├── pom.xml              # Maven configuration
│   ├── README.md            # Backend documentation
│   └── BACKEND_DOCUMENTATION.md # Detailed backend docs
└── README.md                # This file
```

## Quick Start

### Prerequisites
- **Node.js 18+** (for frontend)
- **Java 17+** (for backend)
- **Maven 3.6+** (for backend)
- **PostgreSQL 13+** (for database)
- **Docker** (optional, for containerized deployment)

### 1. Frontend Setup

```bash
# Navigate to frontend directory
cd gsign

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Configure database in application.properties
# Update database credentials as needed

# Run the application
./mvnw spring-boot:run
```

Backend API will be available at `http://localhost:8080`

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb gsign_db

# Run database migrations and seed data
# (Database scripts should be provided separately)
```

## System Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom @edk/ui-react library
- **State Management**: React Context + Session Storage
- **Form Handling**: React Hook Form
- **Animation**: Framer Motion

### Backend (Spring Boot 3.3.4)
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 17+
- **Database**: PostgreSQL with gsignip schema
- **Authentication**: JWT (JSON Web Tokens)
- **HTTP Client**: OkHttp for external services
- **JSON Processing**: GSON 2.11.0
- **Blockchain**: Web3j 5.0.1 for Ethereum integration

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

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/users/create` - User registration

### Application Management
- `POST /api/backend/applications/create` - Create new application
- `PUT /api/backend/applications/update/stage-{1-7}/{appNo}` - Update application stages
- `GET /api/backend/applications/summary/{appNo}` - Get application summary
- `POST /api/backend/applications/check-likelihood` - AI likelihood assessment

### Reference Data
- `GET /api/countries/getall` - Get countries list
- `GET /api/states/getall` - Get states list
- `GET /api/genders/getall` - Get gender options
- `GET /api/application-types/all` - Get application types
- `GET /api/patent-classifications/all` - Get patent classifications

### Admin Operations
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

## Development

### Frontend Development
```bash
cd gsign
npm install
npm run dev
```

### Backend Development
```bash
cd backend
./mvnw spring-boot:run
```

### Testing
```bash
# Frontend tests
cd gsign
npm run test

# Backend tests
cd backend
./mvnw test
```

## Deployment

### Docker Deployment
```bash
# Frontend
cd gsign
docker build -f k8s/Dockerfile.prod -t gsign-frontend:latest .

# Backend
cd backend
docker build -f k8s/Dockerfile.prod -t gsign-backend:latest .
```

### Kubernetes Deployment
```bash
# Deploy frontend
kubectl apply -f gsign/k8s/

# Deploy backend
kubectl apply -f backend/k8s/
```

## Environment Configuration

### Frontend Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_ENV=development
```

### Backend Environment Variables
```bash
# Development
spring.datasource.url=jdbc:postgresql://localhost:5432/XXXXXX
spring.datasource.username=XXXXXX
spring.datasource.password=XXXXXX
jwt.secret=your-secret-key
external.patent-analysis.url=http://XXXXXX:8000/analyze

# Production
GSIGN_PROD_DB_URL=jdbc:postgresql://XXXXXX:5432/XXXXXX
GSIGN_PROD_DB_USERNAME=XXXXXX
GSIGN_PROD_DB_PASSWORD=XXXXXX
JWT_SECRET=your-jwt-secret
```

## Documentation

- **[Frontend Documentation](./gsign/FRONTEND_DOCUMENTATION.md)** - Complete frontend architecture and implementation
- **[Backend Documentation](./backend/BACKEND_DOCUMENTATION.md)** - Complete backend API and database schema
- **[Project Summary](./gsign/PROJECT_SUMMARY.md)** - Comprehensive project overview and features

## Recent Updates

### v1.7 - Security & Performance (Latest)
- **Security Updates**: Spring Boot 3.3.4, dependency updates
- **AI Integration**: External patent analysis service integration
- **Performance**: OkHttp client, GSON integration
- **Frontend Security**: Open redirect vulnerability fixes

### v1.6 - Admin System
- **Admin Features**: Complete admin management system
- **Feedback System**: Application feedback and rejection workflow
- **Patent Search**: Search functionality for granted patents
- **Statistics**: Monthly application statistics

### v1.5 - File Management
- **File Upload**: Enhanced file upload with retry mechanism
- **Document Management**: Better document organization
- **Validation**: Improved file validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software developed for TURKSAT.

## Support

For technical support or questions, please refer to the detailed documentation in each project directory or contact the development team.
