package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.PatentService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessDataResult;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.ApplicationRepository;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.PatentSearchRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.PatentSearchResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatentManager implements PatentService {

    private final ApplicationRepository applicationRepository;

    @Autowired
    public PatentManager(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Override
    public DataResult<PatentSearchResponseDTO> searchGrantedPatents(PatentSearchRequestDTO searchRequest) {

        // Use real database query instead of mock data
        PatentSearchResponseDTO response = applicationRepository.searchGrantedPatents(searchRequest);

        // Check if any results found
        if (response.getPatents() == null || response.getPatents().isEmpty()) {
            return new SuccessDataResult<>(response, "No patents found matching your search criteria", "1300");
        }

        return new SuccessDataResult<>(response, "Patents retrieved successfully", "1000");
    }
}