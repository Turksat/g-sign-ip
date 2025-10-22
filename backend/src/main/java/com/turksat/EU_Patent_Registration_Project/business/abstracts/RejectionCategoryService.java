package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.RejectionCategoryResponseDTO;

import java.util.List;

public interface RejectionCategoryService {
    DataResult<List<RejectionCategoryResponseDTO>> getAll();
}
