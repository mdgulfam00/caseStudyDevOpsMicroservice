@echo off
echo Starting Project Manager Microservices...

echo Starting Eureka Server...
start cmd /k "cd EurekaServer && mvn spring-boot:run"
timeout /t 30

echo Starting User Service...
start cmd /k "cd UserService && mvn spring-boot:run"
timeout /t 15

echo Starting Task Service...
start cmd /k "cd TaskService && mvn spring-boot:run"
timeout /t 15

echo Starting Task Submission Service...
start cmd /k "cd TaskSubmissionService && mvn spring-boot:run"

echo All services are starting up...
echo Check Eureka Dashboard at: http://localhost:8761
pause