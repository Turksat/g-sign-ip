package com.turksat.EU_Patent_Registration_Project.entities.concretes;

public class Gender {
    private int genderId;
    private String genderName;

    public Gender() {
    }

    public Gender(int genderId, String genderName) {
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
