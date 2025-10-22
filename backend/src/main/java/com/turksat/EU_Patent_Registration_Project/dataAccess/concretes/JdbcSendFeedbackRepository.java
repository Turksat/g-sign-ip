package com.turksat.EU_Patent_Registration_Project.dataAccess.concretes;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.SendFeedbackRepository;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.SendFeedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Array;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public class JdbcSendFeedbackRepository implements SendFeedbackRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcSendFeedbackRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void createSendFeedback(SendFeedback sendFeedback) {
        String sql = "INSERT INTO gsignip.send_feedback (remarks, description, file, feedback_categories, application_no, file_name, file_extension, feedback_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        // Convert int[] to Integer[] for PostgreSQL array
        Integer[] feedbackCategoriesArray = null;
        if (sendFeedback.getFeedbackCategories() != null) {
            feedbackCategoriesArray = new Integer[sendFeedback.getFeedbackCategories().length];
            for (int i = 0; i < sendFeedback.getFeedbackCategories().length; i++) {
                feedbackCategoriesArray[i] = sendFeedback.getFeedbackCategories()[i];
            }
        }

        jdbcTemplate.update(sql,
                sendFeedback.getRemarks(),
                sendFeedback.getDescription(),
                sendFeedback.getFile(),
                feedbackCategoriesArray,
                sendFeedback.getApplicationNo(),
                sendFeedback.getFileName(),
                sendFeedback.getFileExtension(),
                sendFeedback.getFeedbackType());
    }

    @Override
    public SendFeedback getSendFeedbackById(int id) {
        try {
            String sql = "SELECT * FROM gsignip.send_feedback WHERE id = ?";
            return jdbcTemplate.queryForObject(sql, new SendFeedbackRowMapper(), id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<SendFeedback> getAllSendFeedback() {
        String sql = "SELECT * FROM gsignip.send_feedback ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new SendFeedbackRowMapper());
    }

    @Override
    public SendFeedback getLatestFeedbackByApplicationNo(String applicationNo, int feedbackType) {
        try {
            String sql = "SELECT * FROM gsignip.send_feedback WHERE application_no = ? AND feedback_type = ? ORDER BY id DESC LIMIT 1";
            return jdbcTemplate.queryForObject(sql, new SendFeedbackRowMapper(), applicationNo, feedbackType);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public void deleteSendFeedback(int id) {
        String sql = "DELETE FROM gsignip.send_feedback WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    private static class SendFeedbackRowMapper implements RowMapper<SendFeedback> {
        @Override
        public SendFeedback mapRow(ResultSet rs, int rowNum) throws SQLException {
            SendFeedback sendFeedback = new SendFeedback();
            sendFeedback.setId(rs.getInt("id"));
            sendFeedback.setRemarks(rs.getString("remarks"));
            sendFeedback.setDescription(rs.getString("description"));
            sendFeedback.setFile(rs.getBytes("file"));

            // Handle PostgreSQL array conversion
            Array feedbackCategoriesArray = rs.getArray("feedback_categories");
            if (feedbackCategoriesArray != null) {
                Integer[] categories = (Integer[]) feedbackCategoriesArray.getArray();
                int[] feedbackCategories = new int[categories.length];
                for (int i = 0; i < categories.length; i++) {
                    feedbackCategories[i] = categories[i];
                }
                sendFeedback.setFeedbackCategories(feedbackCategories);
            }

            sendFeedback.setApplicationNo(rs.getString("application_no"));
            sendFeedback.setFileName(rs.getString("file_name"));
            sendFeedback.setFileExtension(rs.getString("file_extension"));
            sendFeedback.setFeedbackType(rs.getInt("feedback_type"));

            // Handle timestamp field safely
            try {
                sendFeedback.setCreatedAt(rs.getObject("created_at", OffsetDateTime.class));
            } catch (Exception e) {
                sendFeedback.setCreatedAt(OffsetDateTime.now()); // Default to now if column doesn't exist
            }

            return sendFeedback;
        }
    }
}
