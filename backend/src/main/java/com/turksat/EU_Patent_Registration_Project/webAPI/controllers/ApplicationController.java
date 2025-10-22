package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.ApplicationService;
import com.turksat.EU_Patent_Registration_Project.business.utils.FileHelperUtil;
import com.turksat.EU_Patent_Registration_Project.business.utils.PdfHelperUtil;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.Result;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;

import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationCreateRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationFilterRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage1RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage2RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage3RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage4RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage5RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage6RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage7RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.CheckLikelihoodRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationDocumentMetadataResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.CheckLikelihoodResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationFilterResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationStatusResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationSummaryResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.UserApplicationResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.AdminDashboardStatsResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.ApplicationDocument;
import org.springframework.http.HttpHeaders;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/get-application-summary/{applicationNo}")
    public ResponseEntity<DataResult<ApplicationSummaryResponseDTO>> getApplicationSummary(
            @PathVariable String applicationNo) {
        DataResult<ApplicationSummaryResponseDTO> result = applicationService.getApplicationSummary(applicationNo);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PostMapping("/get-document-metadatas/{applicationNo}")
    public ResponseEntity<DataResult<List<ApplicationDocumentMetadataResponseDTO>>> getDocumentMetadatas(
            @PathVariable String applicationNo) {

        DataResult<List<ApplicationDocumentMetadataResponseDTO>> result = applicationService
                .getDocumentMetadatas(applicationNo);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PostMapping("/get-document-file/{documentId}")
    public ResponseEntity<byte[]> getDocumentFile(@PathVariable int documentId) {
        DataResult<ApplicationDocument> doc = applicationService.getApplicationDocumentById(documentId);

        return ResponseEntity.status(ResultStatus.fromCode(doc.getCode()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + doc.getData().getFileName() + "\"")
                .contentType(FileHelperUtil.getContentType(doc.getData().getFileExtension()))
                .body(doc.getData().getFile());
    }

    @PostMapping("/create")
    public ResponseEntity<Result> createApplication(
            @RequestBody ApplicationCreateRequestDTO applicationCreateRequestDTO) {
        Result result = applicationService.createApplication(applicationCreateRequestDTO);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PutMapping("/update/stage-1/{applicationNo}")
    public ResponseEntity<Result> updateApplicationStage1(@PathVariable String applicationNo,
            @RequestBody ApplicationUpdateStage1RequestDTO applicationUpdateStage1RequestDTO) {
        Result result = applicationService.updateApplicationStage1(applicationNo, applicationUpdateStage1RequestDTO);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PutMapping("/update/stage-2/{applicationNo}")
    public ResponseEntity<Result> updateApplicationStage2(@PathVariable String applicationNo,
            @RequestBody ApplicationUpdateStage2RequestDTO applicationUpdateStage2RequestDTO) {
        Result result = applicationService.updateApplicationStage2(applicationNo, applicationUpdateStage2RequestDTO);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PutMapping("/update/stage-3/{applicationNo}")
    public ResponseEntity<Result> updateApplicationStage3(@PathVariable String applicationNo,
            @RequestBody ApplicationUpdateStage3RequestDTO applicationUpdateStage3RequestDTO) {
        Result result = applicationService.updateApplicationStage3(applicationNo, applicationUpdateStage3RequestDTO);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PutMapping("/update/stage-4/{applicationNo}")
    public ResponseEntity<Result> updateApplicationStage4(@PathVariable String applicationNo,
            @RequestBody ApplicationUpdateStage4RequestDTO applicationUpdateStage4RequestDTO) {
        Result result = applicationService.updateApplicationStage4(applicationNo, applicationUpdateStage4RequestDTO);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PutMapping("/update/stage-5/{applicationNo}")
    public ResponseEntity<Result> updateApplicationStage5(@PathVariable String applicationNo,
            @RequestBody ApplicationUpdateStage5RequestDTO applicationUpdateStage5RequestDTO) {
        Result result = applicationService.updateApplicationStage5(applicationNo, applicationUpdateStage5RequestDTO);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PutMapping("/update/stage-6/{applicationNo}")
    public ResponseEntity<Result> updateApplicationStage6(@PathVariable String applicationNo,
            @RequestBody ApplicationUpdateStage6RequestDTO applicationUpdateStage6RequestDTO) {
        Result result = applicationService.updateApplicationStage6(applicationNo, applicationUpdateStage6RequestDTO);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PutMapping("/update/stage-7/{applicationNo}")
    public ResponseEntity<Result> updateApplicationStage7(@PathVariable String applicationNo,
            @RequestBody ApplicationUpdateStage7RequestDTO applicationUpdateStage7RequestDTO) {
        Result result = applicationService.updateApplicationStage7(applicationNo, applicationUpdateStage7RequestDTO);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PostMapping("/get-applications-for-user/{userId}")
    public ResponseEntity<DataResult<List<UserApplicationResponseDTO>>> getApplicationsForUser(
            @PathVariable int userId) {
        DataResult<List<UserApplicationResponseDTO>> result = applicationService.getApplicationsForUser(userId);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PostMapping("/application-summary/{applicationNo}/pdf")
    public ResponseEntity<byte[]> getApplicationSummaryPdf(@PathVariable String applicationNo) throws Exception {
        DataResult<ApplicationSummaryResponseDTO> dto = applicationService.getApplicationSummary(applicationNo);
        ApplicationStatusResponseDTO status = applicationService.getApplicationStatus(applicationNo).getData();
        byte[] pdfBytes = PdfHelperUtil.generate(dto.getData(), status);

        return ResponseEntity.status(ResultStatus.fromCode(dto.getCode()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"application-summary.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @PutMapping("/cancel-application/{applicationNo}")
    public ResponseEntity<Result> cancelApplication(@PathVariable String applicationNo) {
        Result result = applicationService.cancelApplication(applicationNo);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PutMapping("/complete-application/{applicationNo}")
    public ResponseEntity<Result> completeApplication(@PathVariable String applicationNo) {

        Result result = applicationService.checkApplicationCompletion(applicationNo);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PostMapping("/filter")
    public ResponseEntity<DataResult<ApplicationFilterResponseDTO>> filterApplications(
            @RequestBody ApplicationFilterRequestDTO filterRequest) {
        DataResult<ApplicationFilterResponseDTO> result = applicationService.filterApplications(filterRequest);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @GetMapping("/admin-dashboard-stats")
    public ResponseEntity<DataResult<AdminDashboardStatsResponseDTO>> getAdminDashboardStats() {
        DataResult<AdminDashboardStatsResponseDTO> result = applicationService.getAdminDashboardStats(null);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PostMapping("/check-likelihood")
    public ResponseEntity<DataResult<CheckLikelihoodResponseDTO>> checkLikelihood(
            @RequestParam("abstractOfTheDisclosures") MultipartFile abstractOfTheDisclosures) {
        DataResult<CheckLikelihoodResponseDTO> result = applicationService.checkLikelihood(abstractOfTheDisclosures);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

}
