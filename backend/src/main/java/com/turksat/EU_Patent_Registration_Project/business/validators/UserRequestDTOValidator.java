package com.turksat.EU_Patent_Registration_Project.business.validators;

import com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations.BaseValidator;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.UserRequestDTO;
import org.springframework.stereotype.Component;

@Component
public class UserRequestDTOValidator extends BaseValidator<UserRequestDTO> {
    private String firstName="First Name";
    private String lastName="Last Name";
    private String email="Email";
    private String phone="Phone Number";
    private String middleName="Middle Name";
    private String password="Password";
    private String phoneNumberCountryCodeId = "Phone Country Code ID";
    @Override
    public void validate(UserRequestDTO dto) {

        checkNotNull(dto.getFirstName(),firstName);
        checkNotBlank(dto.getFirstName(),firstName);
        checkLength(dto.getFirstName(),firstName,0,50);

        checkNotNull(dto.getLastName(),lastName);
        checkNotBlank(dto.getLastName(),lastName);
        checkLength(dto.getLastName(),lastName,0,50);

        checkLength(dto.getMiddleName(),middleName,0,50);

        checkNotNull(dto.getPhoneNumberCountryCodeId(),phoneNumberCountryCodeId);

        checkNotNull(dto.getPhoneNumber(),phone);
        checkNotBlank(dto.getPhoneNumber(),phone);
        checkLength(dto.getPhoneNumber(),phone,0,15);

        checkNotNull(dto.getPassword(),password);
        checkNotBlank(dto.getPassword(),password);
        checkLength(dto.getPassword(), password, 5, 64);

        checkNotNull(dto.getEmail(),email);
        checkNotBlank(dto.getEmail(),email);
        checkEmailFormat(dto.getEmail(), email);
        checkLength(dto.getEmail(),email,0,320);
    }
}

