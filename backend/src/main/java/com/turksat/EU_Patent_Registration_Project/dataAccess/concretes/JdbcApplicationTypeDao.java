package com.turksat.EU_Patent_Registration_Project.dataAccess.concretes;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.ApplicationTypeDao;
import com.turksat.EU_Patent_Registration_Project.entities.ApplicationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JdbcApplicationTypeDao implements ApplicationTypeDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcApplicationTypeDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<ApplicationType> findAll() {
        String sql = "SELECT application_type_id, application_type_name FROM gsignip.application_types ORDER BY application_type_id";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ApplicationType applicationType = new ApplicationType();
            applicationType.setApplicationTypeId(rs.getInt("application_type_id"));
            applicationType.setApplicationTypeName(rs.getString("application_type_name"));
            return applicationType;
        });
    }
}
