package com.casestudy.taskservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    private String profileImage;
    
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PENDING;
    
    private LocalDateTime creationTime = LocalDateTime.now();
    
    @ElementCollection
    private List<Long> assignedUsers;
    
    @ElementCollection
    private List<String> tags;

    public enum TaskStatus {
        PENDING, ASSIGNED, DONE, REJECTED
    }

    // Constructors
    public Task() {}

    public Task(String name, String description, String profileImage, List<String> tags) {
        this.name = name;
        this.description = description;
        this.profileImage = profileImage;
        this.tags = tags;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public LocalDateTime getCreationTime() { return creationTime; }
    public void setCreationTime(LocalDateTime creationTime) { this.creationTime = creationTime; }

    public List<Long> getAssignedUsers() { return assignedUsers; }
    public void setAssignedUsers(List<Long> assignedUsers) { this.assignedUsers = assignedUsers; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}