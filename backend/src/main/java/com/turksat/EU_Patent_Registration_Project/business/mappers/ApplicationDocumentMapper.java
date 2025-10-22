package com.turksat.EU_Patent_Registration_Project.business.mappers;

import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationDocumentMetadataResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.ApplicationDocument;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ApplicationDocumentMapper {
    @Mapping(target = "fileContent", expression = "java(applicationDocument.getFile() != null ? com.turksat.EU_Patent_Registration_Project.business.utils.Base64Utils.encodeSafely(applicationDocument.getFile()) : null)")
    ApplicationDocumentMetadataResponseDTO ApplicationDocumentToApplicationDocumentMetadataResponseDTO(ApplicationDocument applicationDocument);
    List<ApplicationDocumentMetadataResponseDTO> ApplicationDocumentsToApplicationDocumentMetadataResponsesDTO(List<ApplicationDocument> applicationDocument);
}
