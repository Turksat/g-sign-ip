package com.turksat.EU_Patent_Registration_Project.entities;

public class ApplicationType {
    private Integer applicationTypeId;
    private String applicationTypeName;

    public ApplicationType() {
    }

    public ApplicationType(Integer applicationTypeId, String applicationTypeName) {
        this.applicationTypeId = applicationTypeId;
        this.applicationTypeName = applicationTypeName;
    }

    public Integer getApplicationTypeId() {
        return applicationTypeId;
    }

    public void setApplicationTypeId(Integer applicationTypeId) {
        this.applicationTypeId = applicationTypeId;
    }

    public String getApplicationTypeName() {
        return applicationTypeName;
    }

    public void setApplicationTypeName(String applicationTypeName) {
        this.applicationTypeName = applicationTypeName;
    }
}
