package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.Result;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationCreateRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage1RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage2RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage3RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage4RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage5RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage6RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage7RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationFilterRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationDocumentMetadataResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.CheckLikelihoodResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationFilterResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationStatusResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationSummaryResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.UserApplicationResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.AdminDashboardStatsResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.ApplicationDocument;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface ApplicationService {
        Result createApplication(ApplicationCreateRequestDTO applicationCreateRequestDTO);

        Result updateApplicationStage1(String applicationNo,
                        ApplicationUpdateStage1RequestDTO applicationUpdateStage1RequestDTO);

        Result updateApplicationStage2(String applicationNo,
                        ApplicationUpdateStage2RequestDTO applicationUpdateStage2RequestDTO);

        Result updateApplicationStage3(String applicationNo,
                        ApplicationUpdateStage3RequestDTO applicationUpdateStage3RequestDTO);

        Result updateApplicationStage4(String applicationNo,
                        ApplicationUpdateStage4RequestDTO applicationUpdateStage4RequestDTO);

        Result updateApplicationStage5(String applicationNo,
                        ApplicationUpdateStage5RequestDTO applicationUpdateStage5RequestDTO);

        DataResult<ApplicationSummaryResponseDTO> getApplicationSummary(String applicationNo);

        DataResult<List<ApplicationDocumentMetadataResponseDTO>> getDocumentMetadatas(String applicationNo);

        DataResult<ApplicationDocument> getApplicationDocumentById(int documentId);

        Result updateApplicationStage6(String applicationNo,
                        ApplicationUpdateStage6RequestDTO applicationUpdateStage6RequestDTO);

        Result updateApplicationStage7(String applicationNo,
                        ApplicationUpdateStage7RequestDTO applicationUpdateStage7RequestDTO);

        DataResult<ApplicationStatusResponseDTO> getApplicationStatus(String applicationNo);

        DataResult<List<UserApplicationResponseDTO>> getApplicationsForUser(int userId);

        Result cancelApplication(String applicationNo);

        Result checkApplicationCompletion(String applicationNo);

        DataResult<ApplicationFilterResponseDTO> filterApplications(ApplicationFilterRequestDTO filterRequest);

        DataResult<AdminDashboardStatsResponseDTO> getAdminDashboardStats(LocalDate month);

        DataResult<CheckLikelihoodResponseDTO> checkLikelihood(MultipartFile abstractOfTheDisclosures);
}
