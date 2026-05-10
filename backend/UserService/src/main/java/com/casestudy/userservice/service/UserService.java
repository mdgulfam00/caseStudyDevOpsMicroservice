package com.casestudy.userservice.service;

import com.casestudy.userservice.entity.User;
import com.casestudy.userservice.repository.UserRepository;
import com.casestudy.userservice.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public User signup(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return jwtUtil.generateToken(email);
        }
        throw new RuntimeException("Invalid credentials");
    }
    
    public User findUserProfileByJwt(String jwt) {
        String email = jwtUtil.getEmailFromToken(jwt);
        return findUserByEmail(email);
    }
    
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    public User updateCompletedTasks(Long userId) {
        User user = findUserById(userId);
        user.setCompletedTasks(user.getCompletedTasks() + 1);
        return userRepository.save(user);
    }
}