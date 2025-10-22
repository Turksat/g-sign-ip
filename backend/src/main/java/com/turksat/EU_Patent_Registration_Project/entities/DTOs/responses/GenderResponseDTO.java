package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

public class GenderResponseDTO {
    private int genderId;
    private String genderName;

    public GenderResponseDTO() {
    }

    public GenderResponseDTO(int genderId, String genderName) {
        this.genderId = genderId;
        this.genderName = genderName;
    }

    public int getGenderId() {
        return genderId;
    }

    public void setGenderId(int genderId) {
        this.genderId = genderId;
    }

    public String getGenderName() {
        return genderName;
    }

    public void setGenderName(String genderName) {
        this.genderName = genderName;
    }
}
