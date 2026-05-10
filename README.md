# Project Manager Case Study

A comprehensive project management system built with microservices architecture, featuring role-based access control for Project Managers (Admin) and Employees (Users).

## 🏗️ Architecture

### Backend (Microservices)
- **EurekaServer** (Port 8761): Service discovery and registration
- **UserService** (Port 8081): Authentication, authorization, and user management
- **TaskService** (Port 8082): Task creation, assignment, and management
- **TaskSubmissionService** (Port 8083): Task submission and review system

### Frontend
- **React.js** application with modern UI components
- Role-based routing and access control
- Responsive design with CSS Grid and Flexbox

## 🚀 Features

### For Project Managers (Admin Role)
- ✅ Create, edit, and delete tasks
- ✅ Assign tasks to multiple employees
- ✅ Review task submissions
- ✅ Accept or reject submissions
- ✅ View all tasks and submissions
- ✅ User management capabilities

### For Employees (User Role)
- ✅ View assigned tasks
- ✅ Complete and submit tasks with GitHub links
- ✅ Track task completion progress
- ✅ View submission status and history

### Security Features
- 🔐 JWT-based authentication
- 🔐 BCrypt password encryption
- 🔐 Role-based access control
- 🔐 Secure API endpoints

## 🛠️ Technology Stack

### Backend
- **Java 21**
- **Spring Boot 3.1.0**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA**
- **Spring Cloud** (Eureka, Feign Client)
- **MySQL 8.0**
- **Maven**

### Frontend
- **React 18**
- **React Router DOM**
- **Axios** (HTTP Client)
- **CSS3** (Grid, Flexbox)

## 📋 Prerequisites

1. **Java 21** or higher
2. **Node.js 16** or higher
3. **Maven 3.6+**
4. **MySQL 8.0+**
5. **Git**

## 🗄️ Database Setup

Create the following MySQL databases:

```sql
CREATE DATABASE caseStudyWithGenAIUser;
CREATE DATABASE caseStudyWithGenAITask;
CREATE DATABASE caseStudyWithGenAISubmission;
```

## 🚀 Installation & Setup

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd MyCaseStudyWithGenAI/backend
```

2. **Start services in order:**

```bash
# Terminal 1 - Start Eureka Server
cd EurekaServer
mvn spring-boot:run

# Terminal 2 - Start User Service (wait for Eureka to start)
cd UserService
mvn spring-boot:run

# Terminal 3 - Start Task Service
cd TaskService
mvn spring-boot:run

# Terminal 4 - Start Task Submission Service
cd TaskSubmissionService
mvn spring-boot:run
```

**Or use the batch file (Windows):**
```bash
cd backend
start-services.bat
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React app will start on `http://localhost:3000`

## 📡 API Endpoints

### UserService (Port 8081)
```
POST /auth/signup          - User registration
POST /auth/login           - User login
POST /auth/logout          - User logout
GET  /users/profile        - Get user profile (JWT required)
GET  /users/{id}           - Get user by ID
GET  /users/all            - Get all users
PUT  /users/complete-task/{userId} - Update completed tasks count
```

### TaskService (Port 8082)
```
POST   /tasks                    - Create task (Admin only)
GET    /tasks                    - Get all tasks
GET    /tasks/{id}               - Get task by ID
PUT    /tasks/{id}               - Update task (Admin only)
DELETE /tasks/{id}               - Delete task (Admin only)
POST   /tasks/{taskId}/assign/{userId} - Assign task to user
GET    /tasks/user/{userId}      - Get user's assigned tasks
POST   /tasks/{taskId}/complete/{userId} - Complete task
```

### TaskSubmissionService (Port 8083)
```
POST /submissions                 - Submit task
GET  /submissions                 - Get all submissions
GET  /submissions/{id}            - Get submission by ID
GET  /submissions/task/{taskId}   - Get submissions by task
GET  /submissions/user/{userId}   - Get submissions by user
PUT  /submissions/{id}/accept     - Accept submission (Admin only)
PUT  /submissions/{id}/reject     - Reject submission (Admin only)
```

## 🎯 Usage Flow

### For Project Managers:
1. **Sign up** with ADMIN role
2. **Login** to access dashboard
3. **Create tasks** with descriptions and technology tags
4. **Assign tasks** to employees
5. **Review submissions** and accept/reject them

### For Employees:
1. **Sign up** with USER role
2. **Login** to view assigned tasks
3. **Complete tasks** and submit with GitHub links
4. **Track progress** and submission status

## 🔧 Configuration

### Database Configuration
Update `application.properties` in each service:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### JWT Configuration
Update JWT secret in UserService:
```properties
jwt.secret=your_secret_key
jwt.expiration=86400000
```

## 🏃‍♂️ Running the Application

1. **Start MySQL** server
2. **Run backend services** (Eureka → User → Task → Submission)
3. **Start React frontend**
4. **Access application** at `http://localhost:3000`

## 📊 Monitoring

- **Eureka Dashboard**: `http://localhost:8761`
- **Service Health**: Check individual service endpoints
- **Database**: Monitor MySQL connections and queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues:

1. **Port conflicts**: Ensure ports 8761, 8081, 8082, 8083, 3000 are available
2. **Database connection**: Verify MySQL is running and databases exist
3. **Service discovery**: Wait for Eureka server to fully start before starting other services
4. **CORS issues**: Backend includes CORS configuration for frontend communication

### Logs:
Check console output for each service to identify specific issues.

## 📞 Support

For support and questions, please create an issue in the repository.

---

**Built with ❤️ using Spring Boot, React, and Microservices Architecture**