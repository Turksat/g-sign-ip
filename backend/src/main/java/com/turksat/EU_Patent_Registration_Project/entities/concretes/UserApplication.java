package com.turksat.EU_Patent_Registration_Project.entities.concretes;

import java.time.OffsetDateTime;

public class UserApplication {
    private String applicationNo;
    private String titleOfInvention;
    private String applicationType;
    private OffsetDateTime applicationDate;
    private String description;
    private String applicationStatus;
    private int applicationStatusId;
    private String applicantName; // Added for consistency

    public String getApplicationNo() {
        return applicationNo;
    }

    public void setApplicationNo(String applicationNo) {
        this.applicationNo = applicationNo;
    }

    public String getTitleOfInvention() {
        return titleOfInvention;
    }

    public void setTitleOfInvention(String titleOfInvention) {
        this.titleOfInvention = titleOfInvention;
    }

    public String getApplicationType() {
        return applicationType;
    }

    public void setApplicationType(String applicationType) {
        this.applicationType = applicationType;
    }

    public OffsetDateTime getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(OffsetDateTime applicationDate) {
        this.applicationDate = applicationDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(String applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public int getApplicationStatusId() {
        return applicationStatusId;
    }

    public void setApplicationStatusId(int applicationStatusId) {
        this.applicationStatusId = applicationStatusId;
    }

    // Alias getters and setters for consistency
    public String getApplicationNumber() {
        return applicationNo;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNo = applicationNumber; // Keep both in sync
    }

    public String getTitle() {
        return titleOfInvention;
    }

    public void setTitle(String title) {
        this.titleOfInvention = title; // Keep both in sync
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }
}
