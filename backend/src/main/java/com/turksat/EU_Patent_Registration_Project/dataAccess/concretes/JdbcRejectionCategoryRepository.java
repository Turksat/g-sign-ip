package com.turksat.EU_Patent_Registration_Project.dataAccess.concretes;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.RejectionCategoryRepository;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.RejectionCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class JdbcRejectionCategoryRepository implements RejectionCategoryRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcRejectionCategoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<RejectionCategory> getAll() {
        String sql = "SELECT id, rejection_category_name FROM gsignip.rejection_categories ORDER BY id";
        return jdbcTemplate.query(sql, new RejectionCategoryRowMapper());
    }

    private static class RejectionCategoryRowMapper implements RowMapper<RejectionCategory> {
        @Override
        public RejectionCategory mapRow(ResultSet rs, int rowNum) throws SQLException {
            RejectionCategory rejectionCategory = new RejectionCategory();
            rejectionCategory.setId(rs.getInt("id"));
            rejectionCategory.setRejectionCategoryName(rs.getString("rejection_category_name"));
            return rejectionCategory;
        }
    }
}
