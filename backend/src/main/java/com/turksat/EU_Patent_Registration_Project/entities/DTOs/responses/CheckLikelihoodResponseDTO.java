package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

import java.math.BigDecimal;
import java.util.List;

public class CheckLikelihoodResponseDTO {
    private BigDecimal likelihood;
    private String analysis;
    private List<RetrievedDocumentDTO> retrievedDocuments;
    private String message;
    private boolean success;
    private long processingTimeMs;

    public CheckLikelihoodResponseDTO() {
    }

    public CheckLikelihoodResponseDTO(BigDecimal likelihood, String analysis,
            List<RetrievedDocumentDTO> retrievedDocuments, String message, boolean success, long processingTimeMs) {
        this.likelihood = likelihood;
        this.analysis = analysis;
        this.retrievedDocuments = retrievedDocuments;
        this.message = message;
        this.success = success;
        this.processingTimeMs = processingTimeMs;
    }

    public BigDecimal getLikelihood() {
        return likelihood;
    }

    public void setLikelihood(BigDecimal likelihood) {
        this.likelihood = likelihood;
    }

    public String getAnalysis() {
        return analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }

    public List<RetrievedDocumentDTO> getRetrievedDocuments() {
        return retrievedDocuments;
    }

    public void setRetrievedDocuments(List<RetrievedDocumentDTO> retrievedDocuments) {
        this.retrievedDocuments = retrievedDocuments;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public long getProcessingTimeMs() {
        return processingTimeMs;
    }

    public void setProcessingTimeMs(long processingTimeMs) {
        this.processingTimeMs = processingTimeMs;
    }
}
