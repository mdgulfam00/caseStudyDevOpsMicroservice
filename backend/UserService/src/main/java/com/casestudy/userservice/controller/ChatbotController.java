package com.casestudy.userservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {
    
    private final String AZURE_ENDPOINT = "https://ecommerceassistance.openai.azure.com/";
    private final String API_KEY = "k51OjY35kOujFxUT6cGYRRbvBegjT9SW9Z6vfNptc4fREVsnS5xMJQQJ99BJACHYHv6XJ3w3AAABACOGcA7b";
    private final String DEPLOYMENT_NAME = "gpt-4";
    
    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askQuestion(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        
        try {
            String answer = callAzureOpenAI(question);
            return ResponseEntity.ok(Map.of("answer", answer));
        } catch (Exception e) {
            String fallbackAnswer = getNavigationHelp(question.toLowerCase());
            return ResponseEntity.ok(Map.of("answer", fallbackAnswer));
        }
    }
    
    private String callAzureOpenAI(String question) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", API_KEY);
        headers.set("Content-Type", "application/json");
        
        String systemPrompt = "You are a helpful assistant for a Project Management System website. " +
            "Help users navigate and use the website features. The system includes: " +
            "Login/Signup, Dashboard (shows assigned tasks for employees, all tasks for admins), " +
            "Create Task page (admin only), Task List, Submissions page, Profile menu, " +
            "Notification bell (admin only), Theme toggle. Keep responses concise and helpful.";
        
        Map<String, Object> requestBody = Map.of(
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", question)
            ),
            "max_tokens", 150,
            "temperature", 0.7
        );
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        String url = AZURE_ENDPOINT + "/openai/deployments/" + DEPLOYMENT_NAME + "/chat/completions?api-version=2024-02-15-preview";
        
        Map<String, Object> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class).getBody();
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        
        return (String) message.get("content");
    }
    
    private String getNavigationHelp(String question) {
        if (question.contains("login") || question.contains("sign in")) {
            return "To login, click the Login button on the homepage and enter your email and password.";
        } else if (question.contains("task") && question.contains("create")) {
            return "To create a task, go to 'Create Task' in the navigation menu (admin only).";
        } else if (question.contains("dashboard")) {
            return "The Dashboard shows your assigned tasks (employees) or all tasks (admins). It's the main page after login.";
        } else if (question.contains("submission")) {
            return "View task submissions in the 'Submissions' page from the navigation menu.";
        } else if (question.contains("profile")) {
            return "Click your profile icon in the top-right corner to view your profile or logout.";
        } else if (question.contains("notification")) {
            return "Admins can see notifications (new users, task submissions) by clicking the bell icon next to the profile.";
        } else {
            return "I can help you navigate the Project Management System. Ask me about login, creating tasks, dashboard, submissions, or your profile!";
        }
    }
}