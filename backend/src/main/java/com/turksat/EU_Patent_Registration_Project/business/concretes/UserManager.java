package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.UserService;
import com.turksat.EU_Patent_Registration_Project.business.mappers.UserMapper;
import com.turksat.EU_Patent_Registration_Project.business.rules.UserBusinessRules;
import com.turksat.EU_Patent_Registration_Project.core.utils.BusinessRules;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.*;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.UserRepository;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.UserRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.UserResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserManager implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserBusinessRules userBusinessRules;

    public UserManager(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder,
            UserBusinessRules userBusinessRules) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.userBusinessRules = userBusinessRules;
    }

    @Override
    public DataResult<List<UserResponseDTO>> getAllUsers() {
        return new SuccessDataResult<>(
                userMapper.usersToUserResponseDTOs(userRepository.getAllUsers()),
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public DataResult<UserResponseDTO> getUserById(int id) {
        Result ruleCheck = BusinessRules.run(userBusinessRules.checkIfUserExistsById(id));
        if (ruleCheck != null) {
            return new ErrorDataResult<>(
                    null,
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }
        return new SuccessDataResult<>(
                userMapper.userToUserResponseDTO(userRepository.getUserById(id)),
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public DataResult<UserResponseDTO> getUserByEmail(String email) {
        return new SuccessDataResult<>(
                userMapper.userToUserResponseDTO(userRepository.getUserByEmail(email)),
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    // i need to fix this part (deveopler might see the actual password)
    @Override
    public Result createUser(UserRequestDTO userRequestDTO) {
        // Check if email already exists
        Result ruleCheck = BusinessRules.run(userBusinessRules.checkIfEmailExists(userRequestDTO.getEmail()));
        if (ruleCheck != null) {
            return new ErrorResult(
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }

        User user = userMapper.userRequestDTOToUser(userRequestDTO);
        String hashedPassword = passwordEncoder.encode(userRequestDTO.getPassword());
        user.setPasswordHash(hashedPassword);
        user.setUserRoleId(1);
        userRepository.createUser(user);
        return new SuccessResult(
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result updateUser(int id, UserRequestDTO userRequestDTO) {
        // Check if user exists
        Result ruleCheck = BusinessRules.run(userBusinessRules.checkIfUserExistsById(id));
        if (ruleCheck != null) {
            return new ErrorResult(
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }

        User user = userMapper.userRequestDTOToUser(userRequestDTO);
        String hashedPassword = passwordEncoder.encode(userRequestDTO.getPassword());
        user.setPasswordHash(hashedPassword);
        user.setUserId(id);
        // userRoleId is already set from userRequestDTO via mapper
        userRepository.updateUser(user);
        return new SuccessResult(
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result deleteUser(int id) {
        Result ruleCheck = BusinessRules.run(userBusinessRules.checkIfUserExistsById(id));
        if (ruleCheck != null) {
            return new ErrorResult(
                    ruleCheck.getMessage(),
                    ruleCheck.getCode());
        }
        userRepository.deleteUser(id);
        return new SuccessResult(
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }
}
