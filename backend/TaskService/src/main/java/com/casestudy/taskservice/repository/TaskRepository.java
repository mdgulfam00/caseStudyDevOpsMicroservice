package com.casestudy.taskservice.repository;

import com.casestudy.taskservice.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("SELECT t FROM Task t WHERE :userId MEMBER OF t.assignedUsers")
    List<Task> findTasksByAssignedUser(@Param("userId") Long userId);
}