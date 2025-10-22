package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.PatentClassificationService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.PatentClassification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patent-classifications")
public class PatentClassificationController {

    private final PatentClassificationService patentClassificationService;

    @Autowired
    public PatentClassificationController(PatentClassificationService patentClassificationService) {
        this.patentClassificationService = patentClassificationService;
    }

    @GetMapping("/all")
    public ResponseEntity<DataResult<List<PatentClassification>>> getAllPatentClassifications() {
        DataResult<List<PatentClassification>> result = patentClassificationService.getAllPatentClassifications();
        return ResponseEntity.ok(result);
    }
}
