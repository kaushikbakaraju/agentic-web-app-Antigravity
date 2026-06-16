package com.antigravity.agenticapp.model;

public class AgentTask {
    private String id;
    private String title;
    private String status; // PENDING, RUNNING, COMPLETED, FAILED
    private int progress; // 0 to 100
    private String lastUpdated;

    public AgentTask() {}

    public AgentTask(String id, String title, String status, int progress, String lastUpdated) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.progress = progress;
        this.lastUpdated = lastUpdated;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
}
