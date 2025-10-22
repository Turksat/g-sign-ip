package com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts;

import com.turksat.EU_Patent_Registration_Project.entities.concretes.Country;

import java.util.List;

public interface CountryRepository {
    List<Country> getAllCountries();
    Country getCountryById(int id);
    Country getCountryByCode(String countryCode);
}
