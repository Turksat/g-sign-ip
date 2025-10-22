package com.turksat.EU_Patent_Registration_Project.core.utils.results;

import org.springframework.http.HttpStatus;

public enum ResultStatus {
    // generic 1000-1099
    SUCCESS("1000", "Operation successful.", HttpStatus.OK),
    FAILURE("1001", "Operation failed.", HttpStatus.BAD_REQUEST),
    VALIDATION_ERROR("1002", "Validation error.", HttpStatus.BAD_REQUEST),
    JWT_INVALID("1003", "JWT is invalid.", HttpStatus.UNAUTHORIZED),
    JWT_EXPIRED("1004", "JWT is expired.", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("1005", "Unauthorized.", HttpStatus.UNAUTHORIZED),
    // user related 1100-1199
    USER_NOT_FOUND("1100", "User not found.", HttpStatus.NOT_FOUND),
    EMAIL_EXISTS("1101", "Email already exists.", HttpStatus.CONFLICT),
    // application related 1200-1299
    APPLICATION_DOESNT_EXISTS("1200", "Application does'nt exists", HttpStatus.NOT_FOUND),
    APPLICATION_NOT_COMPLETED("1201", "Application is not completed.", HttpStatus.CONFLICT),
    // payment related 1250-1299
    PAYMENT_ALREADY_EXISTS("1250", "Payment already exists for this application.", HttpStatus.OK),
    // patent related 1300-1399
    NO_PATENTS_FOUND("1300", "No patents found matching your search criteria.", HttpStatus.OK);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ResultStatus(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public static HttpStatus fromCode(String code) {
        for (ResultStatus status : ResultStatus.values()) {
            if (status.code.equals(code)) {
                return status.getHttpStatus();
            }
        }
        return HttpStatus.INTERNAL_SERVER_ERROR; // default fallback instead of null
    }
}
