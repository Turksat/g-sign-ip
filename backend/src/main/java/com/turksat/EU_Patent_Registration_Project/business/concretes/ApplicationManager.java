package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.blockchain.service.PatentService;
import com.turksat.EU_Patent_Registration_Project.business.abstracts.ApplicationService;
import com.turksat.EU_Patent_Registration_Project.business.mappers.ApplicationDocumentMapper;
import com.turksat.EU_Patent_Registration_Project.business.mappers.ApplicationMapper;
import com.turksat.EU_Patent_Registration_Project.business.rules.ApplicationBusinessRules;
import com.turksat.EU_Patent_Registration_Project.business.utils.IdGeneratorService;
import com.turksat.EU_Patent_Registration_Project.business.validators.ApplicationUpdateStage4RequestDTOValidator;
import com.turksat.EU_Patent_Registration_Project.business.validators.ApplicationUpdateStage5RequestDTOValidator;
import com.turksat.EU_Patent_Registration_Project.business.validators.ApplicationUpdateStage6RequestDTOValidator;
import com.turksat.EU_Patent_Registration_Project.business.validators.ApplicationUpdateStage7RequestDTOValidator;
import com.turksat.EU_Patent_Registration_Project.core.utils.BusinessRules;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.*;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.ApplicationRepository;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.PaymentRepository;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.*;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationDocumentMetadataResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationFilterResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationStatusResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationSummaryResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.UserApplicationResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.AdminDashboardStatsResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.CheckLikelihoodResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.RetrievedDocumentDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Application;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.ApplicationDocument;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Payment;
import okhttp3.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import okhttp3.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ApplicationManager implements ApplicationService {
    private final ApplicationBusinessRules applicationBusinessRules;
    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;
    private final ApplicationDocumentMapper applicationDocumentMapper;
    private final ApplicationUpdateStage4RequestDTOValidator applicationUpdateStage4RequestDTOValidator;
    private final ApplicationUpdateStage5RequestDTOValidator applicationUpdateStage5RequestDTOValidator;
    private final ApplicationUpdateStage6RequestDTOValidator applicationUpdateStage6RequestDTOValidator;
    private final ApplicationUpdateStage7RequestDTOValidator applicationUpdateStage7RequestDTOValidator;
    private final IdGeneratorService idGeneratorService;
    private final PaymentRepository paymentRepository;
    private final OkHttpClient okHttpClient;
    private final PatentService patentService;

    @Value("${external.patent-analysis.url}")
    private String patentAnalysisUrl;



    public ApplicationManager(ApplicationRepository applicationRepository, ApplicationMapper applicationMapper,
                              ApplicationDocumentMapper applicationDocumentMapper, ApplicationBusinessRules applicationBusinessRules,
                              ApplicationUpdateStage4RequestDTOValidator applicationUpdateStage4RequestDTOValidator,
                              ApplicationUpdateStage5RequestDTOValidator applicationUpdateStage5RequestDTOValidator,
                              ApplicationUpdateStage6RequestDTOValidator applicationUpdateStage6RequestDTOValidator,
                              ApplicationUpdateStage7RequestDTOValidator applicationUpdateStage7RequestDTOValidator,
                              IdGeneratorService idGeneratorService, PaymentRepository paymentRepository, OkHttpClient okHttpClient,
                              PatentService patentService) {
        this.applicationRepository = applicationRepository;
        this.applicationMapper = applicationMapper;
        this.applicationDocumentMapper = applicationDocumentMapper;
        this.applicationBusinessRules = applicationBusinessRules;
        this.applicationUpdateStage4RequestDTOValidator = applicationUpdateStage4RequestDTOValidator;
        this.applicationUpdateStage5RequestDTOValidator = applicationUpdateStage5RequestDTOValidator;
        this.applicationUpdateStage6RequestDTOValidator = applicationUpdateStage6RequestDTOValidator;
        this.applicationUpdateStage7RequestDTOValidator = applicationUpdateStage7RequestDTOValidator;
        this.idGeneratorService = idGeneratorService;
        this.paymentRepository = paymentRepository;
        this.okHttpClient = okHttpClient;
        this.patentService = patentService;
    }


    @Override
    public Result createApplication(ApplicationCreateRequestDTO applicationCreateRequestDTO) {
        // Create application entity
        Application application = applicationMapper
                .applicationCreateRequestDTOtoApplication(applicationCreateRequestDTO);

        // Generate application number
        String applicationNo = idGeneratorService.generateCustomId("PT");
        application.setApplicationNo(applicationNo);

        // Save to database
        applicationRepository.createApplication(application);

        // Return success with application number
        return new SuccessDataResult<>(applicationNo, ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result updateApplicationStage1(String applicationNo,
            ApplicationUpdateStage1RequestDTO applicationUpdateStage1RequestDTO) {
        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfApplicationExists(applicationNo));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }

        // Convert DTO to Application entity and update
        Application application = applicationMapper
                .applicationUpdateStage1RequestDTOtoApplication(applicationUpdateStage1RequestDTO);
        application.setApplicationNo(applicationNo);

        applicationRepository.updateApplicationStage1(applicationNo, application);
        return new SuccessResult(ResultStatus.SUCCESS.getMessage(), ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result updateApplicationStage2(String applicationNo,
            ApplicationUpdateStage2RequestDTO applicationUpdateStage2RequestDTO) {
        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfApplicationExists(applicationNo));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }
        applicationRepository.updateApplicationStage2(applicationNo,
                applicationMapper.applicationUpdateStage2RequestDTOtoApplication(applicationUpdateStage2RequestDTO));
        return new SuccessResult(ResultStatus.SUCCESS.getMessage(), ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result updateApplicationStage3(String applicationNo,
            ApplicationUpdateStage3RequestDTO applicationUpdateStage3RequestDTO) {
        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfApplicationExists(applicationNo));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }
        applicationRepository.updateApplicationStage3(applicationNo, applicationUpdateStage3RequestDTO);
        return new SuccessResult(ResultStatus.SUCCESS.getMessage(), ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result updateApplicationStage4(String applicationNo,
            ApplicationUpdateStage4RequestDTO applicationUpdateStage4RequestDTO) {
        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfApplicationExists(applicationNo));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }

        try {
            applicationUpdateStage4RequestDTOValidator.validate(applicationUpdateStage4RequestDTO);
        } catch (Exception e) {
            return new ErrorResult(e.getMessage(), ResultStatus.VALIDATION_ERROR.getCode());
        }

        applicationRepository.updateApplicationStage4(applicationNo, applicationUpdateStage4RequestDTO.getIsAIA());
        return new SuccessResult(ResultStatus.SUCCESS.getMessage(), ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result updateApplicationStage5(String applicationNo,
            ApplicationUpdateStage5RequestDTO applicationUpdateStage5RequestDTO) {
        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfApplicationExists(applicationNo));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }

        try {
            applicationUpdateStage5RequestDTOValidator.validate(applicationUpdateStage5RequestDTO);
        } catch (Exception e) {
            return new ErrorResult(e.getMessage(), ResultStatus.VALIDATION_ERROR.getCode());
        }

        applicationRepository.updateApplicationStage5(applicationNo,
                applicationUpdateStage5RequestDTO.getIsAuthorizedToPdx(),
                applicationUpdateStage5RequestDTO.getIsAuthorizedToEpo());
        return new SuccessResult(ResultStatus.SUCCESS.getMessage(), ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result updateApplicationStage6(String applicationNo,
            ApplicationUpdateStage6RequestDTO applicationUpdateStage6RequestDTO) {
        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfApplicationExists(applicationNo));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }

        try {
            applicationUpdateStage6RequestDTOValidator.validate(applicationUpdateStage6RequestDTO);
        } catch (Exception e) {
            return new ErrorResult(e.getMessage(), ResultStatus.VALIDATION_ERROR.getCode());
        }

        applicationRepository.updateApplicationStage6(applicationNo, applicationUpdateStage6RequestDTO.getSignature());
        return new SuccessResult(ResultStatus.SUCCESS.getMessage(), ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result updateApplicationStage7(String applicationNo,
            ApplicationUpdateStage7RequestDTO applicationUpdateStage7RequestDTO) {
        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfApplicationExists(applicationNo));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }

        try {
            applicationUpdateStage7RequestDTOValidator.validate(applicationUpdateStage7RequestDTO);
            //Here the validity payment will be passed. Project propasal has been submitted.
            //So can be added the blockchain
            try {
                patentService.registerPatent(applicationRepository.getApplicationByApplicationNo(applicationNo),
                        applicationRepository.getApplicationDocumentsByApplicationNo(applicationNo));

            }catch (Exception e){
            }


        } catch (Exception e) {
            return new ErrorResult(e.getMessage(), ResultStatus.VALIDATION_ERROR.getCode());
        }

        // Payment information will be stored in a separate payment table
        // For now, we'll just return success
        return new SuccessResult(ResultStatus.SUCCESS.getMessage(), ResultStatus.SUCCESS.getCode());
    }

    @Override
    public DataResult<ApplicationStatusResponseDTO> getApplicationStatus(String applicationNo) {
        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfApplicationExists(applicationNo));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }
        return new SuccessDataResult<>(applicationRepository.getApplicationStatus(applicationNo),
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public DataResult<List<UserApplicationResponseDTO>> getApplicationsForUser(int userId) {
        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfUserExists(userId));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }
        return new SuccessDataResult<>(applicationMapper.userApplicationsToUserApplicationResponsesDTO(
                applicationRepository.getApplicationsForUser(userId)),
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result cancelApplication(String applicationNo) {
        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfApplicationExists(applicationNo));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }
        applicationRepository.cancelApplication(applicationNo);
        return new SuccessResult(ResultStatus.SUCCESS.getMessage(), ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result checkApplicationCompletion(String applicationNo) {
        Application application = applicationRepository.getApplicationByApplicationNo(applicationNo);
        List<ApplicationDocumentMetadataResponseDTO> documents = getDocumentMetadatas(applicationNo).getData();

        List<String> missingFields = getNullFieldNamesForApplication(application);
        if (!missingFields.isEmpty()) {
            // Missing required fields: missingFields
            return new ErrorResult(ResultStatus.APPLICATION_NOT_COMPLETED.getMessage(),
                    ResultStatus.APPLICATION_NOT_COMPLETED.getCode());
        }
        List<Integer> idsYouHave = documents.stream()
                .map(ApplicationDocumentMetadataResponseDTO::getApplicationDocumentTypeId)
                .toList();

        List<Integer> requiredIds = List.of(1, 2, 3);

        if (hasRequiredIds(idsYouHave, requiredIds)) {
            // All required document type ids are present
        } else {
            // Missing document type IDs
            return new ErrorResult(ResultStatus.APPLICATION_NOT_COMPLETED.getMessage(),
                    ResultStatus.APPLICATION_NOT_COMPLETED.getCode());
        }
        if (application.getApplicationStatusId() != 1) {
            // TODO:: burada status 2 yapılmış. Ödeme yapıldıktan sonra normalde 1 olması
            // gerekiyor.
            applicationRepository.modifyApplicationStatus(applicationNo, 1);
        }
        return new SuccessResult(ResultStatus.SUCCESS.getMessage(), ResultStatus.SUCCESS.getCode());
    }

    @Override
    public DataResult<ApplicationSummaryResponseDTO> getApplicationSummary(String applicationNo) {
        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfApplicationExists(applicationNo));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }

        ApplicationSummaryResponseDTO applicationSummary = applicationRepository.getApplicationSummary(applicationNo);

        // Payment bilgilerini ekle - hem route param hem de gerçek application_no'yu
        // dene
        String realApplicationNo = applicationSummary.getApplicationNo();

        // Önce gerçek application_no ile dene
        Payment payment = paymentRepository.getPaymentByApplicationNo(realApplicationNo);

        // Bulamazsa route param ile dene
        if (payment == null) {
            payment = paymentRepository.getPaymentByApplicationNo(applicationNo);
        }

        if (payment != null) {
            applicationSummary.setPaymentAmount(payment.getAmount());
            applicationSummary.setPaymentDate(payment.getPaymentDate());
            applicationSummary.setPaymentCurrency(payment.getCurrency());
            applicationSummary.setPaymentStatus(payment.getPaymentStatus());
        }

        return new SuccessDataResult<>(applicationSummary,
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public DataResult<List<ApplicationDocumentMetadataResponseDTO>> getDocumentMetadatas(String applicationNo) {

        Result ruleCheck = BusinessRules.run(applicationBusinessRules.checkIfApplicationExists(applicationNo));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }
        return new SuccessDataResult<>(
                applicationDocumentMapper.ApplicationDocumentsToApplicationDocumentMetadataResponsesDTO(
                        applicationRepository.getApplicationDocumentsByApplicationNo(applicationNo)),
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public DataResult<ApplicationDocument> getApplicationDocumentById(int documentId) {
        return new SuccessDataResult<>(applicationRepository.getApplicationDocumentById(documentId),
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    private static List<String> getNullFieldNamesForApplication(Object obj) {
        List<String> nullFields = new ArrayList<>();

        for (Field field : obj.getClass().getDeclaredFields()) {
            field.setAccessible(true); // access private fields
            try {
                Object value = field.get(obj);
                if (value == null) {
                    if (field.getName().equals("applicantEntitlementRate") ||
                            field.getName().equals("prefix") ||
                            field.getName().equals("suffix") ||
                            field.getName().equals("ciStreetAddressTwo") ||
                            field.getName().equals("ciPostalCode") ||
                            field.getName().equals("patentClassificationId") ||
                            field.getName().equals("updatedAt"))
                        continue;
                    nullFields.add(field.getName());
                }
            } catch (IllegalAccessException ignored) {
            }
        }

        return nullFields;
    }

    private static boolean hasRequiredIds(List<Integer> actualIds, List<Integer> requiredIds) {
        return requiredIds.stream().allMatch(actualIds::contains);
    }

    @Override
    public DataResult<ApplicationFilterResponseDTO> filterApplications(ApplicationFilterRequestDTO filterRequest) {
        try {
            ApplicationFilterResponseDTO result = applicationRepository.filterApplications(filterRequest);
            return new SuccessDataResult<>(
                    result,
                    ResultStatus.SUCCESS.getMessage(),
                    ResultStatus.SUCCESS.getCode());
        } catch (Exception e) {
            return new ErrorDataResult<>(
                    null,
                    "Error filtering applications: " + e.getMessage(),
                    ResultStatus.FAILURE.getCode());
        }
    }

    @Override
    public DataResult<AdminDashboardStatsResponseDTO> getAdminDashboardStats(LocalDate month) {
        try {
            // Eğer month null ise, mevcut ayı kullan
            if (month == null) {
                month = LocalDate.now();
            }

            // Ayın başlangıç ve bitiş tarihlerini hesapla
            LocalDate startOfMonth = month.withDayOfMonth(1);
            LocalDate endOfMonth = month.withDayOfMonth(month.lengthOfMonth());

            // Veritabanından istatistikleri al
            int submissionsStarted = applicationRepository.countApplicationsByStatusAndDateRange(1, startOfMonth,
                    endOfMonth); // DRAFT
            int submissionsAssigned = applicationRepository.countApplicationsByStatusAndDateRange(2, startOfMonth,
                    endOfMonth); // UNDER_REVIEW
            int submissionsCompleted = applicationRepository.countApplicationsByStatusAndDateRange(3, startOfMonth,
                    endOfMonth); // COMPLETED

            // Ay adını al
            String monthName = month.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

            AdminDashboardStatsResponseDTO stats = new AdminDashboardStatsResponseDTO(
                    submissionsStarted,
                    submissionsAssigned,
                    submissionsCompleted,
                    month,
                    monthName);

            return new SuccessDataResult<>(
                    stats,
                    "Admin dashboard stats retrieved successfully",
                    ResultStatus.SUCCESS.getCode());
        } catch (Exception e) {
            return new ErrorDataResult<>(
                    null,
                    "Error retrieving admin dashboard stats: " + e.getMessage(),
                    ResultStatus.FAILURE.getCode());
        }
    }

    @Override
    public DataResult<CheckLikelihoodResponseDTO> checkLikelihood(MultipartFile abstractOfTheDisclosures) {
        long startTime = System.currentTimeMillis();

        try {
            // Dış servise HTTP isteği yap
            String externalServiceUrl = patentAnalysisUrl;

            // OkHttp ile multipart request oluştur
            RequestBody fileBody = RequestBody.create(
                    abstractOfTheDisclosures.getBytes(),
                    MediaType.parse("application/pdf"));

            RequestBody requestBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("pdf_file", abstractOfTheDisclosures.getOriginalFilename(), fileBody)
                    .addFormDataPart("patent_text", "")
                    .addFormDataPart("top_k", "5")
                    .addFormDataPart("rerank", "true")
                    .addFormDataPart("priority_year", "0")
                    .addFormDataPart("granted_filter", "true")
                    .build();

            Request request = new Request.Builder()
                    .url(externalServiceUrl)
                    .post(requestBody)
                    .build();

            // OkHttp ile istek gönder
            try (Response response = okHttpClient.newCall(request).execute()) {
                if (response.isSuccessful()) {
                    // Response'u parse et
                    String responseBody = response.body().string();

                    // GSON ile JSON parse et
                    Gson gson = new Gson();
                    JsonObject rootObject = gson.fromJson(responseBody, JsonObject.class);

                    // Analysis kısmından likelihood'ı al
                    JsonObject analysis = rootObject.getAsJsonObject("analysis");
                    JsonObject patentabilityScore = analysis.getAsJsonObject("patentabilityScore");
                    BigDecimal likelihood = patentabilityScore.get("likelihood").getAsBigDecimal();

                    // Analysis metnini al
                    String analysisText = analysis.get("executiveSummary").getAsString();

                    // Retrieved documents'ları parse et
                    List<RetrievedDocumentDTO> retrievedDocuments = new ArrayList<>();
                    JsonArray documentsArray = rootObject.getAsJsonArray("retrieved_documents");

                    for (JsonElement docElement : documentsArray) {
                        JsonObject docObject = docElement.getAsJsonObject();
                        RetrievedDocumentDTO doc = new RetrievedDocumentDTO();

                        doc.setRank(docObject.get("rank").getAsInt());
                        doc.setDocumentId(docObject.get("document_id").getAsString());
                        doc.setFamilyId(docObject.get("family_id").getAsString());
                        doc.setTitle(docObject.get("title").getAsString());
                        doc.setAbstractText(docObject.get("abstract").getAsString());
                        doc.setRelevanceScore(docObject.get("relevance_score").getAsDouble());
                        doc.setMethod(docObject.get("method").getAsString());
                        doc.setCountryCode(docObject.get("country_code").getAsString());
                        doc.setGranted(docObject.get("is_granted").getAsBoolean());
                        doc.setMetadataSummary(docObject.get("metadata_summary").getAsString());
                        doc.setCitationCount(docObject.get("citation_count").getAsInt());
                        doc.setValidPriorArt(docObject.get("is_valid_prior_art").getAsBoolean());
                        doc.setTemporalRelevance(docObject.get("temporal_relevance").getAsString());

                        // Arrays - GSON ile daha basit
                        @SuppressWarnings("unchecked")
                        List<String> assignees = gson.fromJson(docObject.get("assignees"), List.class);
                        doc.setAssignees(assignees);

                        @SuppressWarnings("unchecked")
                        List<String> inventors = gson.fromJson(docObject.get("inventors"), List.class);
                        doc.setInventors(inventors);

                        @SuppressWarnings("unchecked")
                        List<String> cpcCodes = gson.fromJson(docObject.get("cpc_codes"), List.class);
                        doc.setCpcCodes(cpcCodes);

                        @SuppressWarnings("unchecked")
                        List<String> ipcCodes = gson.fromJson(docObject.get("ipc_codes"), List.class);
                        doc.setIpcCodes(ipcCodes);

                        @SuppressWarnings("unchecked")
                        List<String> technologyAreas = gson.fromJson(docObject.get("technology_areas"), List.class);
                        doc.setTechnologyAreas(technologyAreas);

                        @SuppressWarnings("unchecked")
                        List<String> technicalTerms = gson.fromJson(docObject.get("technical_terms"), List.class);
                        doc.setTechnicalTerms(technicalTerms);

                        @SuppressWarnings("unchecked")
                        List<String> citationsSample = gson.fromJson(docObject.get("citations_sample"), List.class);
                        doc.setCitationsSample(citationsSample);

                        retrievedDocuments.add(doc);
                    }

                    long processingTime = System.currentTimeMillis() - startTime;

                    CheckLikelihoodResponseDTO result = new CheckLikelihoodResponseDTO(
                            likelihood,
                            analysisText,
                            retrievedDocuments,
                            "Analysis completed successfully",
                            true,
                            processingTime);

                    return new SuccessDataResult<>(
                            result,
                            "Likelihood analysis completed successfully",
                            ResultStatus.SUCCESS.getCode());
                } else {
                    return new ErrorDataResult<>(
                            null,
                            "External service returned error: " + response.code(),
                            ResultStatus.FAILURE.getCode());
                }
            }

        } catch (Exception e) {
            long processingTime = System.currentTimeMillis() - startTime;
            return new ErrorDataResult<>(
                    null,
                    "Error during likelihood analysis: " + e.getMessage() + " (Processing time: " + processingTime
                            + "ms)",
                    ResultStatus.FAILURE.getCode());
        }
    }

}
