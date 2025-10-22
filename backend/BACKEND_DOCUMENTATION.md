# Backend Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [API Endpoints](#api-endpoints)
4. [Database Schema](#database-schema)
5. [Authentication & Security](#authentication--security)
6. [Integration Points](#integration-points)
7. [Deployment](#deployment)
8. [Recent Updates](#recent-updates)

## Project Overview

GSIGN Backend is a Spring Boot 3.3.4 application that provides a comprehensive REST API for patent application management. It features JWT authentication, multi-step application processing, file management, AI integration, and blockchain connectivity.

## Architecture

### Tech Stack

- **Framework**: Spring Boot 3.3.4
- **Language**: Java 17+
- **Database**: PostgreSQL with gsignip schema
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local file system + Cloud storage
- **Blockchain**: Ethereum integration with Web3j 5.0.1
- **HTTP Client**: OkHttp for external services
- **JSON Processing**: GSON 2.11.0
- **Containerization**: Docker + Kubernetes

### Project Structure

```
backend/src/main/java/com/turksat/EU_Patent_Registration_Project/
├── webAPI/controllers/        # REST API controllers
├── business/                  # Business logic layer
│   ├── abstracts/           # Service interfaces
│   └── concretes/           # Service implementations
├── dataAccess/              # Data access layer
│   ├── abstracts/           # Repository interfaces
│   └── concretes/           # JDBC implementations
├── entities/                 # Entity classes and DTOs
│   ├── concretes/           # Entity classes
│   └── DTOs/                # Data Transfer Objects
├── config/                   # Configuration classes
│   ├── security/            # Security configuration
│   └── OkHttpConfig.java    # HTTP client configuration
├── core/                     # Core utilities
│   ├── entities/            # Base entities
│   └── utils/               # Utility classes
└── util/                     # Utility classes
```

### Microservices Architecture

- **Core Service**: Patent application management
- **File Service**: Document upload and management
- **AI Service**: Likelihood assessment integration
- **Blockchain Service**: Ethereum smart contract integration
- **Admin Service**: Application review and feedback

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/login              # User login
POST /api/users/create            # User registration
```

### Application Management Endpoints

```
POST /api/backend/applications/create                    # Create new application
PUT  /api/backend/applications/update/stage-1/{appNo}    # Update stage 1
PUT  /api/backend/applications/update/stage-2/{appNo}    # Update stage 2
PUT  /api/backend/applications/update/stage-3/{appNo}    # Update stage 3
PUT  /api/backend/applications/update/stage-4/{appNo}    # Update stage 4
PUT  /api/backend/applications/update/stage-5/{appNo}    # Update stage 5
PUT  /api/backend/applications/update/stage-6/{appNo}    # Update stage 6
PUT  /api/backend/applications/update/stage-7/{appNo}    # Update stage 7
GET  /api/backend/applications/summary/{appNo}           # Get application summary
POST /api/backend/applications/check-likelihood          # AI likelihood assessment
GET  /api/backend/applications/filter                    # Filter applications
```

### File Management Endpoints

```
POST /api/upload                  # Upload file
GET  /api/upload/download/{id}    # Download file
DELETE /api/upload/{id}           # Delete file
```

### Reference Data Endpoints

```
GET /api/countries/getall                    # Get countries list
GET /api/countries/getbyid/{id}              # Get country by ID
GET /api/countries/getbycode/{code}          # Get country by code
GET /api/states/getall                       # Get states list (with countryId param)
GET /api/states/getbyid/{id}                 # Get state by ID
GET /api/genders/getall                      # Get gender options
GET /api/application-types/all               # Get application types
GET /api/patent-classifications/all          # Get patent classifications
GET /api/feedback-categories/getall          # Get feedback categories
GET /api/rejection-categories/getall         # Get rejection categories
```

### Admin Endpoints

```
POST /api/send-feedback/approve              # Approve application
POST /api/send-feedback/send                 # Send feedback
POST /api/send-feedback/reject               # Reject application
GET  /api/send-feedback/latest/{appNo}/{type} # Get latest feedback
GET  /api/send-feedback/download/{id}        # Download feedback file
POST /api/backend/patent-search/search       # Search patents
GET  /api/backend/applications/admin-dashboard-stats # Admin statistics
```

### Payment Endpoints

```
POST /api/payments/create/{appNo}            # Create payment
GET  /api/payments/success/{appNo}           # Payment success
```

## Database Schema

### Core Tables

#### Users

```sql
CREATE TABLE gsignip.users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    phone_number_country_code_id INTEGER,
    user_role_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Applications

```sql
CREATE TABLE gsignip.applications (
    application_id BIGSERIAL PRIMARY KEY,
    application_no VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES gsignip.users(user_id),
    application_status_id INTEGER DEFAULT 1,
    application_type_id INTEGER,
    patent_classification_id INTEGER[],
    title_of_invention VARCHAR(500),
    invention_summary TEXT,
    likelihood DECIMAL(3,2),
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Application Documents

```sql
CREATE TABLE gsignip.application_documents (
    document_id BIGSERIAL PRIMARY KEY,
    application_no VARCHAR(50),
    document_type_id INTEGER,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Payments

```sql
CREATE TABLE gsignip.payments (
    payment_id BIGSERIAL PRIMARY KEY,
    application_no VARCHAR(50) UNIQUE NOT NULL,
    payment_amount DECIMAL(10,2),
    payment_currency VARCHAR(3),
    payment_status VARCHAR(20),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Send Feedback

```sql
CREATE TABLE gsignip.send_feedback (
    id BIGSERIAL PRIMARY KEY,
    application_no VARCHAR(50),
    remarks TEXT,
    description TEXT,
    feedback_categories INTEGER[],
    file BYTEA,
    file_name VARCHAR(255),
    file_extension VARCHAR(10),
    feedback_type INTEGER, -- 1: Approved, 2: Feedback Sent, 3: Rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reference Tables

#### Countries

```sql
CREATE TABLE gsignip.countries (
    country_id BIGSERIAL PRIMARY KEY,
    country_name VARCHAR(255) NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### States

```sql
CREATE TABLE gsignip.states (
    state_id BIGSERIAL PRIMARY KEY,
    state_name VARCHAR(255) NOT NULL,
    country_id BIGINT REFERENCES gsignip.countries(country_id)
);
```

#### Application Types

```sql
CREATE TABLE gsignip.application_types (
    application_type_id BIGSERIAL PRIMARY KEY,
    application_type_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### Patent Classifications

```sql
CREATE TABLE gsignip.patent_classifications (
    patent_classification_id BIGSERIAL PRIMARY KEY,
    patent_classification_code VARCHAR(10) NOT NULL,
    patent_classification_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

## Authentication & Security

### JWT Implementation

```java
@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(UserDetails userDetails, Long userRoleId) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("userRoleId", userRoleId)
                .claim("firstName", userDetails.getFirstName())
                .claim("lastName", userDetails.getLastName())
                .claim("email", userDetails.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
}
```

### Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/users/create").permitAll()
                .requestMatchers("/api/countries/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

### Password Encryption

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

## Integration Points

### AI Integration

#### Likelihood Assessment Service

```java
@Service
public class ApplicationManager {
    @Value("${external.patent-analysis.url}")
    private String patentAnalysisUrl;

    public DataResult<CheckLikelihoodResponseDTO> checkLikelihood(MultipartFile abstractOfTheDisclosures) {
        // OkHttp client for external AI service
        RequestBody fileBody = RequestBody.create(
            abstractOfTheDisclosures.getBytes(),
            MediaType.parse("application/pdf"));

        RequestBody requestBody = new MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("pdf_file", abstractOfTheDisclosures.getOriginalFilename(), fileBody)
            .addFormDataPart("patent_text", "")
            .addFormDataPart("top_k", "5")
            .addFormDataPart("rerank", "true")
            .addFormDataPart("priority_year", "0")
            .addFormDataPart("granted_filter", "true")
            .build();

        // Process response with GSON
        Gson gson = new Gson();
        JsonObject rootObject = gson.fromJson(responseBody, JsonObject.class);
        // Extract likelihood, analysis, and retrieved documents
    }
}
```

### Blockchain Integration

#### Smart Contract Integration

```java
@Service
public class BlockchainService {
    @Autowired
    private Web3j web3j;

    @Value("${blockchain.contract.address}")
    private String contractAddress;

    public String registerPatent(String applicationNumber, String ipfsHash) {
        PatentRegistry contract = PatentRegistry.load(
            contractAddress,
            web3j,
            credentials,
            new StaticGasProvider(BigInteger.valueOf(20000000000L), BigInteger.valueOf(6721975L))
        );

        TransactionReceipt receipt = contract.registerPatent(applicationNumber, ipfsHash).send();
        return receipt.getTransactionHash();
    }
}
```

### File Storage Integration

#### Local File Storage

```java
@Service
public class FileStorageService {
    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file) {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path targetLocation = Paths.get(uploadDir).resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }
}
```

## Deployment

### Docker Configuration

#### Production Dockerfile

```dockerfile
FROM openjdk:17-jre-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Test Dockerfile

```dockerfile
FROM openjdk:17-jre-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=test"]
```

### Kubernetes Deployment

#### Production Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gsign-backend-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gsign-backend-prod
  template:
    metadata:
      labels:
        app: gsign-backend-prod
    spec:
      containers:
        - name: gsign-backend
          image: gsign-backend:latest
          ports:
            - containerPort: 8080
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: "prod"
            - name: GSIGN_PROD_DB_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
```

### Environment Configuration

#### Application Properties

```properties
# application.properties
spring.datasource.type=org.springframework.jdbc.datasource.SimpleDriverDataSource
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://localhost:5432/gsign_db
spring.datasource.username=postgres
spring.datasource.password=password

jwt.secret=your-secret-key
jwt.expiration=86400000

external.patent-analysis.url=http://XXXXXX:XXXXXX/analyze
```

#### Test Environment

```yaml
# application-test.yml
spring:
  datasource:
    url: ${GSIGN_TEST_DB_URL}
    username: ${GSIGN_TEST_DB_USERNAME}
    password: ${GSIGN_TEST_DB_PASSWORD}

external:
  patent-analysis:
    url: http://XXXXXX:XXXXXX/analyze
```

#### Production Environment

```yaml
# application-prod.yml
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

## Recent Updates

### v1.7 - Security & Performance (Latest)

#### Security Enhancements

- **Spring Boot Update**: Updated to 3.3.4 for security patches
- **Dependency Updates**: Updated Web3j to 5.0.1, GSON to 2.11.0
- **Conservative Approach**: Minimal dependency changes to maintain stability

#### Performance Improvements

- **OkHttp Integration**: Replaced RestTemplate with OkHttpClient
- **GSON Integration**: Replaced Jackson with GSON for JSON processing
- **Connection Pooling**: Optimized HTTP client configuration
- **Timeout Configuration**: Increased read timeout to 5 minutes for AI processing

#### AI Integration

- **External Service**: Integration with patent analysis service
- **Multipart Upload**: File upload to external AI service
- **Response Processing**: GSON-based JSON response parsing
- **Performance Monitoring**: Processing time tracking

### v1.6 - Admin System

#### Admin Features

- **Feedback System**: Complete feedback and rejection workflow
- **Patent Search**: Search functionality for granted patents
- **Statistics**: Monthly application statistics
- **File Management**: Feedback file upload and download

#### Database Enhancements

- **Schema Prefix**: Added gsignip schema prefix to all queries
- **New Tables**: send_feedback, rejection_categories, feedback_categories
- **Enhanced Queries**: Improved SQL queries with proper joins

### v1.5 - File Management

#### File Upload System

- **Retry Mechanism**: File upload retry on failure
- **Validation**: Enhanced file type and size validation
- **Progress Tracking**: Upload progress monitoring
- **Error Handling**: Comprehensive error handling

### v1.4 - State Management

#### Form Processing

- **Multi-step Validation**: Step-by-step form validation
- **Data Persistence**: Enhanced data persistence
- **Error Handling**: Improved error handling and user feedback

## Testing

### Unit Tests

```java
@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {
    @Mock
    private ApplicationRepository repository;

    @InjectMocks
    private ApplicationManager service;

    @Test
    void createApplication_Success() {
        // Test implementation
    }
}
```

### Integration Tests

```java
@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class ApplicationControllerIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void submitStep_Success() {
        // Integration test implementation
    }
}
```

## Monitoring & Logging

### Logging Configuration

```yaml
logging:
  level:
    org.springframework.jdbc.core: ERROR
    com.turksat: INFO
  pattern:
    console: "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
```

### Health Checks

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return Health.up().withDetail("database", "Available").build();
        } catch (Exception e) {
            return Health.down().withDetail("database", "Unavailable").build();
        }
    }
}
```

## Performance Optimization

### Database Optimization

- **Connection Management**: SimpleDriverDataSource for simple connection handling
- **Query Optimization**: Optimized SQL queries with proper indexing
- **Schema Prefix**: Consistent gsignip schema usage

### Application Optimization

- **OkHttp Client**: Efficient HTTP client for external services
- **GSON Processing**: Fast JSON processing
- **Async Processing**: Non-blocking operations where applicable

## Troubleshooting

### Common Issues

1. **Database Connection**: Check PostgreSQL connection and schema
2. **JWT Token**: Verify token generation and validation
3. **File Upload**: Check file permissions and storage configuration
4. **External Services**: Verify AI service connectivity

### Debug Configuration

```properties
# Enable debug logging
logging.level.com.turksat=DEBUG
logging.level.org.springframework.web=DEBUG
```
