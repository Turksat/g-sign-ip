package com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts;

import com.turksat.EU_Patent_Registration_Project.entities.concretes.FeedbackCategory;

import java.util.List;

public interface FeedbackCategoryRepository {
    List<FeedbackCategory> getAll();
}
