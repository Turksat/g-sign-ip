package com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations;

public interface Validator<T> {
    void validate(T target);
}
