package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

import java.util.List;

public class RetrievedDocumentDTO {
    private int rank;
    private String documentId;
    private String familyId;
    private String title;
    private String abstractText;
    private double relevanceScore;
    private List<String> assignees;
    private List<String> inventors;
    private List<String> cpcCodes;
    private List<String> ipcCodes;
    private List<String> technologyAreas;
    private List<String> technicalTerms;
    private String method;
    private String countryCode;
    private int filingYear;
    private int publicationYear;
    private int priorityYear;
    private boolean isGranted;
    private String metadataSummary;
    private int citationCount;
    private List<String> citationsSample;
    private boolean isValidPriorArt;
    private String temporalRelevance;

    public RetrievedDocumentDTO() {
    }

    public RetrievedDocumentDTO(int rank, String documentId, String familyId, String title, String abstractText,
            double relevanceScore, List<String> assignees, List<String> inventors,
            List<String> cpcCodes, List<String> ipcCodes, List<String> technologyAreas,
            List<String> technicalTerms, String method, String countryCode, int filingYear,
            int publicationYear, int priorityYear, boolean isGranted, String metadataSummary,
            int citationCount, List<String> citationsSample, boolean isValidPriorArt,
            String temporalRelevance) {
        this.rank = rank;
        this.documentId = documentId;
        this.familyId = familyId;
        this.title = title;
        this.abstractText = abstractText;
        this.relevanceScore = relevanceScore;
        this.assignees = assignees;
        this.inventors = inventors;
        this.cpcCodes = cpcCodes;
        this.ipcCodes = ipcCodes;
        this.technologyAreas = technologyAreas;
        this.technicalTerms = technicalTerms;
        this.method = method;
        this.countryCode = countryCode;
        this.filingYear = filingYear;
        this.publicationYear = publicationYear;
        this.priorityYear = priorityYear;
        this.isGranted = isGranted;
        this.metadataSummary = metadataSummary;
        this.citationCount = citationCount;
        this.citationsSample = citationsSample;
        this.isValidPriorArt = isValidPriorArt;
        this.temporalRelevance = temporalRelevance;
    }

    // Getters and Setters
    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getFamilyId() {
        return familyId;
    }

    public void setFamilyId(String familyId) {
        this.familyId = familyId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAbstractText() {
        return abstractText;
    }

    public void setAbstractText(String abstractText) {
        this.abstractText = abstractText;
    }

    public double getRelevanceScore() {
        return relevanceScore;
    }

    public void setRelevanceScore(double relevanceScore) {
        this.relevanceScore = relevanceScore;
    }

    public List<String> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<String> assignees) {
        this.assignees = assignees;
    }

    public List<String> getInventors() {
        return inventors;
    }

    public void setInventors(List<String> inventors) {
        this.inventors = inventors;
    }

    public List<String> getCpcCodes() {
        return cpcCodes;
    }

    public void setCpcCodes(List<String> cpcCodes) {
        this.cpcCodes = cpcCodes;
    }

    public List<String> getIpcCodes() {
        return ipcCodes;
    }

    public void setIpcCodes(List<String> ipcCodes) {
        this.ipcCodes = ipcCodes;
    }

    public List<String> getTechnologyAreas() {
        return technologyAreas;
    }

    public void setTechnologyAreas(List<String> technologyAreas) {
        this.technologyAreas = technologyAreas;
    }

    public List<String> getTechnicalTerms() {
        return technicalTerms;
    }

    public void setTechnicalTerms(List<String> technicalTerms) {
        this.technicalTerms = technicalTerms;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public int getFilingYear() {
        return filingYear;
    }

    public void setFilingYear(int filingYear) {
        this.filingYear = filingYear;
    }

    public int getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(int publicationYear) {
        this.publicationYear = publicationYear;
    }

    public int getPriorityYear() {
        return priorityYear;
    }

    public void setPriorityYear(int priorityYear) {
        this.priorityYear = priorityYear;
    }

    public boolean isGranted() {
        return isGranted;
    }

    public void setGranted(boolean granted) {
        isGranted = granted;
    }

    public String getMetadataSummary() {
        return metadataSummary;
    }

    public void setMetadataSummary(String metadataSummary) {
        this.metadataSummary = metadataSummary;
    }

    public int getCitationCount() {
        return citationCount;
    }

    public void setCitationCount(int citationCount) {
        this.citationCount = citationCount;
    }

    public List<String> getCitationsSample() {
        return citationsSample;
    }

    public void setCitationsSample(List<String> citationsSample) {
        this.citationsSample = citationsSample;
    }

    public boolean isValidPriorArt() {
        return isValidPriorArt;
    }

    public void setValidPriorArt(boolean validPriorArt) {
        isValidPriorArt = validPriorArt;
    }

    public String getTemporalRelevance() {
        return temporalRelevance;
    }

    public void setTemporalRelevance(String temporalRelevance) {
        this.temporalRelevance = temporalRelevance;
    }
}
