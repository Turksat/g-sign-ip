package com.turksat.EU_Patent_Registration_Project.business.rules;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.ErrorResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.Result;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessResult;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.ApplicationRepository;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class ApplicationBusinessRules {
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public ApplicationBusinessRules(ApplicationRepository applicationRepository, UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }
    public Result checkIfApplicationExists(String applicationNo) {
        if (!applicationRepository.existsByApplicationNo(applicationNo)) {
            return new ErrorResult(ResultStatus.APPLICATION_DOESNT_EXISTS.getMessage(),
                    ResultStatus.APPLICATION_DOESNT_EXISTS.getCode());
        }
        return new SuccessResult();
    }
    public Result checkIfUserExists(int id) {
        if (!userRepository.existsById(id)) {
            return new ErrorResult(ResultStatus.USER_NOT_FOUND.getMessage(),
                    ResultStatus.USER_NOT_FOUND.getCode());
        }
        return new SuccessResult();
    }
}
