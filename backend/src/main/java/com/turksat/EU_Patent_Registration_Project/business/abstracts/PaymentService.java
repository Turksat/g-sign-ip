package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.Result;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.PaymentRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationInfoResponseDTO;

public interface PaymentService {
    DataResult<ApplicationInfoResponseDTO> getApplicationInfoForPaymentPage(String applicationNo);

    Result createPayment(String applicationNo, PaymentRequestDTO paymentRequestDTO);
}
