package com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ApplicationCreateRequestDTO {
    private BigDecimal applicantEntitlementRate;
    private String nationalityNo;
    private String nationalIdNo;
    private String prefix;
    private String suffix;
    private LocalDate birthDate;
    private Integer genderId;
    private Integer residencyTypeId;
    private Integer stateId;
    private String city;
    private Integer countryId;
    private Integer ciCountryId;
    private String ciStreetAddressOne;
    private String ciStreetAddressTwo;
    private String ciCity;
    private String ciPostalCode;
    private Boolean isAnonymous;

    public Integer getResidencyTypeId() {
        return residencyTypeId;
    }

    public void setResidencyTypeId(Integer residencyTypeId) {
        this.residencyTypeId = residencyTypeId;
    }

    public BigDecimal getApplicantEntitlementRate() {
        return applicantEntitlementRate;
    }

    public void setApplicantEntitlementRate(BigDecimal applicantEntitlementRate) {
        this.applicantEntitlementRate = applicantEntitlementRate;
    }

    public String getNationalityNo() {
        return nationalityNo;
    }

    public void setNationalityNo(String nationalityNo) {
        this.nationalityNo = nationalityNo;
    }

    public String getNationalIdNo() {
        return nationalIdNo;
    }

    public void setNationalIdNo(String nationalIdNo) {
        this.nationalIdNo = nationalIdNo;
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

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Integer getGenderId() {
        return genderId;
    }

    public void setGenderId(Integer genderId) {
        this.genderId = genderId;
    }


    public Integer getStateId() {
        return stateId;
    }

    public void setStateId(Integer stateId) {
        this.stateId = stateId;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getCountryId() {
        return countryId;
    }

    public void setCountryId(Integer countryId) {
        this.countryId = countryId;
    }

    public Integer getCiCountryId() {
        return ciCountryId;
    }

    public void setCiCountryId(Integer ciCountryId) {
        this.ciCountryId = ciCountryId;
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

    public Boolean isAnonymous() {
        return isAnonymous;
    }

    public void setAnonymous(Boolean anonymous) {
        isAnonymous = anonymous;
    }
}
