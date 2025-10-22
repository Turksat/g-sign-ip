# GSIGN Backend - Patent Application Management API

## Overview

GSIGN Backend is a Spring Boot 3.3.4 REST API that provides comprehensive patent application management services. It features JWT authentication, multi-step application processing, file management, AI integration, blockchain connectivity, and admin management tools.

## Project Structure

```
backend/
├── src/main/java/com/turksat/EU_Patent_Registration_Project/
│   ├── webAPI/controllers/        # REST API controllers
│   ├── business/                  # Business logic layer
│   │   ├── abstracts/           # Service interfaces
│   │   └── concretes/           # Service implementations
│   ├── dataAccess/              # Data access layer
│   │   ├── abstracts/           # Repository interfaces
│   │   └── concretes/           # JDBC implementations
│   ├── entities/                 # Entity classes and DTOs
│   │   ├── concretes/           # Entity classes
│   │   └── DTOs/                # Data Transfer Objects
│   ├── config/                   # Configuration classes
│   │   ├── security/            # Security configuration
│   │   └── OkHttpConfig.java    # HTTP client configuration
│   ├── core/                     # Core utilities
│   │   ├── entities/            # Base entities
│   │   └── utils/               # Utility classes
│   └── util/                     # Utility classes
├── src/main/resources/
│   ├── application.properties    # Development configuration
│   ├── application-test.yml      # Test environment
│   └── application-prod.yml      # Production environment
├── blockchain/                    # Blockchain integration
│   ├── contracts/               # Smart contracts
│   └── wallets/                 # Ethereum wallets
├── k8s/                         # Kubernetes deployment files
│   ├── Dockerfile.prod          # Production Dockerfile
│   ├── Dockerfile.test          # Test Dockerfile
│   ├── prod-deployment.yml      # Production deployment
│   ├── test-deployment.yml      # Test deployment
│   └── service.yml              # Kubernetes service
├── pom.xml                      # Maven configuration
└── README.md                    # This file
```

## Quick Start

### Prerequisites

- Java 17+
- Maven 3.6+
- PostgreSQL 13+
- Docker (optional)

### Development Setup

1. **Clone and Navigate**

   ```bash
   cd backend
   ```

2. **Database Setup**

   ```bash
   # Create PostgreSQL database
   createdb gsign_db

   # Run migrations and seed data
   # (Database scripts should be provided)
   ```

3. **Configuration**

   ```bash
   # Update application.properties with your database credentials
   spring.datasource.url=jdbc:postgresql://localhost:5432/gsign_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Run Application**

   ```bash
   ./mvnw spring-boot:run
   ```

5. **Verify**
   - API will be available at `http://localhost:8080`
   - Health check: `http://localhost:8080/actuator/health`

## Technology Stack

### Core Technologies

- **Framework**: Spring Boot 3.3.4
- **Language**: Java 17+
- **Database**: PostgreSQL with gsignip schema
- **Authentication**: JWT (JSON Web Tokens)
- **HTTP Client**: OkHttp for external services
- **JSON Processing**: GSON 2.11.0
- **Blockchain**: Web3j 5.0.1 for Ethereum integration

### Key Dependencies

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jdbc</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>

    <!-- HTTP Client -->
    <dependency>
        <groupId>com.squareup.okhttp3</groupId>
        <artifactId>okhttp</artifactId>
    </dependency>

    <!-- JSON Processing -->
    <dependency>
        <groupId>com.google.code.gson</groupId>
        <artifactId>gson</artifactId>
    </dependency>

    <!-- Blockchain -->
    <dependency>
        <groupId>org.web3j</groupId>
        <artifactId>core</artifactId>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
    </dependency>
</dependencies>
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/users/create` - User registration

### Application Management

- `POST /api/backend/applications/create` - Create new application
- `PUT /api/backend/applications/update/stage-{1-7}/{appNo}` - Update application stages
- `GET /api/backend/applications/summary/{appNo}` - Get application summary
- `POST /api/backend/applications/check-likelihood` - AI likelihood assessment
- `GET /api/backend/applications/filter` - Filter applications

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

## Configuration

### Development (application.properties)

```properties
# Database
spring.datasource.type=org.springframework.jdbc.datasource.SimpleDriverDataSource
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://localhost:5432/gsign_db
spring.datasource.username=postgres
spring.datasource.password=password

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# External Services
external.patent-analysis.url=http://XXXXXX:XXXXXX/analyze

# Logging
logging.level.org.springframework.jdbc.core=DEBUG
```

### Production (application-prod.yml)

```yaml
spring:
  datasource:
    url: ${GSIGN_PROD_DB_URL}
    username: ${GSIGN_PROD_DB_USERNAME}
    password: ${GSIGN_PROD_DB_PASSWORD}

external:
  patent-analysis:
    url: http://XXXXXX:XXXXXX/analyze

logging:
  level:
    org.springframework.jdbc.core: ERROR
```

## Key Features

### 1. Multi-Step Application Processing

- **7 Application Stages**: Complete patent application workflow
- **Data Validation**: Comprehensive input validation
- **State Management**: Application state tracking
- **Progress Tracking**: Step-by-step progress monitoring

### 2. AI Integration

- **Likelihood Assessment**: AI-powered patent success probability
- **External Service**: Integration with patent analysis service
- **File Processing**: PDF document analysis
- **Performance Monitoring**: Processing time tracking

### 3. Admin Management System

- **Application Review**: Complete application review workflow
- **Feedback System**: Send feedback to applicants
- **Approval/Rejection**: Application decision management
- **Patent Search**: Search granted patents
- **Statistics**: Application statistics and reporting

### 4. File Management

- **File Upload**: Multipart file upload support
- **File Validation**: Type and size validation
- **File Storage**: Local and cloud storage support
- **File Security**: Virus scanning and security validation

### 5. Blockchain Integration

- **Ethereum Integration**: Web3j for blockchain connectivity
- **Smart Contracts**: Patent registration on blockchain
- **Wallet Management**: Ethereum wallet creation and management
- **Transaction Processing**: Blockchain transaction handling

### 6. Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different access levels for users and admins
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Secure cross-origin resource sharing
- **Password Encryption**: BCrypt password hashing

## Development

### Building the Project

```bash
# Clean and compile
./mvnw clean compile

# Run tests
./mvnw test

# Package application
./mvnw package

# Run application
java -jar target/EU_Patent_Registration_Project-0.0.1-SNAPSHOT.jar
```

### Testing

```bash
# Unit tests
./mvnw test

# Integration tests
./mvnw verify

# Test with specific profile
./mvnw spring-boot:run -Dspring.profiles.active=test
```

### Code Quality

```bash
# Check code style
./mvnw checkstyle:check

# Generate test coverage
./mvnw jacoco:report
```

## Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -f k8s/Dockerfile.prod -t gsign-backend:latest .

# Run container
docker run -p 8080:8080 gsign-backend:latest
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/prod-deployment.yml
kubectl apply -f k8s/service.yml

# Check deployment status
kubectl get pods
kubectl get services
```

### Environment Variables

```bash
# Required environment variables for production
export GSIGN_PROD_DB_URL="jdbc:postgresql://db-host:5432/gsign_prod"
export GSIGN_PROD_DB_USERNAME="username"
export GSIGN_PROD_DB_PASSWORD="password"
export JWT_SECRET="your-jwt-secret"
```

## Monitoring & Logging

### Health Checks

- **Database Health**: `/actuator/health`
- **Application Health**: `/actuator/health`
- **Custom Health Indicators**: Database connectivity checks

### Logging Configuration

```yaml
logging:
  level:
    com.turksat: INFO
    org.springframework.jdbc.core: ERROR
  pattern:
    console: "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
```

### Performance Monitoring

- **Response Time**: API response time monitoring
- **Database Queries**: Query performance tracking
- **Memory Usage**: JVM memory monitoring
- **External Services**: AI service response time tracking

## Troubleshooting

### Common Issues

1. **Database Connection Issues**

   ```bash
   # Check database connectivity
   psql -h localhost -U postgres -d gsign_db
   ```

2. **JWT Token Issues**

   ```bash
   # Check JWT secret configuration
   echo $JWT_SECRET
   ```

3. **External Service Issues**

   ```bash
   # Test AI service connectivity
   curl -X POST http://XXXXXX:XXXXXX/analyze
   ```

4. **Port Conflicts**
   ```bash
   # Check if port 8080 is available
   netstat -tulpn | grep :8080
   ```

### Debug Configuration

```properties
# Enable debug logging
logging.level.com.turksat=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.security=DEBUG
```

## API Documentation

### Request/Response Examples

#### Create Application

```bash
curl -X POST http://localhost:8080/api/backend/applications/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": 1,
    "applicationTypeId": 1
  }'
```

#### Upload File

```bash
curl -X POST http://localhost:8080/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@document.pdf"
```

#### Check Likelihood

```bash
curl -X POST http://localhost:8080/api/backend/applications/check-likelihood \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "abstractOfTheDisclosures=@abstract.pdf"
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software developed for TURKSAT.

## Detailed Documentation

For comprehensive technical documentation, see:

- **[Backend Documentation](./BACKEND_DOCUMENTATION.md)** - Complete API reference, database schema, and implementation details

## Support

For technical support or questions, please contact the development team or refer to the comprehensive documentation in the project repository.
