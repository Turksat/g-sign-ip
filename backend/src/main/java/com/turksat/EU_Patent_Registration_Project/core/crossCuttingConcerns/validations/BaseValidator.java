package com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations;


import com.turksat.EU_Patent_Registration_Project.core.exceptions.ValidationException;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.ApplicationDocument;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public abstract class BaseValidator<T> implements Validator<T> {

    protected void checkNotNull(Object value, String fieldName) {
        if (value == null ) {
            throw new ValidationException(fieldName + " cannot be null.");
        }
    }

    protected void checkNotBlank(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new ValidationException(fieldName + " cannot be blank.");
        }
    }
    protected void checkApplicationDocumentListNotBlank(List<ApplicationDocument> list, String fieldName) {
        if (list == null) return;
        if (list.isEmpty()) {
            throw new ValidationException(fieldName + " must not be null or empty.");
        }

        for (int i = 0; i < list.size(); i++) {
            ApplicationDocument value = list.get(i);
            if (value == null ) {
                throw new ValidationException(fieldName + "[" + i + "] must not be blank.");
            }
        }
    }

    protected void checkEmailFormat(String value, String fieldName) {
        if (value == null || !value.contains("@")) {
            throw new ValidationException(fieldName + " must be a valid email.");
        }
    }

    protected void checkLength(String value, String fieldName, int min, int max) {
        if (value == null) return;
        int len = value.length();
        if (len < min || len > max) {
            throw new ValidationException(fieldName + " must be between " + min + " and " + max + " characters.");
        }
    }
    protected void checkSpecifiedLength(String value, String fieldName, int number) {
        if (value == null) return;
        int len = value.length();
        if (len != number) {
            throw new ValidationException(fieldName + " must be " + number + " characters.");
        }
    }
    protected void checkPhoneFormat(String value, String fieldName) {
        if (value == null || !value.matches("^[0-9]+$")) {
            throw new ValidationException(fieldName + " must be a valid phone number (digits only).");
        }
    }
    protected void checkDecimalRange(BigDecimal value, String fieldName, BigDecimal min, BigDecimal max) {
        if (value == null) return;
        if (value.compareTo(min) < 0 || value.compareTo(max) > 0) {
            throw new ValidationException(fieldName + " must be between " + min + " and " + max + ".");
        }
    }
    protected void checkDateBeforeToday(LocalDate value, String fieldName) {
        if (value == null) return;
        if (!value.isBefore(LocalDate.now())) {
            throw new ValidationException(fieldName + " must be before today.");
        }
    }


    // Add more reusable rules here...
}
