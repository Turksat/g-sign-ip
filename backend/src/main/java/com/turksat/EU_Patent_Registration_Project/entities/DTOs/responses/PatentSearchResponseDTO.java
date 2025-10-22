package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

import java.time.LocalDate;
import java.util.List;

public class PatentSearchResponseDTO {

    private Integer totalRecords;
    private Integer currentPage;
    private Integer totalPages;
    private Integer pageSize;
    private List<PatentResultDTO> patents;

    // Default constructor
    public PatentSearchResponseDTO() {
    }

    // Constructor with all parameters
    public PatentSearchResponseDTO(Integer totalRecords, Integer currentPage,
            Integer totalPages, Integer pageSize,
            List<PatentResultDTO> patents) {
        this.totalRecords = totalRecords;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.pageSize = pageSize;
        this.patents = patents;
    }

    // Getters and Setters
    public Integer getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(Integer totalRecords) {
        this.totalRecords = totalRecords;
    }

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }

    public Integer getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public List<PatentResultDTO> getPatents() {
        return patents;
    }

    public void setPatents(List<PatentResultDTO> patents) {
        this.patents = patents;
    }

    // Inner class for individual patent results
    public static class PatentResultDTO {
        private String id;
        private String patentNumber;
        private String title;
        private String applicant;
        private String inventor;
        private String country;
        private String countryCode;
        private LocalDate publicationDate;
        private String status;
        private String classification;
        private String abstractText;
        private String priority;
        private Double likelihood;

        // Default constructor
        public PatentResultDTO() {
        }

        // Constructor with all parameters
        public PatentResultDTO(String id, String patentNumber, String title,
                String applicant, String inventor, String country,
                String countryCode, LocalDate publicationDate, String status,
                String classification, String abstractText, String priority,
                Double likelihood) {
            this.id = id;
            this.patentNumber = patentNumber;
            this.title = title;
            this.applicant = applicant;
            this.inventor = inventor;
            this.country = country;
            this.countryCode = countryCode;
            this.publicationDate = publicationDate;
            this.status = status;
            this.classification = classification;
            this.abstractText = abstractText;
            this.priority = priority;
            this.likelihood = likelihood;
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getPatentNumber() {
            return patentNumber;
        }

        public void setPatentNumber(String patentNumber) {
            this.patentNumber = patentNumber;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getApplicant() {
            return applicant;
        }

        public void setApplicant(String applicant) {
            this.applicant = applicant;
        }

        public String getInventor() {
            return inventor;
        }

        public void setInventor(String inventor) {
            this.inventor = inventor;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getCountryCode() {
            return countryCode;
        }

        public void setCountryCode(String countryCode) {
            this.countryCode = countryCode;
        }

        public LocalDate getPublicationDate() {
            return publicationDate;
        }

        public void setPublicationDate(LocalDate publicationDate) {
            this.publicationDate = publicationDate;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getClassification() {
            return classification;
        }

        public void setClassification(String classification) {
            this.classification = classification;
        }

        public String getAbstractText() {
            return abstractText;
        }

        public void setAbstractText(String abstractText) {
            this.abstractText = abstractText;
        }

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }

        public Double getLikelihood() {
            return likelihood;
        }

        public void setLikelihood(Double likelihood) {
            this.likelihood = likelihood;
        }

        @Override
        public String toString() {
            return "PatentResultDTO{" +
                    "id='" + id + '\'' +
                    ", patentNumber='" + patentNumber + '\'' +
                    ", title='" + title + '\'' +
                    ", applicant='" + applicant + '\'' +
                    ", inventor='" + inventor + '\'' +
                    ", country='" + country + '\'' +
                    ", countryCode='" + countryCode + '\'' +
                    ", publicationDate=" + publicationDate +
                    ", status='" + status + '\'' +
                    ", classification='" + classification + '\'' +
                    ", abstractText='" + abstractText + '\'' +
                    ", priority='" + priority + '\'' +
                    ", likelihood=" + likelihood +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "PatentSearchResponseDTO{" +
                "totalRecords=" + totalRecords +
                ", currentPage=" + currentPage +
                ", totalPages=" + totalPages +
                ", pageSize=" + pageSize +
                ", patents=" + patents +
                '}';
    }
}
