package com.turksat.EU_Patent_Registration_Project.core.utils.results;

public class ErrorResult extends Result {

    public ErrorResult() {
        super(false);
    }

    public ErrorResult(String message) {
        super(false, message);
    }

    public ErrorResult(String message, String code) {
        super(false, message, code);
    }
}
