package com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts;

import com.turksat.EU_Patent_Registration_Project.entities.ApplicationType;
import java.util.List;

public interface ApplicationTypeDao {
    List<ApplicationType> findAll();
}
