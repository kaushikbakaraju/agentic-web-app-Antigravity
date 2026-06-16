package com.antigravity.agenticapp.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AgentController.class)
class AgentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getStatus_ShouldReturnWorkspaceDetails() throws Exception {
        mockMvc.perform(get("/api/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.agentName", is("Antigravity-Agent-v1")))
                .andExpect(jsonPath("$.status", is("ACTIVE")))
                .andExpect(jsonPath("$.version", is("1.0.0")))
                .andExpect(jsonPath("$.engine", is("Gemini 3.5 Flash")));
    }

    @Test
    void getTasks_ShouldReturnTaskList() throws Exception {
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$[0].id", is("T-101")))
                .andExpect(jsonPath("$[0].status", is("COMPLETED")));
    }
}
