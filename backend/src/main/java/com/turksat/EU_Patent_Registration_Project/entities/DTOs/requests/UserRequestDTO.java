package com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests;

import com.turksat.EU_Patent_Registration_Project.core.entities.BaseDTO;

public class UserRequestDTO extends BaseDTO {
    private Integer phoneNumberCountryCodeId;
    private String password;
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Integer userRoleId;

    public Integer getPhoneNumberCountryCodeId() {
        return phoneNumberCountryCodeId;
    }

    public void setPhoneNumberCountryCodeId(Integer phoneNumberCountryCodeId) {
        this.phoneNumberCountryCodeId = phoneNumberCountryCodeId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Integer getUserRoleId() {
        return userRoleId;
    }

    public void setUserRoleId(Integer userRoleId) {
        this.userRoleId = userRoleId;
    }
}
