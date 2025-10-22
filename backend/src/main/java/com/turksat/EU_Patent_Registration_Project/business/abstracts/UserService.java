package com.turksat.EU_Patent_Registration_Project.business.abstracts;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.Result;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.UserRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.UserResponseDTO;

import java.util.List;

public interface UserService {
    DataResult<List<UserResponseDTO>> getAllUsers();
    DataResult<UserResponseDTO> getUserById(int id);
    DataResult<UserResponseDTO> getUserByEmail(String email);
    Result createUser(UserRequestDTO userRequestDTO);
    Result updateUser(int id ,UserRequestDTO userRequestDTO);
    Result deleteUser(int id);
}
