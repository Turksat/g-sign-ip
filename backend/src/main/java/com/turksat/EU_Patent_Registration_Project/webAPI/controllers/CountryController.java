package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.CountryService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.CountryResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
public class CountryController {
    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping("/getall")
    public ResponseEntity<DataResult<List<CountryResponseDTO>>> getAllCountries() {
        DataResult<List<CountryResponseDTO>> result = countryService.getAllCountries();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getbyid/{id}")
    public ResponseEntity<DataResult<CountryResponseDTO>> getCountryById(@PathVariable int id) {
        DataResult<CountryResponseDTO> result = countryService.getCountryById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getbycode/{countryCode}")
    public ResponseEntity<DataResult<CountryResponseDTO>> getCountryByCode(@PathVariable String countryCode) {
        DataResult<CountryResponseDTO> result = countryService.getCountryByCode(countryCode);
        return ResponseEntity.ok(result);
    }
}
