package com.turksat.EU_Patent_Registration_Project.dataAccess.concretes;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.PatentClassificationDao;
import com.turksat.EU_Patent_Registration_Project.entities.PatentClassification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JdbcPatentClassificationDao implements PatentClassificationDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcPatentClassificationDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<PatentClassification> findAll() {
        String sql = "SELECT patent_classification_id, name FROM gsignip.patent_classifications ORDER BY patent_classification_id";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            PatentClassification patentClassification = new PatentClassification();
            patentClassification.setPatentClassificationId(rs.getInt("patent_classification_id"));
            patentClassification.setName(rs.getString("name"));
            return patentClassification;
        });
    }
}
