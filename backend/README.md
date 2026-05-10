# Project Manager Case Study - Backend

This is a microservices-based project management system with role-based access control.

## Architecture

- **EurekaServer** (Port 8761): Service discovery server
- **UserService** (Port 8081): User authentication and management
- **TaskService** (Port 8082): Task creation and management
- **TaskSubmissionService** (Port 8083): Task submission and review

## Prerequisites

1. Java 21
2. Maven 3.6+
3. MySQL 8.0+

## Database Setup

Create the following MySQL databases:
```sql
CREATE DATABASE caseStudyWithGenAIUser;
CREATE DATABASE caseStudyWithGenAITask;
CREATE DATABASE caseStudyWithGenAISubmission;
```

## Running the Services

1. Start EurekaServer first:
```bash
cd EurekaServer
mvn spring-boot:run
```

2. Start UserService:
```bash
cd UserService
mvn spring-boot:run
```

3. Start TaskService:
```bash
cd TaskService
mvn spring-boot:run
```

4. Start TaskSubmissionService:
```bash
cd TaskSubmissionService
mvn spring-boot:run
```

## API Endpoints

### UserService (Port 8081)
- POST `/auth/signup` - User registration
- POST `/auth/login` - User login
- POST `/auth/logout` - User logout
- GET `/users/profile` - Get user profile (requires JWT)
- GET `/users/{id}` - Get user by ID
- GET `/users/all` - Get all users

### TaskService (Port 8082)
- POST `/tasks` - Create task (Admin only)
- GET `/tasks` - Get all tasks
- GET `/tasks/{id}` - Get task by ID
- PUT `/tasks/{id}` - Update task (Admin only)
- DELETE `/tasks/{id}` - Delete task (Admin only)
- POST `/tasks/{taskId}/assign/{userId}` - Assign task to user
- GET `/tasks/user/{userId}` - Get user's assigned tasks
- POST `/tasks/{taskId}/complete/{userId}` - Complete task

### TaskSubmissionService (Port 8083)
- POST `/submissions` - Submit task
- GET `/submissions` - Get all submissions
- GET `/submissions/{id}` - Get submission by ID
- GET `/submissions/task/{taskId}` - Get submissions by task
- GET `/submissions/user/{userId}` - Get submissions by user
- PUT `/submissions/{id}/accept` - Accept submission (Admin only)
- PUT `/submissions/{id}/reject` - Reject submission (Admin only)

## Features

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control (ADMIN/USER)
- Microservices communication via Feign Client
- Service discovery with Eureka
- MySQL database integration
- RESTful API design

## User Roles

- **ADMIN**: Project Manager role - can create, edit, delete tasks, assign tasks, review submissions
- **USER**: Employee role - can view assigned tasks, complete tasks, submit tasks with GitHub links