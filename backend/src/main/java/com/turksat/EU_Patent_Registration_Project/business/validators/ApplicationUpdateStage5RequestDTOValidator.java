package com.turksat.EU_Patent_Registration_Project.business.validators;

import com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations.BaseValidator;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage5RequestDTO;
import org.springframework.stereotype.Component;

@Component
public class ApplicationUpdateStage5RequestDTOValidator extends BaseValidator<ApplicationUpdateStage5RequestDTO> {
    private String isAuthorizedToPdx = "Is Authorized to PDX";
    private String isAuthorizedToEpo = "Is Authorized to EPO";

    @Override
    public void validate(ApplicationUpdateStage5RequestDTO dto) {
        checkNotNull(dto.getIsAuthorizedToPdx(), isAuthorizedToPdx);
        checkNotNull(dto.getIsAuthorizedToEpo(), isAuthorizedToEpo);
    }
}
