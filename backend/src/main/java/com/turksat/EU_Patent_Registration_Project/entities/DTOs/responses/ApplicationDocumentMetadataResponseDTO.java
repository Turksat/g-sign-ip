package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

public class ApplicationDocumentMetadataResponseDTO {
    private int applicationDocumentId;
    private int applicationDocumentTypeId;
    private String fileName;
    private String fileContent; // Base64 encoded file content

    public String getFileContent() {
        return fileContent;
    }

    public void setFileContent(String fileContent) {
        this.fileContent = fileContent;
    }

    public int getApplicationDocumentId() {
        return applicationDocumentId;
    }

    public void setApplicationDocumentId(int applicationDocumentId) {
        this.applicationDocumentId = applicationDocumentId;
    }

    public int getApplicationDocumentTypeId() {
        return applicationDocumentTypeId;
    }

    public void setApplicationDocumentTypeId(int applicationDocumentTypeId) {
        this.applicationDocumentTypeId = applicationDocumentTypeId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
