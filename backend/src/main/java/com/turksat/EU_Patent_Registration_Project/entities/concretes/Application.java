package com.turksat.EU_Patent_Registration_Project.entities.concretes;

import com.turksat.EU_Patent_Registration_Project.core.entities.BaseEntity;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public class Application extends BaseEntity {

    private String applicationNo;
    private String nationalityNo;
    private int countryId;
    private int ciCountryId;
    private int stateId;
    private int residencyTypeId;
    private int userId;
    private int applicationStatusId;
    private int genderId;
    private int applicationTypeId;

    private List<Integer> patentClassificationId;
    private BigDecimal applicantEntitlementRate;
    private String nationalIdNo;

    private String prefix;
    private String suffix;
    private LocalDate birthDate;
    private boolean isAnonymous;

    private String city;
    private String ciStreetAddressOne;
    private String ciStreetAddressTwo;
    private String ciCity;
    private String ciPostalCode;

    private String titleOfInvention;
    private String inventionSummary;

    private boolean isGeographicalOrigin;
    private boolean isGovernmentFunded;
    private boolean isAIA;
    private boolean isAuthorizedToPDX;
    private boolean isAuthorizedToEPO;

    private String signature;
    private BigDecimal likelihood;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;


    // Getters and setters


    public String getApplicationNo() {
        return applicationNo;
    }

    public void setApplicationNo(String applicationNo) {
        this.applicationNo = applicationNo;
    }

    public String getNationalityNo() {
        return nationalityNo;
    }

    public void setNationalityNo(String nationalityNo) {
        this.nationalityNo = nationalityNo;
    }

    public int getResidencyTypeId() {
        return residencyTypeId;
    }

    public void setResidencyTypeId(int residencyTypeId) {
        this.residencyTypeId = residencyTypeId;
    }

    public int getApplicationStatusId() {
        return applicationStatusId;
    }

    public void setApplicationStatusId(int applicationStatusId) {
        this.applicationStatusId = applicationStatusId;
    }

    public int getApplicationTypeId() {
        return applicationTypeId;
    }

    public void setApplicationTypeId(int applicationTypeId) {
        this.applicationTypeId = applicationTypeId;
    }

    public int getCountryId() {
        return countryId;
    }

    public void setCountryId(int countryId) {
        this.countryId = countryId;
    }

    public int getCiCountryId() {
        return ciCountryId;
    }

    public void setCiCountryId(int ciCountryId) {
        this.ciCountryId = ciCountryId;
    }

    public int getStateId() {
        return stateId;
    }

    public void setStateId(int stateId) {
        this.stateId = stateId;
    }



    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }



    public int getGenderId() {
        return genderId;
    }

    public void setGenderId(int genderId) {
        this.genderId = genderId;
    }

    public List<Integer> getPatentClassificationId() {
        return patentClassificationId;
    }

    public void setPatentClassificationId(List<Integer> patentClassificationId) {
        this.patentClassificationId = patentClassificationId;
    }


    public BigDecimal getApplicantEntitlementRate() {
        return applicantEntitlementRate;
    }

    public void setApplicantEntitlementRate(BigDecimal applicantEntitlementRate) {
        this.applicantEntitlementRate = applicantEntitlementRate;
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

    public boolean isAnonymous() {
        return isAnonymous;
    }

    public void setAnonymous(boolean anonymous) {
        isAnonymous = anonymous;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
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
        return isAIA;
    }

    public void setAIA(boolean AIA) {
        isAIA = AIA;
    }

    public boolean isAuthorizedToPDX() {
        return isAuthorizedToPDX;
    }

    public void setAuthorizedToPDX(boolean authorizedToPDX) {
        isAuthorizedToPDX = authorizedToPDX;
    }

    public boolean isAuthorizedToEPO() {
        return isAuthorizedToEPO;
    }

    public void setAuthorizedToEPO(boolean authorizedToEPO) {
        isAuthorizedToEPO = authorizedToEPO;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public BigDecimal getLikelihood() {
        return likelihood;
    }

    public void setLikelihood(BigDecimal likelihood) {
        this.likelihood = likelihood;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

