package com.casestudy.taskservice.controller;

import com.casestudy.taskservice.entity.Task;
import com.casestudy.taskservice.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        try {
            Task createdTask = taskService.createTask(task);
            return ResponseEntity.ok(createdTask);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }
    
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        Task updatedTask = taskService.updateTask(id, task);
        return ResponseEntity.ok(updatedTask);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }
    
    @PostMapping("/{taskId}/assign/{userId}")
    public ResponseEntity<Task> assignToUser(@PathVariable Long taskId, @PathVariable Long userId) {
        Task task = taskService.assignToUser(taskId, userId);
        return ResponseEntity.ok(task);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getAssignedUserTasks(@PathVariable Long userId) {
        List<Task> tasks = taskService.getAssignedUserTasks(userId);
        return ResponseEntity.ok(tasks);
    }
    
    @PostMapping("/{taskId}/complete/{userId}")
    public ResponseEntity<Task> completeTask(@PathVariable Long taskId, @PathVariable Long userId) {
        Task task = taskService.completeTask(taskId, userId);
        return ResponseEntity.ok(task);
    }
    
    @PutMapping("/{taskId}/status/{status}")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long taskId, @PathVariable String status) {
        Task task = taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok(task);
    }
}