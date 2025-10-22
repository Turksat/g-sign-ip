package com.turksat.EU_Patent_Registration_Project.business.validators;

import com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations.BaseValidator;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage2RequestDTO;
import org.springframework.stereotype.Component;

@Component
public class ApplicationUpdateStage2RequestDTOValidator extends BaseValidator<ApplicationUpdateStage2RequestDTO> {
    private String applicationType = "Application Type";
    private String titleOfInvention = "Title Of Invention";
    private String inventionSummary = "Invention Summary";
    private String isGeographicalOrigin = "Geographical Origin";
    private String isGovernmentFunded = "Government Funded";
    @Override
    public void validate(ApplicationUpdateStage2RequestDTO dto) {
        checkNotNull(dto.getApplicationTypeId(),applicationType);

        checkNotNull(dto.getTitleOfInvention(), titleOfInvention);
        checkNotBlank(dto.getTitleOfInvention(), titleOfInvention);
        checkLength(dto.getTitleOfInvention(),titleOfInvention,10,1000);

        checkNotNull(dto.getInventionSummary(), inventionSummary);
        checkNotBlank(dto.getInventionSummary(), inventionSummary);
        checkLength(dto.getInventionSummary(),inventionSummary,10,1000);

        checkNotNull(dto.isGeographicalOrigin(), isGeographicalOrigin);

        checkNotNull(dto.isGovernmentFunded(), isGovernmentFunded);

    }
}
