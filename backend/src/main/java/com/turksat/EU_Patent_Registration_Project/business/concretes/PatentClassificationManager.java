package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.PatentClassificationService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessDataResult;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.PatentClassificationDao;
import com.turksat.EU_Patent_Registration_Project.entities.PatentClassification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatentClassificationManager implements PatentClassificationService {

    private final PatentClassificationDao patentClassificationDao;

    @Autowired
    public PatentClassificationManager(PatentClassificationDao patentClassificationDao) {
        this.patentClassificationDao = patentClassificationDao;
    }

    @Override
    public DataResult<List<PatentClassification>> getAllPatentClassifications() {
        List<PatentClassification> patentClassifications = patentClassificationDao.findAll();
        return new SuccessDataResult<>(patentClassifications, "Patent classifications retrieved successfully");
    }
}
