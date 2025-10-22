package com.turksat.EU_Patent_Registration_Project.dataAccess.concretes;

import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.PaymentRepository;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Payment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcPaymentRepository implements PaymentRepository {
    JdbcTemplate jdbcTemplate;

    public JdbcPaymentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void createPayment(Payment payment) {
        String sql = """
                    INSERT INTO gsignip.payments (
                        application_no,
                        payment_date,
                        amount,
                        currency,
                        payment_status,
                        transaction_reference
                    ) VALUES (?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(sql,
                payment.getApplicationNo(),
                payment.getPaymentDate(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getPaymentStatus(),
                payment.getTransactionReference());
    }

    @Override
    public Payment getPaymentByApplicationNo(String applicationNo) {
        String sql = """
                    SELECT payment_id,
                           application_no,
                           payment_date,
                           amount,
                           currency,
                           payment_status
                    FROM gsignip.payments
                    WHERE application_no = ?
                    ORDER BY payment_date DESC
                    LIMIT 1
                """;

        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { applicationNo }, (rs, rowNum) -> {
                Payment payment = new Payment();
                payment.setPaymentId(rs.getInt("payment_id"));
                payment.setApplicationNo(rs.getString("application_no"));
                payment.setPaymentDate(rs.getObject("payment_date", java.time.OffsetDateTime.class));
                payment.setAmount(rs.getBigDecimal("amount"));
                payment.setCurrency(rs.getString("currency"));
                payment.setPaymentStatus(rs.getString("payment_status"));
                return payment;
            });
        } catch (Exception e) {
            // Payment bulunamadığında null döndür
            return null;
        }
    }

    @Override
    public boolean existsByApplicationNo(String applicationNo) {
        String sql = "SELECT EXISTS (SELECT 1 FROM gsignip.payments WHERE application_no = ?)";
        return jdbcTemplate.queryForObject(sql, Boolean.class, applicationNo);
    }
}
