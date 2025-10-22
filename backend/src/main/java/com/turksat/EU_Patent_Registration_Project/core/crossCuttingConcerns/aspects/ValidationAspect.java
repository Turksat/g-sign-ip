package com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.aspects;


import com.turksat.EU_Patent_Registration_Project.core.crossCuttingConcerns.validations.Validator;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ValidationAspect {

    private final ApplicationContext context;

    @Autowired
    public ValidationAspect(ApplicationContext context) {
        this.context = context;
    }

    @Before("execution(* *..business..*Service.*(..))")
    public void validateArguments(JoinPoint joinPoint) {
        for (Object arg : joinPoint.getArgs()) {
            if (arg == null) continue;

            String validatorBeanName = getValidatorBeanName(arg.getClass());
            if (context.containsBean(validatorBeanName)) {
                @SuppressWarnings("unchecked")
                Validator<Object> validator = (Validator<Object>) context.getBean(validatorBeanName);
                validator.validate(arg);
            }
        }
    }

    private String getValidatorBeanName(Class<?> dtoClass) {
        String base = dtoClass.getSimpleName() + "Validator";
        return Character.toLowerCase(base.charAt(0)) + base.substring(1);
    }
}
