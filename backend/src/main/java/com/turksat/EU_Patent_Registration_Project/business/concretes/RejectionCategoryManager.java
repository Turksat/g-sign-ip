package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.RejectionCategoryService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessDataResult;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.RejectionCategoryRepository;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.RejectionCategoryResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.RejectionCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RejectionCategoryManager implements RejectionCategoryService {

    private final RejectionCategoryRepository rejectionCategoryRepository;

    @Autowired
    public RejectionCategoryManager(RejectionCategoryRepository rejectionCategoryRepository) {
        this.rejectionCategoryRepository = rejectionCategoryRepository;
    }

    @Override
    public DataResult<List<RejectionCategoryResponseDTO>> getAll() {
        try {
            List<RejectionCategory> rejectionCategories = rejectionCategoryRepository.getAll();
            List<RejectionCategoryResponseDTO> rejectionCategoryResponseDTOs = rejectionCategories.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());

            return new SuccessDataResult<>(rejectionCategoryResponseDTOs, "Rejection categories retrieved successfully",
                    "1000");
        } catch (Exception e) {
            return new SuccessDataResult<>(null, "Error retrieving rejection categories: " + e.getMessage(), "1001");
        }
    }

    private RejectionCategoryResponseDTO convertToResponseDTO(RejectionCategory rejectionCategory) {
        return new RejectionCategoryResponseDTO(
                rejectionCategory.getId(),
                rejectionCategory.getRejectionCategoryName());
    }
}
