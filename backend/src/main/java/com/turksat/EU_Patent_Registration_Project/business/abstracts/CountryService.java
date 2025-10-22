package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.CountryResponseDTO;

import java.util.List;

public interface CountryService {
    DataResult<List<CountryResponseDTO>> getAllCountries();
    DataResult<CountryResponseDTO> getCountryById(int id);
    DataResult<CountryResponseDTO> getCountryByCode(String countryCode);
}
