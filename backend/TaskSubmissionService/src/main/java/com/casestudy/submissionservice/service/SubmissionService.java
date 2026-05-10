package com.casestudy.submissionservice.service;

import com.casestudy.submissionservice.entity.Submission;
import com.casestudy.submissionservice.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubmissionService {
    
    @Autowired
    private SubmissionRepository submissionRepository;
    
    public Submission submitTask(Submission submission) {
        return submissionRepository.save(submission);
    }
    
    public Submission getTaskSubmissionById(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }
    
    public List<Submission> getAllTaskSubmissions() {
        return submissionRepository.findAll();
    }
    
    public List<Submission> getTaskSubmissionsByTaskId(Long taskId) {
        return submissionRepository.findByTaskId(taskId);
    }
    
    public List<Submission> getSubmissionsByUserId(Long userId) {
        return submissionRepository.findByUserId(userId);
    }
    
    public Submission acceptDeclineSubmission(Long submissionId, boolean accept) {
        Submission submission = getTaskSubmissionById(submissionId);
        submission.setStatus(accept ? Submission.SubmissionStatus.ACCEPTED : Submission.SubmissionStatus.REJECTED);
        return submissionRepository.save(submission);
    }
}