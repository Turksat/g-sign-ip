package com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests;

public class ApplicationUpdateStage5RequestDTO {
    private Boolean isAuthorizedToPdx;
    private Boolean isAuthorizedToEpo;

    public Boolean getIsAuthorizedToPdx() {
        return isAuthorizedToPdx;
    }

    public void setIsAuthorizedToPdx(Boolean isAuthorizedToPdx) {
        this.isAuthorizedToPdx = isAuthorizedToPdx;
    }

    public Boolean getIsAuthorizedToEpo() {
        return isAuthorizedToEpo;
    }

    public void setIsAuthorizedToEpo(Boolean isAuthorizedToEpo) {
        this.isAuthorizedToEpo = isAuthorizedToEpo;
    }
}
