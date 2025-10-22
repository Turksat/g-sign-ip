
package com.turksat.EU_Patent_Registration_Project.core.utils.results;

public class SuccessResult extends Result {

    public SuccessResult() {
        super(true);
    }

    public SuccessResult(String message) {
        super(true, message);
    }

    public SuccessResult(String message, String code) {
        super(true, message, code);
    }
}
