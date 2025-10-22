package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.CountryService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessDataResult;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.CountryRepository;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.CountryResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Country;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CountryManager implements CountryService {
    private final CountryRepository countryRepository;

    public CountryManager(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    @Override
    public DataResult<List<CountryResponseDTO>> getAllCountries() {
        List<Country> countries = countryRepository.getAllCountries();
        List<CountryResponseDTO> countryDTOs = countries.stream()
                .map(country -> new CountryResponseDTO(
                        country.getCountryId(),
                        country.getCountryName(),
                        country.getCountryCode()
                ))
                .collect(Collectors.toList());
        
        return new SuccessDataResult<>(
                countryDTOs,
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode()
        );
    }

    @Override
    public DataResult<CountryResponseDTO> getCountryById(int id) {
        Country country = countryRepository.getCountryById(id);
        CountryResponseDTO countryDTO = new CountryResponseDTO(
                country.getCountryId(),
                country.getCountryName(),
                country.getCountryCode()
        );
        
        return new SuccessDataResult<>(
                countryDTO,
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode()
        );
    }

    @Override
    public DataResult<CountryResponseDTO> getCountryByCode(String countryCode) {
        Country country = countryRepository.getCountryByCode(countryCode);
        CountryResponseDTO countryDTO = new CountryResponseDTO(
                country.getCountryId(),
                country.getCountryName(),
                country.getCountryCode()
        );
        
        return new SuccessDataResult<>(
                countryDTO,
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode()
        );
    }
}
