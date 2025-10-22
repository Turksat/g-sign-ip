package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

import java.time.LocalDate;
import java.util.List;

public class ApplicationFilterResponseDTO {
    private List<FilteredApplicationDTO> applications;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int size;
    private boolean hasNext;
    private boolean hasPrevious;

    public ApplicationFilterResponseDTO() {
    }

    public ApplicationFilterResponseDTO(List<FilteredApplicationDTO> applications) {
        this.applications = applications;
    }

    public List<FilteredApplicationDTO> getApplications() {
        return applications;
    }

    public void setApplications(List<FilteredApplicationDTO> applications) {
        this.applications = applications;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public boolean isHasNext() {
        return hasNext;
    }

    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }

    public boolean isHasPrevious() {
        return hasPrevious;
    }

    public void setHasPrevious(boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }

    public static class FilteredApplicationDTO {
        private String applicationNumber;
        private String applicantName;
        private String title;
        private LocalDate applicationDate;
        private int applicationStatusId;

        public FilteredApplicationDTO() {
        }

        public FilteredApplicationDTO(String applicationNumber, String applicantName,
                String title, LocalDate applicationDate, int applicationStatusId) {
            this.applicationNumber = applicationNumber;
            this.applicantName = applicantName;
            this.title = title;
            this.applicationDate = applicationDate;
            this.applicationStatusId = applicationStatusId;
        }

        public String getApplicationNumber() {
            return applicationNumber;
        }

        public void setApplicationNumber(String applicationNumber) {
            this.applicationNumber = applicationNumber;
        }

        public String getApplicantName() {
            return applicantName;
        }

        public void setApplicantName(String applicantName) {
            this.applicantName = applicantName;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public LocalDate getApplicationDate() {
            return applicationDate;
        }

        public void setApplicationDate(LocalDate applicationDate) {
            this.applicationDate = applicationDate;
        }

        public int getApplicationStatusId() {
            return applicationStatusId;
        }

        public void setApplicationStatusId(int applicationStatusId) {
            this.applicationStatusId = applicationStatusId;
        }
    }
}
