package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

public class UserInfoDTO {
    private String username;
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private Integer userId;

    public UserInfoDTO() {
    }

    public UserInfoDTO(String username, String firstName, String middleName, String lastName, String email) {
        this.username = username;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
    }

    public UserInfoDTO(String username, String firstName, String middleName, String lastName, String email, Integer userId) {
        this.username = username;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
        this.userId = userId;
    }

    // Builder pattern
    public static UserInfoDTOBuilder builder() {
        return new UserInfoDTOBuilder();
    }

    public static class UserInfoDTOBuilder {
        private String username;
        private String firstName;
        private String middleName;
        private String lastName;
        private String email;
        private Integer userId;

        public UserInfoDTOBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserInfoDTOBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public UserInfoDTOBuilder middleName(String middleName) {
            this.middleName = middleName;
            return this;
        }

        public UserInfoDTOBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public UserInfoDTOBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserInfoDTOBuilder userId(Integer userId) {
            this.userId = userId;
            return this;
        }

        public UserInfoDTO build() {
            return new UserInfoDTO(username, firstName, middleName, lastName, email, userId);
        }
    }

    // Getter and Setter methods
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
