package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

import com.turksat.EU_Patent_Registration_Project.core.entities.BaseDTO;

public class UserResponseDTO extends BaseDTO {
    private int userId;
    private int phoneNumberCountryCodeId;
    private int userRoleId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String phoneNumber;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getPhoneNumberCountryCodeId() {
        return phoneNumberCountryCodeId;
    }

    public void setPhoneNumberCountryCodeId(int phoneNumberCountryCodeId) {
        this.phoneNumberCountryCodeId = phoneNumberCountryCodeId;
    }

    public int getUserRoleId() {
        return userRoleId;
    }

    public void setUserRoleId(int userRoleId) {
        this.userRoleId = userRoleId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

}
