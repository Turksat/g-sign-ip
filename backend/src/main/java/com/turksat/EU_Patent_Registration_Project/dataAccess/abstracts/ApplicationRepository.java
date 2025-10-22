package com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts;

import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationFilterRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage3RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.ApplicationUpdateStage7RequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.PatentSearchRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationFilterResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationStatusResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationSummaryResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.PatentSearchResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Application;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.ApplicationDocument;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.UserApplication;

import java.time.LocalDate;
import java.util.List;

public interface ApplicationRepository {
        List<Application> getAllApplications();

        Application getApplicationByApplicationNo(String applicationNo);

        void createApplication(Application application);

        void updateApplicationStage1(String applicationNo, Application application);

        void updateApplicationStage2(String applicationNo, Application application);

        void deleteApplication(int ApplicationNo);

        void updateApplicationStage3(String applicationNo,
                        ApplicationUpdateStage3RequestDTO applicationUpdateStage3RequestDTO);

        void updateApplicationStage4(String applicationNo, boolean isAIA);

        void updateApplicationStage5(String applicationNo, boolean isAuthorizedToPdx, boolean isAuthorizedToEpo);

        ApplicationSummaryResponseDTO getApplicationSummary(String applicationNo);

        List<ApplicationDocument> getApplicationDocumentsByApplicationNo(String applicationNo);

        ApplicationDocument getApplicationDocumentById(int documentId);

        void updateApplicationStage6(String applicationNo, String signature);

        void updateApplicationStage7(String applicationNo,
                        ApplicationUpdateStage7RequestDTO applicationUpdateStage7RequestDTO);

        List<UserApplication> getApplicationsForUser(int userId);

        ApplicationStatusResponseDTO getApplicationStatus(String applicationNo);

        void cancelApplication(String applicationNo);

        boolean existsByApplicationNo(String applicationNo);

        void modifyApplicationStatus(String applicationNo, int applicationStatus);

        ApplicationFilterResponseDTO filterApplications(ApplicationFilterRequestDTO filterRequest);

        int countApplicationsByStatusAndDateRange(int applicationStatusId, LocalDate startDate, LocalDate endDate);

        PatentSearchResponseDTO searchGrantedPatents(PatentSearchRequestDTO searchRequest);
}
