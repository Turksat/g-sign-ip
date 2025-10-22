package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

import java.time.LocalDate;

public class AdminDashboardStatsResponseDTO {
    private int submissionsStarted;
    private int submissionsAssigned;
    private int submissionsCompleted;
    private LocalDate month;
    private String monthName;

    public AdminDashboardStatsResponseDTO() {
    }

    public AdminDashboardStatsResponseDTO(int submissionsStarted, int submissionsAssigned, int submissionsCompleted,
            LocalDate month, String monthName) {
        this.submissionsStarted = submissionsStarted;
        this.submissionsAssigned = submissionsAssigned;
        this.submissionsCompleted = submissionsCompleted;
        this.month = month;
        this.monthName = monthName;
    }

    public int getSubmissionsStarted() {
        return submissionsStarted;
    }

    public void setSubmissionsStarted(int submissionsStarted) {
        this.submissionsStarted = submissionsStarted;
    }

    public int getSubmissionsAssigned() {
        return submissionsAssigned;
    }

    public void setSubmissionsAssigned(int submissionsAssigned) {
        this.submissionsAssigned = submissionsAssigned;
    }

    public int getSubmissionsCompleted() {
        return submissionsCompleted;
    }

    public void setSubmissionsCompleted(int submissionsCompleted) {
        this.submissionsCompleted = submissionsCompleted;
    }

    public LocalDate getMonth() {
        return month;
    }

    public void setMonth(LocalDate month) {
        this.month = month;
    }

    public String getMonthName() {
        return monthName;
    }

    public void setMonthName(String monthName) {
        this.monthName = monthName;
    }
}
