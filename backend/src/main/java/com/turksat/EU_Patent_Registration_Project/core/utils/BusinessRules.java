package com.turksat.EU_Patent_Registration_Project.core.utils;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.Result;

public class BusinessRules {
    @SafeVarargs
    public static Result run(Result... rules) {
        for (Result rule : rules) {
            if (!rule.isSuccess()) {
                return rule; // return first failure
            }
        }
        return null; // all rules passed
    }
}
