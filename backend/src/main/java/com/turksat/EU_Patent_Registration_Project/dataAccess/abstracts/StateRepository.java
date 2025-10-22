package com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts;

import com.turksat.EU_Patent_Registration_Project.entities.concretes.State;

import java.util.List;

public interface StateRepository {
    List<State> getAllStates();

    List<State> getStatesByCountryId(int countryId);

    State getStateById(int id);
}
