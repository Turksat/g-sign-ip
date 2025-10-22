package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.PatentSearchRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.PatentSearchResponseDTO;

public interface PatentService {

    /**
     * Search for patents with "Patent Granted" status based on search criteria
     * 
     * @param searchRequest The search criteria including basic and advanced search
     *                      parameters
     * @return DataResult containing paginated patent search results
     */
    DataResult<PatentSearchResponseDTO> searchGrantedPatents(PatentSearchRequestDTO searchRequest);
}
