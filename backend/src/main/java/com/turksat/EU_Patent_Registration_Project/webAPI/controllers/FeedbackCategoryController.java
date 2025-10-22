package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.FeedbackCategoryService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.FeedbackCategoryResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/feedback-categories")
public class FeedbackCategoryController {

    private final FeedbackCategoryService feedbackCategoryService;

    @Autowired
    public FeedbackCategoryController(FeedbackCategoryService feedbackCategoryService) {
        this.feedbackCategoryService = feedbackCategoryService;
    }

    @GetMapping("/getall")
    public ResponseEntity<DataResult<List<FeedbackCategoryResponseDTO>>> getAll() {
        DataResult<List<FeedbackCategoryResponseDTO>> result = feedbackCategoryService.getAll();
        return ResponseEntity.ok(result);
    }
}
