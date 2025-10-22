package com.turksat.EU_Patent_Registration_Project.business.validators;

import com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations.BaseValidator;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage6RequestDTO;
import org.springframework.stereotype.Component;

@Component
public class ApplicationUpdateStage6RequestDTOValidator extends BaseValidator<ApplicationUpdateStage6RequestDTO> {
    private String signature = "Signature";

    @Override
    public void validate(ApplicationUpdateStage6RequestDTO dto) {
        checkNotNull(dto.getSignature(), signature);
        checkNotBlank(dto.getSignature(), signature);
    }
}
