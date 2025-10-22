package com.turksat.EU_Patent_Registration_Project.entities.concretes;

import com.turksat.EU_Patent_Registration_Project.core.entities.BaseEntity;

public class ApplicationDocument extends BaseEntity {
    private int applicationDocumentId;
    private int applicationDocumentTypeId;
    private byte[] file;
    private String fileExtension;
    private String fileName;
    private long fileSize;
    private String fileType;
    private String fileContent; // Base64 encoded content (runtime'da file byte array'den generate ediliyor)

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

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

    public String getFileExtension() {
        return fileExtension;
    }

    public void setFileExtension(String fileExtension) {
        this.fileExtension = fileExtension;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFileContent() {
        return fileContent;
    }

    public void setFileContent(String fileContent) {
        this.fileContent = fileContent;
    }
}
