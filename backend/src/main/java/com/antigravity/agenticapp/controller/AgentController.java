package com.antigravity.agenticapp.controller;

import com.antigravity.agenticapp.model.AgentTask;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentController {

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("agentName", "Antigravity-Agent-v1");
        response.put("status", "ACTIVE");
        response.put("version", "1.0.0");
        response.put("engine", "Gemini 3.5 Flash");
        response.put("systemTime", LocalDateTime.now().format(formatter));
        response.put("activeTasksCount", 2);
        response.put("completedTasksCount", 14);
        return response;
    }

    @GetMapping("/tasks")
    public List<AgentTask> getTasks() {
        return Arrays.asList(
                new AgentTask("T-101", "Initialize workspace project structure", "COMPLETED", 100, LocalDateTime.now().minusHours(2).format(formatter)),
                new AgentTask("T-102", "Configure Vite and Vitest for React frontend", "RUNNING", 75, LocalDateTime.now().minusMinutes(15).format(formatter)),
                new AgentTask("T-103", "Build Spring Boot Maven project with REST APIs", "RUNNING", 40, LocalDateTime.now().minusMinutes(5).format(formatter)),
                new AgentTask("T-104", "Setup CI/CD and deployment workflows", "PENDING", 0, LocalDateTime.now().format(formatter))
        );
    }
}
