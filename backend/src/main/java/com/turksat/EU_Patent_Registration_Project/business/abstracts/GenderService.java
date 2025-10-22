package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.GenderResponseDTO;

import java.util.List;

public interface GenderService {
    DataResult<List<GenderResponseDTO>> getAllGenders();

    DataResult<GenderResponseDTO> getGenderById(int id);
}
