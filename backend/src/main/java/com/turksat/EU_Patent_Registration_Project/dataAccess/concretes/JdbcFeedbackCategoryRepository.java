package com.turksat.EU_Patent_Registration_Project.dataAccess.concretes;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.FeedbackCategoryRepository;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.FeedbackCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class JdbcFeedbackCategoryRepository implements FeedbackCategoryRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcFeedbackCategoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<FeedbackCategory> getAll() {
        String sql = "SELECT id, feedback_category_description FROM gsignip.feedback_categories ORDER BY feedback_category_description";

        return jdbcTemplate.query(sql, new RowMapper<FeedbackCategory>() {
            @Override
            public FeedbackCategory mapRow(ResultSet rs, int rowNum) throws SQLException {
                FeedbackCategory feedbackCategory = new FeedbackCategory();
                feedbackCategory.setId(rs.getInt("id"));
                feedbackCategory.setFeedbackCategoryDescription(rs.getString("feedback_category_description"));
                return feedbackCategory;
            }
        });
    }
}
