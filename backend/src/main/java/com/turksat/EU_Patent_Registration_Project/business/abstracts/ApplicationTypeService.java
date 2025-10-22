package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.ApplicationType;

import java.util.List;

public interface ApplicationTypeService {
    DataResult<List<ApplicationType>> getAllApplicationTypes();
}
