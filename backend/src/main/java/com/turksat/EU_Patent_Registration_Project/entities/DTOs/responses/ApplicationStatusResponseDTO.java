package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

public class ApplicationStatusResponseDTO {
    private String statusName;
    private String description;

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
