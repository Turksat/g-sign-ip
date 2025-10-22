package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.PaymentService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.Result;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.PaymentRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationInfoResponseDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/get-application-info-for-payment-page/{applicationNo}")
    public ResponseEntity<DataResult<ApplicationInfoResponseDTO>> getApplicationInfoForPaymentPage(
            @PathVariable String applicationNo) {
        DataResult<ApplicationInfoResponseDTO> result = paymentService.getApplicationInfoForPaymentPage(applicationNo);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @PostMapping("/create-payment/{applicationNo}")
    public ResponseEntity<Result> createPayment(@PathVariable String applicationNo,
            @RequestBody PaymentRequestDTO paymentRequestDTO) {
        Result result = paymentService.createPayment(applicationNo, paymentRequestDTO);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

}
