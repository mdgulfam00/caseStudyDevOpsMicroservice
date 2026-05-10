package com.casestudy.userservice.controller;

import com.casestudy.userservice.entity.Notification;
import com.casestudy.userservice.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @GetMapping
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        List<Notification> notifications = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        long count = notificationRepository.countByIsReadFalse();
        System.out.println("Unread notification count: " + count);
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }
    
    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        List<Notification> notifications = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
    
    @PostMapping("/test")
    public ResponseEntity<?> createTestNotification() {
        Notification notification = new Notification("Test notification", "TEST");
        notificationRepository.save(notification);
        return ResponseEntity.ok(Map.of("message", "Test notification created"));
    }
    
    @GetMapping("/public/count")
    public ResponseEntity<Map<String, Long>> getPublicUnreadCount() {
        long count = notificationRepository.countByIsReadFalse();
        System.out.println("Public unread notification count: " + count);
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody Map<String, String> request) {
        Notification notification = new Notification(request.get("message"), request.get("type"));
        notificationRepository.save(notification);
        return ResponseEntity.ok(Map.of("message", "Notification created"));
    }
}