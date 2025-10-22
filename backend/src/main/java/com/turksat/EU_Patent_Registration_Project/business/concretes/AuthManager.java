package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.AuthService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessDataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.security.JWTUtil;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.AuthRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthManager implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    AuthManager(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }
    @Override
    public DataResult<String> generateToken(AuthRequestDTO authRequestDTO) {
        try {
            // Authentication işlemi
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequestDTO.getEmail(), authRequestDTO.getPassword())
            );
            
            // User bilgilerini al
            User user = (User) authentication.getPrincipal();
            
            // JWT token'ı user bilgileri ile oluştur
            String token = jwtUtil.generateTokenWithUserInfo(
                user.getUsername(),
                user.getFirstName(),
                user.getMiddleName(),
                user.getLastName(),
                user.getEmail(),
                user.getUserRoleId(),
                user.getPhoneNumber(),
                user.getPhoneNumberCountryCodeId(),
                user.getUserId()
            );
            
            return new SuccessDataResult<>(token,
                    ResultStatus.SUCCESS.getMessage(),
                    ResultStatus.SUCCESS.getCode()) ;
        } catch (AuthenticationException e) {
            System.out.println(e);
            throw new AuthenticationException("Username or password is wrong") {
            };
        }
    }
}
