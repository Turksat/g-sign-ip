package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

public class FeedbackCategoryResponseDTO {
    private int id;
    private String feedbackCategoryDescription;

    // Default constructor
    public FeedbackCategoryResponseDTO() {
    }

    // Constructor with parameters
    public FeedbackCategoryResponseDTO(int id, String feedbackCategoryDescription) {
        this.id = id;
        this.feedbackCategoryDescription = feedbackCategoryDescription;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFeedbackCategoryDescription() {
        return feedbackCategoryDescription;
    }

    public void setFeedbackCategoryDescription(String feedbackCategoryDescription) {
        this.feedbackCategoryDescription = feedbackCategoryDescription;
    }

    @Override
    public String toString() {
        return "FeedbackCategoryResponseDTO{" +
                "id=" + id +
                ", feedbackCategoryDescription='" + feedbackCategoryDescription + '\'' +
                '}';
    }
}
