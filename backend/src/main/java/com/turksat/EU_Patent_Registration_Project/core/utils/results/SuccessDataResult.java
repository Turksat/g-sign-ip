package com.turksat.EU_Patent_Registration_Project.core.utils.results;

public class SuccessDataResult<T> extends DataResult<T> {

    public SuccessDataResult(T data) {
        super(data, true);
    }

    public SuccessDataResult(T data, String message) {
        super(data, true, message);
    }

    public SuccessDataResult(T data, String message, String code) {
        super(data, true, message, code);
    }
}
