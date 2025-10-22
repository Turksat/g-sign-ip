package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.StateService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.StateResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/states")
public class StateController {
    private final StateService stateService;

    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @GetMapping("/getall")
    public ResponseEntity<DataResult<List<StateResponseDTO>>> getStatesByCountryId(
            @RequestParam(value = "countryId", defaultValue = "221") int countryId) {
        DataResult<List<StateResponseDTO>> result = stateService.getStatesByCountryId(countryId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getbyid/{id}")
    public ResponseEntity<DataResult<StateResponseDTO>> getStateById(@PathVariable int id) {
        DataResult<StateResponseDTO> result = stateService.getStateById(id);
        return ResponseEntity.ok(result);
    }
}
