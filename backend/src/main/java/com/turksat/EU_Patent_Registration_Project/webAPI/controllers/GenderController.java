package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.GenderService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.GenderResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genders")
public class GenderController {
    private final GenderService genderService;

    public GenderController(GenderService genderService) {
        this.genderService = genderService;
    }

    @GetMapping("/getall")
    public ResponseEntity<DataResult<List<GenderResponseDTO>>> getAllGenders() {
        DataResult<List<GenderResponseDTO>> result = genderService.getAllGenders();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getbyid/{id}")
    public ResponseEntity<DataResult<GenderResponseDTO>> getGenderById(@PathVariable int id) {
        DataResult<GenderResponseDTO> result = genderService.getGenderById(id);
        return ResponseEntity.ok(result);
    }
}
