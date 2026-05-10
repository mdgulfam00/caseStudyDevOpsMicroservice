package com.casestudy.submissionservice.controller;

import com.casestudy.submissionservice.entity.Submission;
import com.casestudy.submissionservice.service.SubmissionService;
import com.casestudy.submissionservice.client.NotificationClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {
    
    @Autowired
    private SubmissionService submissionService;
    
    @Autowired
    private NotificationClient notificationClient;
    
    @PostMapping
    public ResponseEntity<Submission> submitTask(@RequestBody Submission submission) {
        Submission createdSubmission = submissionService.submitTask(submission);
        
        // Create notification for admin
        try {
            notificationClient.createNotification(Map.of(
                "message", "New task submission from User ID: " + createdSubmission.getUserId() + " for Task ID: " + createdSubmission.getTaskId(),
                "type", "TASK_SUBMISSION"
            ));
        } catch (Exception e) {
            System.out.println("Failed to create notification: " + e.getMessage());
        }
        
        return ResponseEntity.ok(createdSubmission);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Submission> getTaskSubmissionById(@PathVariable Long id) {
        Submission submission = submissionService.getTaskSubmissionById(id);
        return ResponseEntity.ok(submission);
    }
    
    @GetMapping
    public ResponseEntity<List<Submission>> getAllTaskSubmissions() {
        List<Submission> submissions = submissionService.getAllTaskSubmissions();
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Submission>> getTaskSubmissionsByTaskId(@PathVariable Long taskId) {
        List<Submission> submissions = submissionService.getTaskSubmissionsByTaskId(taskId);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Submission>> getSubmissionsByUserId(@PathVariable Long userId) {
        List<Submission> submissions = submissionService.getSubmissionsByUserId(userId);
        return ResponseEntity.ok(submissions);
    }
    
    @PutMapping("/{submissionId}/accept")
    public ResponseEntity<Submission> acceptSubmission(@PathVariable Long submissionId) {
        Submission submission = submissionService.acceptDeclineSubmission(submissionId, true);
        return ResponseEntity.ok(submission);
    }
    
    @PutMapping("/{submissionId}/reject")
    public ResponseEntity<Submission> rejectSubmission(@PathVariable Long submissionId) {
        Submission submission = submissionService.acceptDeclineSubmission(submissionId, false);
        return ResponseEntity.ok(submission);
    }
}