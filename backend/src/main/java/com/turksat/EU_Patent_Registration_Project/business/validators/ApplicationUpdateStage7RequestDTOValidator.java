package com.turksat.EU_Patent_Registration_Project.business.validators;

import com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations.BaseValidator;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage7RequestDTO;
import org.springframework.stereotype.Component;

@Component
public class ApplicationUpdateStage7RequestDTOValidator extends BaseValidator<ApplicationUpdateStage7RequestDTO> {
    private String firstName = "First Name";
    private String lastName = "Last Name";
    private String applicationNumber = "Application Number";
    private String emailAddress = "Email Address";
    private String cardNumber = "Card Number";
    private String nameOnCard = "Name on Card";
    private String expiryDate = "Expiry Date";
    private String cvvCode = "CVV Code";
    private String checkoutTotal = "Checkout Total";

    @Override
    public void validate(ApplicationUpdateStage7RequestDTO dto) {
        checkNotNull(dto.getFirstName(), firstName);
        checkNotBlank(dto.getFirstName(), firstName);
        
        checkNotNull(dto.getLastName(), lastName);
        checkNotBlank(dto.getLastName(), lastName);
        
        checkNotNull(dto.getApplicationNumber(), applicationNumber);
        checkNotBlank(dto.getApplicationNumber(), applicationNumber);
        
        checkNotNull(dto.getEmailAddress(), emailAddress);
        checkNotBlank(dto.getEmailAddress(), emailAddress);
        
        checkNotNull(dto.getCardNumber(), cardNumber);
        checkNotBlank(dto.getCardNumber(), cardNumber);
        
        checkNotNull(dto.getNameOnCard(), nameOnCard);
        checkNotBlank(dto.getNameOnCard(), nameOnCard);
        
        checkNotNull(dto.getExpiryDate(), expiryDate);
        checkNotBlank(dto.getExpiryDate(), expiryDate);
        
        checkNotNull(dto.getCvvCode(), cvvCode);
        checkNotBlank(dto.getCvvCode(), cvvCode);
        
        checkNotNull(dto.getCheckoutTotal(), checkoutTotal);
    }
}
