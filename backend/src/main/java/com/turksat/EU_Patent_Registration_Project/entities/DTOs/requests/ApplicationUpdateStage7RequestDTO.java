package com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests;

import java.math.BigDecimal;

public class ApplicationUpdateStage7RequestDTO {
    private String firstName;
    private String lastName;
    private String applicationNumber;
    private String emailAddress;
    private String cardNumber;
    private String nameOnCard;
    private String expiryDate;
    private String cvvCode;
    private BigDecimal checkoutTotal;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getNameOnCard() {
        return nameOnCard;
    }

    public void setNameOnCard(String nameOnCard) {
        this.nameOnCard = nameOnCard;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCvvCode() {
        return cvvCode;
    }

    public void setCvvCode(String cvvCode) {
        this.cvvCode = cvvCode;
    }

    public BigDecimal getCheckoutTotal() {
        return checkoutTotal;
    }

    public void setCheckoutTotal(BigDecimal checkoutTotal) {
        this.checkoutTotal = checkoutTotal;
    }
}
