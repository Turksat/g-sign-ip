package com.turksat.EU_Patent_Registration_Project.core.utils.results;

public class ErrorDataResult<T> extends DataResult<T> {

    public ErrorDataResult(T data) {
        super(data, false);
    }

    public ErrorDataResult(T data, String message) {
        super(data, false, message);
    }

    public ErrorDataResult(T data, String message, String code) {
        super(data, false, message, code);
    }
}
