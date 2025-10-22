package com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests;

import java.util.List;

public class ApplicationUpdateStage2RequestDTO {
    private Integer applicationTypeId;
    private String titleOfInvention;
    private String inventionSummary;
    private List<Integer> patentClassificationId;
    private Boolean geographicalOrigin;
    private Boolean governmentFunded;

    public Integer getApplicationTypeId() {
        return applicationTypeId;
    }

    public void setApplicationTypeId(Integer applicationTypeId) {
        this.applicationTypeId = applicationTypeId;
    }

    public String getTitleOfInvention() {
        return titleOfInvention;
    }

    public void setTitleOfInvention(String titleOfInvention) {
        this.titleOfInvention = titleOfInvention;
    }

    public String getInventionSummary() {
        return inventionSummary;
    }

    public void setInventionSummary(String inventionSummary) {
        this.inventionSummary = inventionSummary;
    }

    public List<Integer> getPatentClassificationId() {
        return patentClassificationId;
    }

    public void setPatentClassificationId(List<Integer> patentClassificationId) {
        this.patentClassificationId = patentClassificationId;
    }

    public Boolean isGeographicalOrigin() {
        return geographicalOrigin;
    }

    public void setGeographicalOrigin(Boolean geographicalOrigin) {
        this.geographicalOrigin = geographicalOrigin;
    }

    public Boolean isGovernmentFunded() {
        return governmentFunded;
    }

    public void setGovernmentFunded(Boolean governmentFunded) {
        this.governmentFunded = governmentFunded;
    }
}
