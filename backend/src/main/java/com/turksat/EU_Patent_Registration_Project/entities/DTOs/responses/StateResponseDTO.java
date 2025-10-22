package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

public class StateResponseDTO {
    private int stateId;
    private String stateName;
    private int countryId;

    public StateResponseDTO() {
    }

    public StateResponseDTO(int stateId, String stateName, int countryId) {
        this.stateId = stateId;
        this.stateName = stateName;
        this.countryId = countryId;
    }

    public int getStateId() {
        return stateId;
    }

    public void setStateId(int stateId) {
        this.stateId = stateId;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public int getCountryId() {
        return countryId;
    }

    public void setCountryId(int countryId) {
        this.countryId = countryId;
    }
}
