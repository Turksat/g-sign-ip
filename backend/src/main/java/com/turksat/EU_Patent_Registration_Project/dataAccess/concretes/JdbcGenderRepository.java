package com.turksat.EU_Patent_Registration_Project.dataAccess.concretes;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.GenderRepository;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Gender;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JdbcGenderRepository implements GenderRepository {
    private final JdbcTemplate jdbcTemplate;

    public JdbcGenderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Gender> getAllGenders() {
        String sql = "SELECT gender_id, gender_name FROM gsignip.genders ORDER BY gender_name";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Gender gender = new Gender();
            gender.setGenderId(rs.getInt("gender_id"));
            gender.setGenderName(rs.getString("gender_name"));
            return gender;
        });
    }

    @Override
    public Gender getGenderById(int id) {
        String sql = "SELECT gender_id, gender_name FROM gsignip.genders WHERE gender_id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            Gender gender = new Gender();
            gender.setGenderId(rs.getInt("gender_id"));
            gender.setGenderName(rs.getString("gender_name"));
            return gender;
        }, id);
    }
}
