package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.FeedbackCategoryService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessDataResult;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.FeedbackCategoryRepository;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.FeedbackCategoryResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.FeedbackCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackCategoryManager implements FeedbackCategoryService {

    private final FeedbackCategoryRepository feedbackCategoryRepository;

    @Autowired
    public FeedbackCategoryManager(FeedbackCategoryRepository feedbackCategoryRepository) {
        this.feedbackCategoryRepository = feedbackCategoryRepository;
    }

    @Override
    public DataResult<List<FeedbackCategoryResponseDTO>> getAll() {
        List<FeedbackCategory> feedbackCategories = feedbackCategoryRepository.getAll();

        List<FeedbackCategoryResponseDTO> feedbackCategoryDTOs = feedbackCategories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new SuccessDataResult<>(feedbackCategoryDTOs, "Feedback categories retrieved successfully");
    }

    private FeedbackCategoryResponseDTO convertToDTO(FeedbackCategory feedbackCategory) {
        return new FeedbackCategoryResponseDTO(
                feedbackCategory.getId(),
                feedbackCategory.getFeedbackCategoryDescription());
    }
}
