package com.turksat.EU_Patent_Registration_Project.core.utils.results;

public class Result {

    private boolean success;
    private String message;
    private String code;

    public Result(boolean success) {
        this.success = success;
    }

    public Result(boolean success, String message) {
        this(success);
        this.message = message;
    }

    public Result(boolean success, String message, String code) {
        this(success, message);
        this.code = code;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getCode() {
        return code;
    }
}
