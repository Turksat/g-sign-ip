package com.turksat.EU_Patent_Registration_Project.core.utils.results;

public class DataResult<T> extends Result {

    private T data;

    public DataResult(T data, boolean success) {
        super(success);
        this.data = data;
    }

    public DataResult(T data, boolean success, String message) {
        super(success, message);
        this.data = data;
    }

    public DataResult(T data, boolean success, String message, String code) {
        super(success, message, code);
        this.data = data;
    }

    public T getData() {
        return data;
    }
}
