package com.turksat.EU_Patent_Registration_Project.dataAccess.concretes;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.StateRepository;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.State;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JdbcStateRepository implements StateRepository {
    private final JdbcTemplate jdbcTemplate;

    public JdbcStateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<State> getAllStates() {
        String sql = "SELECT state_id, state_name, country_id FROM gsignip.states ORDER BY state_name";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            State state = new State();
            state.setStateId(rs.getInt("state_id"));
            state.setStateName(rs.getString("state_name"));
            state.setCountryId(rs.getInt("country_id"));
            return state;
        });
    }

    @Override
    public List<State> getStatesByCountryId(int countryId) {
        String sql = "SELECT state_id, state_name, country_id FROM gsignip.states WHERE country_id = ? ORDER BY state_name";
        List<State> states = jdbcTemplate.query(sql, (rs, rowNum) -> {
            State state = new State();
            state.setStateId(rs.getInt("state_id"));
            state.setStateName(rs.getString("state_name"));
            state.setCountryId(rs.getInt("country_id"));
            return state;
        }, countryId);
        return states;
    }

    @Override
    public State getStateById(int id) {
        String sql = "SELECT state_id, state_name, country_id FROM gsignip.states WHERE state_id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            State state = new State();
            state.setStateId(rs.getInt("state_id"));
            state.setStateName(rs.getString("state_name"));
            state.setCountryId(rs.getInt("country_id"));
            return state;
        }, id);
    }
}
