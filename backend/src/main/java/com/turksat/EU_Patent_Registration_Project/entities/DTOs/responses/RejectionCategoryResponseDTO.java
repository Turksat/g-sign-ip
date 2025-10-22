package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

public class RejectionCategoryResponseDTO {
    private int id;
    private String rejection_category_name;

    public RejectionCategoryResponseDTO() {
    }

    public RejectionCategoryResponseDTO(int id, String rejection_category_name) {
        this.id = id;
        this.rejection_category_name = rejection_category_name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRejection_category_name() {
        return rejection_category_name;
    }

    public void setRejection_category_name(String rejection_category_name) {
        this.rejection_category_name = rejection_category_name;
    }
}
