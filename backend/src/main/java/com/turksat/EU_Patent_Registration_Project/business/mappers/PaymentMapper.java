package com.turksat.EU_Patent_Registration_Project.business.mappers;

import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.PaymentRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.ApplicationInfoResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.Payment;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    ApplicationInfoResponseDTO userToApplicationInfoResponseDTO(User user);
    @Mapping(target = "paymentId", ignore = true)
    @Mapping(target = "applicationNo", ignore = true)
    Payment paymentRequestDTOtoPayment(PaymentRequestDTO paymentRequestDTO);
}
