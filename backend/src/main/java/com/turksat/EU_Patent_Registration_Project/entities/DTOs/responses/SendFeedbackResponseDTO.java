package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

import java.time.OffsetDateTime;

public class SendFeedbackResponseDTO {
    private int id;
    private String remarks;
    private String description;
    private int[] feedbackCategories;
    private String applicationNo;
    private String fileName;
    private String fileExtension;
    private int feedbackType;
    private OffsetDateTime createdAt;

    public SendFeedbackResponseDTO() {
    }

    public SendFeedbackResponseDTO(int id, String remarks, String description, int[] feedbackCategories,
            String applicationNo, String fileName, String fileExtension,
            int feedbackType, OffsetDateTime createdAt) {
        this.id = id;
        this.remarks = remarks;
        this.description = description;
        this.feedbackCategories = feedbackCategories;
        this.applicationNo = applicationNo;
        this.fileName = fileName;
        this.fileExtension = fileExtension;
        this.feedbackType = feedbackType;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int[] getFeedbackCategories() {
        return feedbackCategories;
    }

    public void setFeedbackCategories(int[] feedbackCategories) {
        this.feedbackCategories = feedbackCategories;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getApplicationNo() {
        return applicationNo;
    }

    public void setApplicationNo(String applicationNo) {
        this.applicationNo = applicationNo;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileExtension() {
        return fileExtension;
    }

    public void setFileExtension(String fileExtension) {
        this.fileExtension = fileExtension;
    }

    public int getFeedbackType() {
        return feedbackType;
    }

    public void setFeedbackType(int feedbackType) {
        this.feedbackType = feedbackType;
    }
}
