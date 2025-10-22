package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.PatentClassification;

import java.util.List;

public interface PatentClassificationService {
    DataResult<List<PatentClassification>> getAllPatentClassifications();
}
