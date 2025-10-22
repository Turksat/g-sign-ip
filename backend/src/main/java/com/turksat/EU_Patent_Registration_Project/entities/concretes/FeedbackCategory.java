package com.turksat.EU_Patent_Registration_Project.entities.concretes;

public class FeedbackCategory {
    private int id;
    private String feedbackCategoryDescription;

    // Default constructor
    public FeedbackCategory() {
    }

    // Constructor with parameters
    public FeedbackCategory(int id, String feedbackCategoryDescription) {
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
        return "FeedbackCategory{" +
                "id=" + id +
                ", feedbackCategoryDescription='" + feedbackCategoryDescription + '\'' +
                '}';
    }
}
