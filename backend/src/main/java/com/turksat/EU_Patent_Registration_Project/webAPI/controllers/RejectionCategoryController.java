package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.RejectionCategoryService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.RejectionCategoryResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rejection-categories")
public class RejectionCategoryController {

    private final RejectionCategoryService rejectionCategoryService;

    @Autowired
    public RejectionCategoryController(RejectionCategoryService rejectionCategoryService) {
        this.rejectionCategoryService = rejectionCategoryService;
    }

    @GetMapping("/getall")
    public ResponseEntity<DataResult<List<RejectionCategoryResponseDTO>>> getAll() {
        DataResult<List<RejectionCategoryResponseDTO>> result = rejectionCategoryService.getAll();
        return ResponseEntity.ok(result);
    }
}
