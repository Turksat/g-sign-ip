package com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests;

import org.springframework.web.multipart.MultipartFile;

public class CheckLikelihoodRequestDTO {
    private MultipartFile abstractOfTheDisclosures;

    public CheckLikelihoodRequestDTO() {
    }

    public CheckLikelihoodRequestDTO(MultipartFile abstractOfTheDisclosures) {
        this.abstractOfTheDisclosures = abstractOfTheDisclosures;
    }

    public MultipartFile getAbstractOfTheDisclosures() {
        return abstractOfTheDisclosures;
    }

    public void setAbstractOfTheDisclosures(MultipartFile abstractOfTheDisclosures) {
        this.abstractOfTheDisclosures = abstractOfTheDisclosures;
    }
}
