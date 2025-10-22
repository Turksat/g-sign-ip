package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.PatentService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.PatentSearchRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.PatentSearchResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patents")
public class PatentController {

    private final PatentService patentService;

    @Autowired
    public PatentController(PatentService patentService) {
        this.patentService = patentService;
    }

    /**
     * Search for patents with "Patent Granted" status based on various criteria
     * 
     * @param searchRequest Patent search criteria including basic and advanced
     *                      search parameters
     * @return Paginated list of granted patents matching the search criteria
     */
    @PostMapping("/search-granted")
    public ResponseEntity<DataResult<PatentSearchResponseDTO>> searchGrantedPatents(
            @RequestBody PatentSearchRequestDTO searchRequest) {

        DataResult<PatentSearchResponseDTO> result = patentService.searchGrantedPatents(searchRequest);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }
}
