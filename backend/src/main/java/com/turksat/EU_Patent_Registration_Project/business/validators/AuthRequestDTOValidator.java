package com.turksat.EU_Patent_Registration_Project.business.validators;

import com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations.BaseValidator;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.AuthRequestDTO;
import org.springframework.stereotype.Component;

@Component
public class AuthRequestDTOValidator extends BaseValidator<AuthRequestDTO> {
    private String email="Email";
    private String password="Password";
    @Override
    public void validate(AuthRequestDTO dto) {
        checkNotNull(dto.getEmail(),email);
        checkNotBlank(dto.getEmail(),email);
        checkLength(dto.getEmail(), email,6,350);

        checkNotNull(dto.getPassword(),password);
        checkNotBlank(dto.getPassword(),password);
        checkLength(dto.getPassword(),password,3,100);
    }
}
