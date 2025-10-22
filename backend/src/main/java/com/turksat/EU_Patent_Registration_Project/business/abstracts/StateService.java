package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.StateResponseDTO;

import java.util.List;

public interface StateService {
    DataResult<List<StateResponseDTO>> getAllStates();

    DataResult<List<StateResponseDTO>> getStatesByCountryId(int countryId);

    DataResult<StateResponseDTO> getStateById(int id);
}
