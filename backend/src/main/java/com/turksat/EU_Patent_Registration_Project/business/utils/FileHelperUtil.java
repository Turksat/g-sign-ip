package com.turksat.EU_Patent_Registration_Project.business.utils;

import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage3RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.ApplicationDocument;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class FileHelperUtil {
    private static ApplicationDocument FileToApplicationDocument(MultipartFile file) throws IOException {
        ApplicationDocument doc = new ApplicationDocument();
        String fileName = file.getOriginalFilename();
        doc.setFileName(fileName);
        doc.setFile(file.getBytes());
        doc.setFileExtension(file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")));
        switch (file.getName()){
            case "claims":
                doc.setApplicationDocumentTypeId(1);
                break;
            case "abstractOfTheDisclosuresFiles":
                doc.setApplicationDocumentTypeId(2);
                break;
            case "drawings":
                doc.setApplicationDocumentTypeId(3);
                break;
            case "supportingDocuments":
                doc.setApplicationDocumentTypeId(4);
                break;
                default:
                    doc.setApplicationDocumentTypeId(0);
                    break;
        }

        return doc;
    }

    @SafeVarargs
    public static ApplicationUpdateStage3RequestDTO createApplicationDocumentsForDTO(List<MultipartFile>... files) throws IOException {
        List<ApplicationDocument> claims = new ArrayList<>();
        List<ApplicationDocument> abstractOfTheDisclosure = new ArrayList<>();
        List<ApplicationDocument> drawings = new ArrayList<>();
        List<ApplicationDocument> supportingDocuments = new ArrayList<>();
        for (List<MultipartFile> fileList : files) {
            if (fileList == null) continue;
            for (MultipartFile file : fileList) {

                ApplicationDocument doc = FileToApplicationDocument(file);
                switch (doc.getApplicationDocumentTypeId()){
                    case 1:
                        claims.add(doc);
                        break;
                    case 2:
                        abstractOfTheDisclosure.add(doc);
                        break;
                    case 3:
                        drawings.add(doc);
                        break;
                    case 4:
                        supportingDocuments.add(doc);
                        break;
                    default:
                        // Unknown document type
                        break;
                }
            }
        }
        ApplicationUpdateStage3RequestDTO applicationUpdateStage3RequestDTO = new ApplicationUpdateStage3RequestDTO();
        applicationUpdateStage3RequestDTO.setClaims(claims);
        applicationUpdateStage3RequestDTO.setAbstractOfTheDisclosures(abstractOfTheDisclosure);
        applicationUpdateStage3RequestDTO.setDrawings(drawings);
        applicationUpdateStage3RequestDTO.setSupportingDocuments(supportingDocuments);
        return applicationUpdateStage3RequestDTO;
    }
    public static MediaType getContentType(String extension) {
        return switch (extension.toLowerCase()) {
            case "pdf" -> MediaType.APPLICATION_PDF;
            case "png" -> MediaType.IMAGE_PNG;
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }
}
