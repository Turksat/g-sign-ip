package com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public class ApplicationSummaryResponseDTO {
    private String applicationNo;
    private String firstName;
    private String middleName;
    private String lastName;
    private String countryName;
    private String nationalityNo;
    private LocalDate birthDate;
    private String nationalIdNo;
    private String genderName;
    private Integer genderId;
    private BigDecimal applicantEntitlementRate;
    private BigDecimal likelihood;
    private String email;
    private String countryCode;
    private String phoneNumber;
    private String residencyTypeName;
    private Integer residencyTypeId;
    private String stateName;
    private Integer stateId;
    private String countryOfResidence;
    private Integer countryOfResidenceId;
    private String city;
    private String ciCountryName;
    private Integer ciCountryId;
    private String ciStreetAddressOne;
    private String ciStreetAddressTwo;
    private String ciCity;
    private String ciPostalCode;
    private boolean isAnonymous;
    private String applicationTypeName;
    private Integer applicationTypeId;
    private String titleOfInvention;
    private String inventionSummary;
    private List<String> classificationNames;
    private List<Integer> classificationIds;
    private boolean isGeographicalOrigin;
    private boolean isGovernmentFunded;
    private boolean AIA;
    private boolean isAuthorizedToPdx; // PDX data sharing authorization
    private boolean isAuthorizedToEpo; // EPO data sharing authorization
    private String prefix;
    private String suffix;
    private String signature;
    // Payment Information
    private BigDecimal paymentAmount;
    private OffsetDateTime paymentDate;
    private String paymentCurrency;
    private String paymentStatus;

    public String getApplicationNo() {
        return applicationNo;
    }

    public void setApplicationNo(String applicationNo) {
        this.applicationNo = applicationNo;
    }

    public String getGenderName() {
        return genderName;
    }

    public void setGenderName(String genderName) {
        this.genderName = genderName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getNationalIdNo() {
        return nationalIdNo;
    }

    public void setNationalIdNo(String nationalIdNo) {
        this.nationalIdNo = nationalIdNo;
    }

    public BigDecimal getApplicantEntitlementRate() {
        return applicantEntitlementRate;
    }

    public void setApplicantEntitlementRate(BigDecimal applicantEntitlementRate) {
        this.applicantEntitlementRate = applicantEntitlementRate;
    }

    public BigDecimal getLikelihood() {
        return likelihood;
    }

    public void setLikelihood(BigDecimal likelihood) {
        this.likelihood = likelihood;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getResidencyTypeName() {
        return residencyTypeName;
    }

    public void setResidencyTypeName(String residencyTypeName) {
        this.residencyTypeName = residencyTypeName;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public String getCountryOfResidence() {
        return countryOfResidence;
    }

    public void setCountryOfResidence(String countryOfResidence) {
        this.countryOfResidence = countryOfResidence;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCiCountryName() {
        return ciCountryName;
    }

    public void setCiCountryName(String ciCountryName) {
        this.ciCountryName = ciCountryName;
    }

    public String getCiStreetAddressOne() {
        return ciStreetAddressOne;
    }

    public void setCiStreetAddressOne(String ciStreetAddressOne) {
        this.ciStreetAddressOne = ciStreetAddressOne;
    }

    public String getCiStreetAddressTwo() {
        return ciStreetAddressTwo;
    }

    public void setCiStreetAddressTwo(String ciStreetAddressTwo) {
        this.ciStreetAddressTwo = ciStreetAddressTwo;
    }

    public String getCiCity() {
        return ciCity;
    }

    public void setCiCity(String ciCity) {
        this.ciCity = ciCity;
    }

    public String getCiPostalCode() {
        return ciPostalCode;
    }

    public void setCiPostalCode(String ciPostalCode) {
        this.ciPostalCode = ciPostalCode;
    }

    public boolean isAnonymous() {
        return isAnonymous;
    }

    public void setAnonymous(boolean anonymous) {
        isAnonymous = anonymous;
    }

    public String getApplicationTypeName() {
        return applicationTypeName;
    }

    public void setApplicationTypeName(String applicationTypeName) {
        this.applicationTypeName = applicationTypeName;
    }

    public String getTitleOfInvention() {
        return titleOfInvention;
    }

    public void setTitleOfInvention(String titleOfInvention) {
        this.titleOfInvention = titleOfInvention;
    }

    public String getInventionSummary() {
        return inventionSummary;
    }

    public void setInventionSummary(String inventionSummary) {
        this.inventionSummary = inventionSummary;
    }

    public List<String> getClassificationNames() {
        return classificationNames;
    }

    public void setClassificationNames(List<String> classificationNames) {
        this.classificationNames = classificationNames;
    }

    public boolean isGeographicalOrigin() {
        return isGeographicalOrigin;
    }

    public void setGeographicalOrigin(boolean geographicalOrigin) {
        isGeographicalOrigin = geographicalOrigin;
    }

    public boolean isGovernmentFunded() {
        return isGovernmentFunded;
    }

    public void setGovernmentFunded(boolean governmentFunded) {
        isGovernmentFunded = governmentFunded;
    }

    public boolean isAIA() {
        return AIA;
    }

    public void setAIA(boolean AIA) {
        this.AIA = AIA;
    }

    public boolean isAuthorizedToPdx() {
        return isAuthorizedToPdx;
    }

    public void setAuthorizedToPdx(boolean authorizedToPdx) {
        isAuthorizedToPdx = authorizedToPdx;
    }

    public boolean isAuthorizedToEpo() {
        return isAuthorizedToEpo;
    }

    public void setAuthorizedToEpo(boolean authorizedToEpo) {
        isAuthorizedToEpo = authorizedToEpo;
    }

    public String getNationalityNo() {
        return nationalityNo;
    }

    public void setNationalityNo(String nationalityNo) {
        this.nationalityNo = nationalityNo;
    }

    public Integer getGenderId() {
        return genderId;
    }

    public void setGenderId(Integer genderId) {
        this.genderId = genderId;
    }

    public Integer getResidencyTypeId() {
        return residencyTypeId;
    }

    public void setResidencyTypeId(Integer residencyTypeId) {
        this.residencyTypeId = residencyTypeId;
    }

    public Integer getStateId() {
        return stateId;
    }

    public void setStateId(Integer stateId) {
        this.stateId = stateId;
    }

    public Integer getCountryOfResidenceId() {
        return countryOfResidenceId;
    }

    public void setCountryOfResidenceId(Integer countryOfResidenceId) {
        this.countryOfResidenceId = countryOfResidenceId;
    }

    public Integer getCiCountryId() {
        return ciCountryId;
    }

    public void setCiCountryId(Integer ciCountryId) {
        this.ciCountryId = ciCountryId;
    }

    public Integer getApplicationTypeId() {
        return applicationTypeId;
    }

    public void setApplicationTypeId(Integer applicationTypeId) {
        this.applicationTypeId = applicationTypeId;
    }

    public List<Integer> getClassificationIds() {
        return classificationIds;
    }

    public void setClassificationIds(List<Integer> classificationIds) {
        this.classificationIds = classificationIds;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public BigDecimal getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(BigDecimal paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public OffsetDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(OffsetDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentCurrency() {
        return paymentCurrency;
    }

    public void setPaymentCurrency(String paymentCurrency) {
        this.paymentCurrency = paymentCurrency;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
