package com.turksat.EU_Patent_Registration_Project.entities.concretes;

public class RejectionCategory {
    private int id;
    private String rejectionCategoryName;

    public RejectionCategory() {
    }

    public RejectionCategory(int id, String rejectionCategoryName) {
        this.id = id;
        this.rejectionCategoryName = rejectionCategoryName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRejectionCategoryName() {
        return rejectionCategoryName;
    }

    public void setRejectionCategoryName(String rejectionCategoryName) {
        this.rejectionCategoryName = rejectionCategoryName;
    }
}
