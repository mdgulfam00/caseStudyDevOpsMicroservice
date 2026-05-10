package com.casestudy.userservice.controller;

import com.casestudy.userservice.entity.User;
import com.casestudy.userservice.entity.Notification;
import com.casestudy.userservice.service.UserService;
import com.casestudy.userservice.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User savedUser = userService.signup(user);
            
            // Create notification for admin when new user registers
            if (savedUser.getRole() == User.Role.USER) {
                System.out.println("Creating notification for new user: " + savedUser.getFullName());
                Notification notification = new Notification(
                    "New user registered: " + savedUser.getFullName() + " (" + savedUser.getEmail() + ")",
                    "USER_REGISTRATION"
                );
                Notification saved = notificationRepository.save(notification);
                System.out.println("Notification saved with ID: " + saved.getId());
            }
            
            return ResponseEntity.ok(Map.of("message", "User registered successfully", "user", savedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            String token = userService.login(email, password);
            User user = userService.findUserByEmail(email);
            return ResponseEntity.ok(Map.of("token", token, "user", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}