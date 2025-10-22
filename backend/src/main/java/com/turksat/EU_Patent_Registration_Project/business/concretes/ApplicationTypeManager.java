package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.ApplicationTypeService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessDataResult;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.ApplicationTypeDao;
import com.turksat.EU_Patent_Registration_Project.entities.ApplicationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationTypeManager implements ApplicationTypeService {

    private final ApplicationTypeDao applicationTypeDao;

    @Autowired
    public ApplicationTypeManager(ApplicationTypeDao applicationTypeDao) {
        this.applicationTypeDao = applicationTypeDao;
    }

    @Override
    public DataResult<List<ApplicationType>> getAllApplicationTypes() {
        List<ApplicationType> applicationTypes = applicationTypeDao.findAll();
        return new SuccessDataResult<>(applicationTypes, "Application types retrieved successfully");
    }
}
