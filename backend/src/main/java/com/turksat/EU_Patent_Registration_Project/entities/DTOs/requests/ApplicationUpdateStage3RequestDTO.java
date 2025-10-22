package com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests;

import com.turksat.EU_Patent_Registration_Project.entities.concretes.ApplicationDocument;
import java.math.BigDecimal;
import java.util.List;

public class ApplicationUpdateStage3RequestDTO {
    //file part
    private List<ApplicationDocument> claims;
    private List<ApplicationDocument> abstractOfTheDisclosures;
    private List<ApplicationDocument> drawings;
    private List<ApplicationDocument> supportingDocuments;
    //likelihood part
    private BigDecimal likelihood;

    public List<ApplicationDocument> getClaims() {
        return claims;
    }

    public void setClaims(List<ApplicationDocument> claims) {
        this.claims = claims;
    }

    public List<ApplicationDocument> getAbstractOfTheDisclosures() {
        return abstractOfTheDisclosures;
    }

    public void setAbstractOfTheDisclosures(List<ApplicationDocument> abstractOfTheDisclosures) {
        this.abstractOfTheDisclosures = abstractOfTheDisclosures;
    }

    public List<ApplicationDocument> getDrawings() {
        return drawings;
    }

    public void setDrawings(List<ApplicationDocument> drawings) {
        this.drawings = drawings;
    }

    public List<ApplicationDocument> getSupportingDocuments() {
        return supportingDocuments;
    }

    public void setSupportingDocuments(List<ApplicationDocument> supportingDocuments) {
        this.supportingDocuments = supportingDocuments;
    }

    public BigDecimal getLikelihood() {
        return likelihood;
    }

    public void setLikelihood(BigDecimal likelihood) {
        this.likelihood = likelihood;
    }
}
