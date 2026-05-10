package com.casestudy.submissionservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "user-service", url = "http://localhost:8081")
public interface NotificationClient {
    
    @PostMapping("/notifications/create")
    Map<String, Object> createNotification(@RequestBody Map<String, String> notification);
}