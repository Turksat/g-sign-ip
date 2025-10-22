package com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts;

import com.turksat.EU_Patent_Registration_Project.entities.concretes.Payment;

public interface PaymentRepository {
    void createPayment(Payment payment);

    Payment getPaymentByApplicationNo(String applicationNo);

    boolean existsByApplicationNo(String applicationNo);
}
