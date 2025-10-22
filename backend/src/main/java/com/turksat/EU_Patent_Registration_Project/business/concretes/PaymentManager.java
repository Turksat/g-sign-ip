package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.PaymentService;
import com.turksat.EU_Patent_Registration_Project.business.mappers.PaymentMapper;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.*;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.ApplicationRepository;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.PaymentRepository;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.UserRepository;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.PaymentRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationInfoResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Payment;
import org.springframework.stereotype.Service;

@Service
public class PaymentManager implements PaymentService {
    PaymentRepository paymentRepository;
    ApplicationRepository applicationRepository;
    UserRepository userRepository;
    PaymentMapper paymentMapper;

    public PaymentManager(PaymentRepository paymentRepository,
            UserRepository userRepository,
            PaymentMapper paymentMapper,
            ApplicationRepository applicationRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.paymentMapper = paymentMapper;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public DataResult<ApplicationInfoResponseDTO> getApplicationInfoForPaymentPage(String applicationNo) {
        return new SuccessDataResult<>(
                paymentMapper.userToApplicationInfoResponseDTO(userRepository.getUserByApplicationNo(applicationNo)),
                ResultStatus.SUCCESS.getMessage(),
                ResultStatus.SUCCESS.getCode());
    }

    @Override
    public Result createPayment(String applicationNo, PaymentRequestDTO paymentRequestDTO) {
        try {
            // Check if payment already exists for this application
            if (paymentRepository.existsByApplicationNo(applicationNo)) {
                return new SuccessResult(
                        ResultStatus.PAYMENT_ALREADY_EXISTS.getMessage(),
                        ResultStatus.PAYMENT_ALREADY_EXISTS.getCode());
            }

            // Create payment record in payments table
            Payment payment = paymentMapper.paymentRequestDTOtoPayment(paymentRequestDTO);
            payment.setApplicationNo(applicationNo);
            payment.setPaymentStatus("PAID");
            // Set payment date to current time
            payment.setPaymentDate(java.time.OffsetDateTime.now());
            paymentRepository.createPayment(payment);

            // Update application status to 1 (Completed)
            applicationRepository.modifyApplicationStatus(applicationNo, 1);

            return new SuccessResult(
                    ResultStatus.SUCCESS.getMessage(),
                    ResultStatus.SUCCESS.getCode());
        } catch (Exception e) {
            return new ErrorResult(
                    "Payment processing failed: " + e.getMessage(),
                    ResultStatus.FAILURE.getCode());
        }
    }
}
