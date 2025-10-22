package com.turksat.EU_Patent_Registration_Project.business.abstracts;

import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.Result;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.SendFeedbackRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.SendFeedbackResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SendFeedbackService {
    Result approveFeedback(SendFeedbackRequestDTO sendFeedbackRequestDTO, MultipartFile file);

    Result sendFeedback(SendFeedbackRequestDTO sendFeedbackRequestDTO, MultipartFile file);

    Result rejectApplication(SendFeedbackRequestDTO sendFeedbackRequestDTO, MultipartFile file);

    DataResult<SendFeedbackResponseDTO> getSendFeedbackById(int id);

    DataResult<List<SendFeedbackResponseDTO>> getAllSendFeedback();

    DataResult<SendFeedbackResponseDTO> getLatestFeedbackByApplicationNo(String applicationNo, int feedbackType);

    byte[] getFeedbackFileData(int id);

    Result deleteSendFeedback(int id);
}
