package com.turksat.EU_Patent_Registration_Project.business.validators;

import com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations.BaseValidator;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage3RequestDTO;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
@Component
public class ApplicationUpdateStage3RequestDTOValidator extends BaseValidator<ApplicationUpdateStage3RequestDTO> {
    private String claims = "Claim Documents";
    private String abstractOfTheDisclosures = "Abstract of the disclosure Documents";
    private String drawings = "Drawing Documents";
    private String supportingDocuments = "Supporting Documents";
    private String likelihood = "Likelihood";
    @Override
    public void validate(ApplicationUpdateStage3RequestDTO dto) {
            checkNotNull(dto.getClaims(), claims);
            checkApplicationDocumentListNotBlank(dto.getClaims(),claims);

            checkNotNull(dto.getAbstractOfTheDisclosures(), abstractOfTheDisclosures);
            checkApplicationDocumentListNotBlank(dto.getAbstractOfTheDisclosures(),abstractOfTheDisclosures);

            checkNotNull(dto.getDrawings(), drawings);
            checkApplicationDocumentListNotBlank(dto.getDrawings(),drawings);

            checkNotNull(dto.getSupportingDocuments(), supportingDocuments);

            checkNotNull(dto.getLikelihood(), likelihood);
            checkDecimalRange(dto.getLikelihood(),likelihood,new BigDecimal(0.0),new BigDecimal(1.0));
    }
}
