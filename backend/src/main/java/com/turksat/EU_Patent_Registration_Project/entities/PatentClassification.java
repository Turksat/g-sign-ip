package com.turksat.EU_Patent_Registration_Project.entities;

public class PatentClassification {
    private Integer patentClassificationId;
    private String name;

    public PatentClassification() {
    }

    public PatentClassification(Integer patentClassificationId, String name) {
        this.patentClassificationId = patentClassificationId;
        this.name = name;
    }

    public Integer getPatentClassificationId() {
        return patentClassificationId;
    }

    public void setPatentClassificationId(Integer patentClassificationId) {
        this.patentClassificationId = patentClassificationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
