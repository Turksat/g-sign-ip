package com.turksat.EU_Patent_Registration_Project.business.validators;

import com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations.BaseValidator;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage1RequestDTO;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ApplicationUpdateStage1RequestDTOValidator extends BaseValidator<ApplicationUpdateStage1RequestDTO> {
    private String applicantEntitlementRate = "Applicant Entitlement Rate";
    private String nationalityNo = "Nationality No";
    private String nationalIdNo = "National ID No";
    private String birthDate = "Birth Date";
    private String ciCity = "CI City";
    private String ciStreetAddressOne = "CI Street Address One";
    private String gender = "Gender";
    private String residenceTypeId = "Residence Type ID";
    private String stateId = "State ID";
    private String country = "Country";
    private String ciCountry = "CI Country";
    private String isAnonymous = "Anonymous";

    @Override
    public void validate(ApplicationUpdateStage1RequestDTO dto) {
        checkDecimalRange(dto.getApplicantEntitlementRate(), applicantEntitlementRate, new BigDecimal("0.0"), new BigDecimal("1.0"));

        checkNotNull(dto.getNationalityNo(), nationalityNo);
        checkNotBlank(dto.getNationalityNo(), nationalityNo);
        checkLength(dto.getNationalityNo(), nationalityNo, 1, 10);

        checkNotNull(dto.getNationalIdNo(), nationalIdNo);
        checkNotBlank(dto.getNationalIdNo(), nationalIdNo);
        checkLength(dto.getNationalIdNo(), nationalIdNo, 5, 32);

        checkNotNull(dto.getBirthDate(), birthDate);
        checkDateBeforeToday(dto.getBirthDate(), birthDate);

        checkNotNull(dto.getCiCity(), ciCity);
        checkNotBlank(dto.getCiCity(), ciCity);
        checkLength(dto.getCiCity(), ciCity, 1, 100);

        checkNotNull(dto.getCiStreetAddressOne(), ciStreetAddressOne);
        checkNotBlank(dto.getCiStreetAddressOne(), ciStreetAddressOne);
        checkLength(dto.getCiStreetAddressOne(), ciStreetAddressOne, 1, 200);

        checkNotNull(dto.getGenderId(), gender);

        checkNotNull(dto.getResidencyTypeId(), residenceTypeId);

        checkNotNull(dto.getStateId(), stateId);

        checkNotNull(dto.getCountryId(), country);

        checkNotNull(dto.getCiCountryId(), ciCountry);

        checkNotNull(dto.getAnonymous(),isAnonymous);
    }
}
