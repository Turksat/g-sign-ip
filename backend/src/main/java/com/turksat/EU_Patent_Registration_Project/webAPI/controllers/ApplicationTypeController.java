package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.ApplicationTypeService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.ApplicationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/application-types")
public class ApplicationTypeController {

    private final ApplicationTypeService applicationTypeService;

    @Autowired
    public ApplicationTypeController(ApplicationTypeService applicationTypeService) {
        this.applicationTypeService = applicationTypeService;
    }

    @GetMapping("/all")
    public ResponseEntity<DataResult<List<ApplicationType>>> getAllApplicationTypes() {
        DataResult<List<ApplicationType>> result = applicationTypeService.getAllApplicationTypes();
        return ResponseEntity.ok(result);
    }
}
