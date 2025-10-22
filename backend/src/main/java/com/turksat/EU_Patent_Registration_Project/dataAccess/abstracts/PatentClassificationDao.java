package com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts;

import com.turksat.EU_Patent_Registration_Project.entities.PatentClassification;
import java.util.List;

public interface PatentClassificationDao {
    List<PatentClassification> findAll();
}
