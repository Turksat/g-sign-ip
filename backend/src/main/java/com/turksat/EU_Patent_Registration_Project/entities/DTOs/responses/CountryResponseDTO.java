package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

public class CountryResponseDTO {
    private int countryId;
    private String countryName;
    private String countryCode;

    public CountryResponseDTO() {
    }

    public CountryResponseDTO(int countryId, String countryName, String countryCode) {
        this.countryId = countryId;
        this.countryName = countryName;
        this.countryCode = countryCode;
    }

    public int getCountryId() {
        return countryId;
    }

    public void setCountryId(int countryId) {
        this.countryId = countryId;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }
}
