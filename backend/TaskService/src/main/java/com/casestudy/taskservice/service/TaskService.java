package com.casestudy.taskservice.service;

import com.casestudy.taskservice.entity.Task;
import com.casestudy.taskservice.repository.TaskRepository;
import com.casestudy.taskservice.config.UserServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }
    
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }
    
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);
        task.setName(taskDetails.getName());
        task.setDescription(taskDetails.getDescription());
        task.setProfileImage(taskDetails.getProfileImage());
        task.setTags(taskDetails.getTags());
        return taskRepository.save(task);
    }
    
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
    
    public Task assignToUser(Long taskId, Long userId) {
        Task task = getTaskById(taskId);
        if (!task.getAssignedUsers().contains(userId)) {
            task.getAssignedUsers().add(userId);
            task.setStatus(Task.TaskStatus.ASSIGNED);
        }
        return taskRepository.save(task);
    }
    
    public List<Task> getAssignedUserTasks(Long userId) {
        return taskRepository.findTasksByAssignedUser(userId);
    }
    
    public Task completeTask(Long taskId, Long userId) {
        Task task = getTaskById(taskId);
        if (task.getAssignedUsers().contains(userId)) {
            task.setStatus(Task.TaskStatus.DONE);
            userServiceClient.updateCompletedTasks(userId);
            return taskRepository.save(task);
        }
        throw new RuntimeException("User not assigned to this task");
    }
    
    public Task updateTaskStatus(Long taskId, String status) {
        Task task = getTaskById(taskId);
        task.setStatus(Task.TaskStatus.valueOf(status.toUpperCase()));
        return taskRepository.save(task);
    }
}