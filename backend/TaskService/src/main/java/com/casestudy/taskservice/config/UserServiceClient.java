package com.casestudy.taskservice.config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "user-service")
public interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    Object getUserById(@PathVariable Long id);
    
    @PutMapping("/users/complete-task/{userId}")
    Object updateCompletedTasks(@PathVariable Long userId);
}