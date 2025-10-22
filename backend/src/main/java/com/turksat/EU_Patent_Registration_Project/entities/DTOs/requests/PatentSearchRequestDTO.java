package com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests;

import java.time.LocalDate;

public class PatentSearchRequestDTO {

    private String searchType; // "basic" or "advanced"

    // Basic Search Parameters
    private String patentNumber;

    // Advanced Search Parameters
    private String keyword;
    private String title;
    private String applicantInventor;
    private String countryCode;
    private String patentClassificationId;
    private LocalDate publicationStartDate;
    private LocalDate publicationEndDate;

    // Pagination Parameters
    private Integer page = 1;
    private Integer size = 10;

    // Default constructor
    public PatentSearchRequestDTO() {
    }

    // Constructor with all parameters
    public PatentSearchRequestDTO(String searchType, String patentNumber, String keyword,
            String title, String applicantInventor, String countryCode,
            String patentClassificationId, LocalDate publicationStartDate,
            LocalDate publicationEndDate, Integer page, Integer size) {
        this.searchType = searchType;
        this.patentNumber = patentNumber;
        this.keyword = keyword;
        this.title = title;
        this.applicantInventor = applicantInventor;
        this.countryCode = countryCode;
        this.patentClassificationId = patentClassificationId;
        this.publicationStartDate = publicationStartDate;
        this.publicationEndDate = publicationEndDate;
        this.page = page != null ? page : 1;
        this.size = size != null ? size : 10;
    }

    // Getters and Setters
    public String getSearchType() {
        return searchType;
    }

    public void setSearchType(String searchType) {
        this.searchType = searchType;
    }

    public String getPatentNumber() {
        return patentNumber;
    }

    public void setPatentNumber(String patentNumber) {
        this.patentNumber = patentNumber;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getApplicantInventor() {
        return applicantInventor;
    }

    public void setApplicantInventor(String applicantInventor) {
        this.applicantInventor = applicantInventor;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getPatentClassificationId() {
        return patentClassificationId;
    }

    public void setPatentClassificationId(String patentClassificationId) {
        this.patentClassificationId = patentClassificationId;
    }

    public LocalDate getPublicationStartDate() {
        return publicationStartDate;
    }

    public void setPublicationStartDate(LocalDate publicationStartDate) {
        this.publicationStartDate = publicationStartDate;
    }

    public LocalDate getPublicationEndDate() {
        return publicationEndDate;
    }

    public void setPublicationEndDate(LocalDate publicationEndDate) {
        this.publicationEndDate = publicationEndDate;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page != null ? page : 1;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size != null ? size : 10;
    }

    @Override
    public String toString() {
        return "PatentSearchRequestDTO{" +
                "searchType='" + searchType + '\'' +
                ", patentNumber='" + patentNumber + '\'' +
                ", keyword='" + keyword + '\'' +
                ", title='" + title + '\'' +
                ", applicantInventor='" + applicantInventor + '\'' +
                ", countryCode='" + countryCode + '\'' +
                ", patentClassificationId='" + patentClassificationId + '\'' +
                ", publicationStartDate=" + publicationStartDate +
                ", publicationEndDate=" + publicationEndDate +
                ", page=" + page +
                ", size=" + size +
                '}';
    }
}
