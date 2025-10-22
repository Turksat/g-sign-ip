package com.turksat.EU_Patent_Registration_Project.exceptions;

import com.turksat.EU_Patent_Registration_Project.core.exceptions.ValidationException;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ErrorResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResult> handleValidation(ValidationException ex) {
        return new ResponseEntity<>(
                new ErrorResult(
                        ex.getMessage(),
                        ResultStatus.VALIDATION_ERROR.getCode()
                ), ResultStatus.VALIDATION_ERROR.getHttpStatus()
        );
    }
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResult> handleAuthException(AuthenticationException ex) {
        return new ResponseEntity<>(
                new ErrorResult(
                        ex.getMessage(),
                        ResultStatus.VALIDATION_ERROR.getCode()
                ),ResultStatus.VALIDATION_ERROR.getHttpStatus()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResult> handleValidation(Exception ex) {
        return new ResponseEntity<>(
                new ErrorResult(
                        ex.getMessage(),
                        ResultStatus.FAILURE.getCode()
                ), ResultStatus.FAILURE.getHttpStatus()
        );
    }
}
