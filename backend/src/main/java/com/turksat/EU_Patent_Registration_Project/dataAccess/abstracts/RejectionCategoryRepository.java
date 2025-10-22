package com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts;

import com.turksat.EU_Patent_Registration_Project.entities.concretes.RejectionCategory;

import java.util.List;

public interface RejectionCategoryRepository {
    List<RejectionCategory> getAll();
}
