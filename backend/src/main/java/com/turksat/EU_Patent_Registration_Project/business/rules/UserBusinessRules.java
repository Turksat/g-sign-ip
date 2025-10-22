package com.turksat.EU_Patent_Registration_Project.business.rules;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.ErrorResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.Result;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessResult;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class UserBusinessRules {
    private UserRepository userRepository;

    public UserBusinessRules(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Result checkIfUserExistsById(int id) {
        if (!userRepository.existsById(id)) {
            return new ErrorResult(ResultStatus.USER_NOT_FOUND.getMessage(),
                    ResultStatus.USER_NOT_FOUND.getCode());
        }
        return new SuccessResult();
    }

    public Result checkIfEmailExists(String email) {
        if (userRepository.existsByEmail(email)) {
            return new ErrorResult(ResultStatus.EMAIL_EXISTS.getMessage(),
                    ResultStatus.EMAIL_EXISTS.getCode());
        }
        return new SuccessResult();
    }
}
