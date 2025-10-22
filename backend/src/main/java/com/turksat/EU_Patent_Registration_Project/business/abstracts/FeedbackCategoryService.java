package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.FeedbackCategoryResponseDTO;

import java.util.List;

public interface FeedbackCategoryService {
    DataResult<List<FeedbackCategoryResponseDTO>> getAll();
}
