package com.turksat.EU_Patent_Registration_Project.business.validators;

import com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations.BaseValidator;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage4RequestDTO;
import org.springframework.stereotype.Component;

@Component
public class ApplicationUpdateStage4RequestDTOValidator extends BaseValidator<ApplicationUpdateStage4RequestDTO> {
    private String isAIA = "Is AIA";

    @Override
    public void validate(ApplicationUpdateStage4RequestDTO dto) {
        checkNotNull(dto.getIsAIA(), isAIA);
    }
}
