package com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts;

import com.turksat.EU_Patent_Registration_Project.entities.concretes.Gender;

import java.util.List;

public interface GenderRepository {
    List<Gender> getAllGenders();

    Gender getGenderById(int id);
}
