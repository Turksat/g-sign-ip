package com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests;

public class SendFeedbackRequestDTO {
    private String applicationNo;
    private String remarks;
    private String description;
    private int[] feedbackCategories;

    public SendFeedbackRequestDTO() {
    }

    public SendFeedbackRequestDTO(String applicationNo, String remarks, String description, int[] feedbackCategories) {
        this.applicationNo = applicationNo;
        this.remarks = remarks;
        this.description = description;
        this.feedbackCategories = feedbackCategories;
    }

    public String getApplicationNo() {
        return applicationNo;
    }

    public void setApplicationNo(String applicationNo) {
        this.applicationNo = applicationNo;
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
}
