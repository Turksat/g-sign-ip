package com.turksat.EU_Patent_Registration_Project.dataAccess.concretes;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.CountryRepository;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Country;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JdbcCountryRepository implements CountryRepository {
    private final JdbcTemplate jdbcTemplate;

    public JdbcCountryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Country> getAllCountries() {
        String sql = "SELECT country_id, country_name, country_code FROM gsignip.countries ORDER BY country_name";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Country country = new Country();
            country.setCountryId(rs.getInt("country_id"));
            country.setCountryName(rs.getString("country_name"));
            country.setCountryCode(rs.getString("country_code"));
            return country;
        });
    }

    @Override
    public Country getCountryById(int id) {
        String sql = "SELECT country_id, country_name, country_code FROM gsignip.countries WHERE country_id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            Country country = new Country();
            country.setCountryId(rs.getInt("country_id"));
            country.setCountryName(rs.getString("country_name"));
            country.setCountryCode(rs.getString("country_code"));
            return country;
        }, id);
    }

    @Override
    public Country getCountryByCode(String countryCode) {
        String sql = "SELECT country_id, country_name, country_code FROM gsignip.countries WHERE country_code = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            Country country = new Country();
            country.setCountryId(rs.getInt("country_id"));
            country.setCountryName(rs.getString("country_name"));
            country.setCountryCode(rs.getString("country_code"));
            return country;
        }, countryCode);
    }
}
