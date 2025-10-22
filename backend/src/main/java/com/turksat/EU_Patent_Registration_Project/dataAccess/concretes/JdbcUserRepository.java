package com.turksat.EU_Patent_Registration_Project.dataAccess.concretes;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.UserRepository;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.User;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JdbcUserRepository implements UserRepository {
    private JdbcTemplate jdbcTemplate;

    public JdbcUserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<User> getAllUsers() {
        String sql = "SELECT u.*,r.user_role_name AS user_role FROM gsignip.users u" +
                " JOIN gsignip.user_roles r ON u.user_role_id = r.user_role_id";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(User.class));
    }

    @Override
    public User getUserById(int id) {
        String sql = "SELECT u.*,r.user_role_name AS user_role FROM gsignip.users u" +
                "  JOIN gsignip.user_roles r ON u.user_role_id = r.user_role_id WHERE user_id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), id);
    }

    @Override
    public User getUserByEmail(String email) {
        String sql = "SELECT u.*,r.user_role_name AS user_role FROM gsignip.users u" +
                "  JOIN gsignip.user_roles r ON u.user_role_id = r.user_role_id WHERE email = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), email);
    }

    @Override
    public User getUserByApplicationNo(String applicationNo) {
        String sql = """
                    SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone_number
                    FROM gsignip.users u
                    JOIN gsignip.applications a ON a.user_id = u.user_id
                    WHERE a.application_no = ?
                """;

        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { applicationNo }, (rs, rowNum) -> {
                User user = new User();
                user.setUserId(rs.getInt("user_id"));
                user.setFirstName(rs.getString("first_name"));
                user.setLastName(rs.getString("last_name"));
                user.setEmail(rs.getString("email"));
                user.setPhoneNumber(rs.getString("phone_number"));
                return user;
            });
        } catch (EmptyResultDataAccessException e) {
            return null; // or throw custom NotFoundException
        }
    }

    @Override
    public void createUser(User user) {
        String sql = "INSERT INTO gsignip.users (phone_number_country_code_id,user_role_id,password_hash,first_name," +
                "middle_name,last_name,email,phone_number) VALUES (?,?,?,?,?,?,?,?)";
        jdbcTemplate.update(sql, user.getPhoneNumberCountryCodeId(), user.getUserRoleId(), user.getPasswordHash(),
                user.getFirstName(),
                user.getMiddleName(), user.getLastName(), user.getEmail(), user.getPhoneNumber());

    }

    @Override
    public void updateUser(User user) {
        String sql = "UPDATE gsignip.users SET " +
                "phone_number_country_code_id = ?, " +
                "user_role_id = ?, " +
                "password_hash = ?, " +
                "first_name = ?, " +
                "middle_name = ?, " +
                "last_name = ?, " +
                "email = ?, " +
                "phone_number = ? " +
                "WHERE user_id = ?";

        jdbcTemplate.update(sql,
                user.getPhoneNumberCountryCodeId(),
                user.getUserRoleId(),
                user.getPasswordHash(),
                user.getFirstName(),
                user.getMiddleName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getUserId());
    }

    @Override
    public void deleteUser(int id) {
        String sql = "DELETE FROM gsignip.users WHERE user_id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public boolean existsById(int id) {
        String sql = "SELECT EXISTS (SELECT 1 FROM gsignip.users WHERE user_id = ?)";
        return jdbcTemplate.queryForObject(sql, Boolean.class, id);
    }

    @Override
    public boolean existsByEmail(String email) {
        String sql = "SELECT EXISTS (SELECT 1 FROM gsignip.users WHERE email = ?)";
        return jdbcTemplate.queryForObject(sql, Boolean.class, email);
    }
}
