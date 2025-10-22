package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.AuthRequestDTO;

public interface AuthService {
    public DataResult<String> generateToken(AuthRequestDTO authRequestDTO);
}
