package com.turksat.EU_Patent_Registration_Project.business.mappers;

import com.turksat.EU_Patent_Registration_Project.business.utils.IdGeneratorService;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.*;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.UserApplicationResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Application;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.User;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.UserApplication;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.OffsetDateTime;
import java.util.List;

@Mapper(componentModel = "spring")
public abstract class ApplicationMapper {
    @Autowired
    protected IdGeneratorService idGeneratorService;

    @Mapping(target = "applicationNo", ignore = true)
    @Mapping(target = "applicationStatusId", ignore = true)
    @Mapping(target = "applicationTypeId", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "AIA", ignore = true)
    @Mapping(target = "authorizedToEPO", ignore = true)
    @Mapping(target = "authorizedToPDX", ignore = true)
    @Mapping(target = "geographicalOrigin", ignore = true)
    @Mapping(target = "governmentFunded", ignore = true)
    @Mapping(target = "inventionSummary", ignore = true)
    @Mapping(target = "likelihood", ignore = true)
    @Mapping(target = "patentClassificationId", ignore = true)
    @Mapping(target = "signature", ignore = true)
    @Mapping(target = "titleOfInvention", ignore = true)
    public abstract Application applicationCreateRequestDTOtoApplication(
            ApplicationCreateRequestDTO applicationCreateRequestDTO);

    @AfterMapping
    protected void afterForApplicationCreateRequestDTOtoApplication(
            ApplicationCreateRequestDTO applicationCreateRequestDTO,
            @MappingTarget Application application) {
        application.setApplicationNo(idGeneratorService.generateCustomId("PT"));
        application.setApplicationStatusId(3);
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        application.setUserId(user.getUserId());
        if (application.getCreatedAt() == null) {
            application.setCreatedAt(OffsetDateTime.now());
        } else {
            application.setUpdatedAt(OffsetDateTime.now());
        }
    }

    @Mapping(target = "applicationNo", ignore = true)
    @Mapping(target = "applicationStatusId", ignore = true)
    @Mapping(target = "applicationTypeId", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "AIA", ignore = true)
    @Mapping(target = "authorizedToEPO", ignore = true)
    @Mapping(target = "authorizedToPDX", ignore = true)
    @Mapping(target = "geographicalOrigin", ignore = true)
    @Mapping(target = "governmentFunded", ignore = true)
    @Mapping(target = "inventionSummary", ignore = true)
    @Mapping(target = "likelihood", ignore = true)
    @Mapping(target = "patentClassificationId", ignore = true)
    @Mapping(target = "signature", ignore = true)
    @Mapping(target = "titleOfInvention", ignore = true)
    public abstract Application applicationUpdateStage1RequestDTOtoApplication(
            ApplicationUpdateStage1RequestDTO applicationUpdateStage1RequestDTO);

    @Mapping(target = "AIA", ignore = true)
    @Mapping(target = "anonymous", ignore = true)
    @Mapping(target = "applicantEntitlementRate", ignore = true)
    @Mapping(target = "applicationNo", ignore = true)
    @Mapping(target = "applicationStatusId", ignore = true)
    @Mapping(target = "authorizedToEPO", ignore = true)
    @Mapping(target = "authorizedToPDX", ignore = true)
    @Mapping(target = "birthDate", ignore = true)
    @Mapping(target = "ciCity", ignore = true)
    @Mapping(target = "ciCountryId", ignore = true)
    @Mapping(target = "ciPostalCode", ignore = true)
    @Mapping(target = "ciStreetAddressOne", ignore = true)
    @Mapping(target = "ciStreetAddressTwo", ignore = true)
    @Mapping(target = "city", ignore = true)
    @Mapping(target = "countryId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "genderId", ignore = true)
    @Mapping(target = "likelihood", ignore = true)
    @Mapping(target = "nationalIdNo", ignore = true)
    @Mapping(target = "nationalityNo", ignore = true)
    @Mapping(target = "prefix", ignore = true)
    @Mapping(target = "residencyTypeId", ignore = true)
    @Mapping(target = "signature", ignore = true)
    @Mapping(target = "stateId", ignore = true)
    @Mapping(target = "suffix", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "userId", ignore = true)
    public abstract Application applicationUpdateStage2RequestDTOtoApplication(
            ApplicationUpdateStage2RequestDTO applicationUpdateStage2RequestDTO);

    @Mapping(target = "AIA", ignore = true)
    @Mapping(target = "anonymous", ignore = true)
    @Mapping(target = "applicantEntitlementRate", ignore = true)
    @Mapping(target = "applicationNo", ignore = true)
    @Mapping(target = "applicationStatusId", ignore = true)
    @Mapping(target = "applicationTypeId", ignore = true)
    @Mapping(target = "authorizedToEPO", ignore = true)
    @Mapping(target = "authorizedToPDX", ignore = true)
    @Mapping(target = "birthDate", ignore = true)
    @Mapping(target = "ciCity", ignore = true)
    @Mapping(target = "ciCountryId", ignore = true)
    @Mapping(target = "ciPostalCode", ignore = true)
    @Mapping(target = "ciStreetAddressOne", ignore = true)
    @Mapping(target = "ciStreetAddressTwo", ignore = true)
    @Mapping(target = "city", ignore = true)
    @Mapping(target = "countryId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "genderId", ignore = true)
    @Mapping(target = "geographicalOrigin", ignore = true)
    @Mapping(target = "governmentFunded", ignore = true)
    @Mapping(target = "inventionSummary", ignore = true)
    @Mapping(target = "likelihood", ignore = true)
    @Mapping(target = "nationalIdNo", ignore = true)
    @Mapping(target = "nationalityNo", ignore = true)
    @Mapping(target = "patentClassificationId", ignore = true)
    @Mapping(target = "prefix", ignore = true)
    @Mapping(target = "residencyTypeId", ignore = true)
    @Mapping(target = "signature", ignore = true)
    @Mapping(target = "stateId", ignore = true)
    @Mapping(target = "suffix", ignore = true)
    @Mapping(target = "titleOfInvention", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "userId", ignore = true)
    public abstract Application applicationUpdateStage4RequestDTOtoApplication(
            ApplicationUpdateStage4RequestDTO applicationUpdateStage4RequestDTO);

    @Mapping(target = "AIA", ignore = true)
    @Mapping(target = "anonymous", ignore = true)
    @Mapping(target = "applicantEntitlementRate", ignore = true)
    @Mapping(target = "applicationNo", ignore = true)
    @Mapping(target = "applicationStatusId", ignore = true)
    @Mapping(target = "applicationTypeId", ignore = true)
    @Mapping(target = "authorizedToEPO", ignore = true)
    @Mapping(target = "authorizedToPDX", ignore = true)
    @Mapping(target = "birthDate", ignore = true)
    @Mapping(target = "ciCity", ignore = true)
    @Mapping(target = "ciCountryId", ignore = true)
    @Mapping(target = "ciPostalCode", ignore = true)
    @Mapping(target = "ciStreetAddressOne", ignore = true)
    @Mapping(target = "ciStreetAddressTwo", ignore = true)
    @Mapping(target = "city", ignore = true)
    @Mapping(target = "countryId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "genderId", ignore = true)
    @Mapping(target = "geographicalOrigin", ignore = true)
    @Mapping(target = "governmentFunded", ignore = true)
    @Mapping(target = "inventionSummary", ignore = true)
    @Mapping(target = "likelihood", ignore = true)
    @Mapping(target = "nationalIdNo", ignore = true)
    @Mapping(target = "nationalityNo", ignore = true)
    @Mapping(target = "patentClassificationId", ignore = true)
    @Mapping(target = "prefix", ignore = true)
    @Mapping(target = "residencyTypeId", ignore = true)
    @Mapping(target = "stateId", ignore = true)
    @Mapping(target = "suffix", ignore = true)
    @Mapping(target = "titleOfInvention", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "userId", ignore = true)
    public abstract Application applicationUpdateStage6RequestDTOtoApplication(
            ApplicationUpdateStage6RequestDTO applicationUpdateStage6RequestDTO);

    @Mapping(target = "AIA", ignore = true)
    @Mapping(target = "anonymous", ignore = true)
    @Mapping(target = "applicantEntitlementRate", ignore = true)
    @Mapping(target = "applicationNo", ignore = true)
    @Mapping(target = "applicationStatusId", ignore = true)
    @Mapping(target = "applicationTypeId", ignore = true)
    @Mapping(target = "authorizedToEPO", ignore = true)
    @Mapping(target = "authorizedToPDX", ignore = true)
    @Mapping(target = "birthDate", ignore = true)
    @Mapping(target = "ciCity", ignore = true)
    @Mapping(target = "ciCountryId", ignore = true)
    @Mapping(target = "ciPostalCode", ignore = true)
    @Mapping(target = "ciStreetAddressOne", ignore = true)
    @Mapping(target = "ciStreetAddressTwo", ignore = true)
    @Mapping(target = "city", ignore = true)
    @Mapping(target = "countryId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "genderId", ignore = true)
    @Mapping(target = "geographicalOrigin", ignore = true)
    @Mapping(target = "governmentFunded", ignore = true)
    @Mapping(target = "inventionSummary", ignore = true)
    @Mapping(target = "likelihood", ignore = true)
    @Mapping(target = "nationalIdNo", ignore = true)
    @Mapping(target = "nationalityNo", ignore = true)
    @Mapping(target = "patentClassificationId", ignore = true)
    @Mapping(target = "prefix", ignore = true)
    @Mapping(target = "residencyTypeId", ignore = true)
    @Mapping(target = "signature", ignore = true)
    @Mapping(target = "stateId", ignore = true)
    @Mapping(target = "suffix", ignore = true)
    @Mapping(target = "titleOfInvention", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "userId", ignore = true)
    public abstract Application applicationUpdateStage7RequestDTOtoApplication(
            ApplicationUpdateStage7RequestDTO applicationUpdateStage7RequestDTO);

    @Mapping(source = "applicationNo", target = "applicationNumber")
    @Mapping(source = "titleOfInvention", target = "title")
    public abstract UserApplicationResponseDTO userApplicationToUserApplicationResponseDTO(
            UserApplication userApplication);

    public abstract List<UserApplicationResponseDTO> userApplicationsToUserApplicationResponsesDTO(
            List<UserApplication> userApplication);
}
