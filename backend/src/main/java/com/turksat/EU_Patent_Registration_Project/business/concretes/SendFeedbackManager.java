package com.turksat.EU_Patent_Registration_Project.business.concretes;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.SendFeedbackService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ErrorResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.Result;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessDataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.SuccessResult;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.SendFeedbackRepository;
import com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts.ApplicationRepository;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.SendFeedbackRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.SendFeedbackResponseDTO;
import com.turksat.EU_Patent_Registration_Project.entities.concretes.SendFeedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SendFeedbackManager implements SendFeedbackService {

    private final SendFeedbackRepository sendFeedbackRepository;
    private final ApplicationRepository applicationRepository;

    @Autowired
    public SendFeedbackManager(SendFeedbackRepository sendFeedbackRepository,
            ApplicationRepository applicationRepository) {
        this.sendFeedbackRepository = sendFeedbackRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public Result approveFeedback(SendFeedbackRequestDTO sendFeedbackRequestDTO, MultipartFile file) {
        try {
            SendFeedback sendFeedback = new SendFeedback();
            sendFeedback.setRemarks(sendFeedbackRequestDTO.getRemarks());
            sendFeedback.setDescription(sendFeedbackRequestDTO.getDescription());
            sendFeedback.setFeedbackCategories(sendFeedbackRequestDTO.getFeedbackCategories());
            sendFeedback.setApplicationNo(sendFeedbackRequestDTO.getApplicationNo());
            sendFeedback.setFeedbackType(1); // 1 = Approved
            sendFeedback.setCreatedAt(OffsetDateTime.now());

            // Handle file upload
            if (file != null && !file.isEmpty()) {
                sendFeedback.setFile(file.getBytes());
                sendFeedback.setFileName(file.getOriginalFilename());

                // Extract file extension
                String originalFilename = file.getOriginalFilename();
                if (originalFilename != null && originalFilename.contains(".")) {
                    String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    sendFeedback.setFileExtension(extension);
                }
            }

            sendFeedbackRepository.createSendFeedback(sendFeedback);

            // Update application status to 4 (Approved)
            applicationRepository.modifyApplicationStatus(sendFeedbackRequestDTO.getApplicationNo(), 4);

            return new SuccessResult("Application approved successfully with feedback.", "1000");

        } catch (IOException e) {
            return new ErrorResult("Error processing file: " + e.getMessage(), "1001");
        } catch (Exception e) {
            return new ErrorResult("Error approving application: " + e.getMessage(), "1001");
        }
    }

    @Override
    public Result sendFeedback(SendFeedbackRequestDTO sendFeedbackRequestDTO, MultipartFile file) {
        try {
            SendFeedback sendFeedback = new SendFeedback();
            sendFeedback.setRemarks(sendFeedbackRequestDTO.getRemarks());
            sendFeedback.setDescription(sendFeedbackRequestDTO.getDescription());
            sendFeedback.setFeedbackCategories(sendFeedbackRequestDTO.getFeedbackCategories());
            sendFeedback.setApplicationNo(sendFeedbackRequestDTO.getApplicationNo());
            sendFeedback.setFeedbackType(2); // 2 = Feedback Sent
            sendFeedback.setCreatedAt(OffsetDateTime.now());

            // Handle file upload
            if (file != null && !file.isEmpty()) {
                sendFeedback.setFile(file.getBytes());
                sendFeedback.setFileName(file.getOriginalFilename());

                // Extract file extension
                String originalFilename = file.getOriginalFilename();
                if (originalFilename != null && originalFilename.contains(".")) {
                    String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    sendFeedback.setFileExtension(extension);
                }
            }

            sendFeedbackRepository.createSendFeedback(sendFeedback);

            // Update application status to 8 (Feedback Sent)
            applicationRepository.modifyApplicationStatus(sendFeedbackRequestDTO.getApplicationNo(), 8);

            return new SuccessResult("Feedback sent successfully.", "1000");

        } catch (IOException e) {
            return new ErrorResult("Error processing file: " + e.getMessage(), "1001");
        } catch (Exception e) {
            return new ErrorResult("Error sending feedback: " + e.getMessage(), "1001");
        }
    }

    @Override
    public Result rejectApplication(SendFeedbackRequestDTO sendFeedbackRequestDTO, MultipartFile file) {
        try {
            SendFeedback sendFeedback = new SendFeedback();
            sendFeedback.setRemarks(sendFeedbackRequestDTO.getRemarks());
            sendFeedback.setDescription(sendFeedbackRequestDTO.getDescription());
            sendFeedback.setFeedbackCategories(sendFeedbackRequestDTO.getFeedbackCategories());
            sendFeedback.setApplicationNo(sendFeedbackRequestDTO.getApplicationNo());
            sendFeedback.setFeedbackType(3); // 3 = Rejected
            sendFeedback.setCreatedAt(OffsetDateTime.now());

            // Handle file upload
            if (file != null && !file.isEmpty()) {
                sendFeedback.setFile(file.getBytes());
                sendFeedback.setFileName(file.getOriginalFilename());

                // Extract file extension
                String originalFilename = file.getOriginalFilename();
                if (originalFilename != null && originalFilename.contains(".")) {
                    String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    sendFeedback.setFileExtension(extension);
                }
            }

            sendFeedbackRepository.createSendFeedback(sendFeedback);

            // Update application status to 6 (Rejected)
            applicationRepository.modifyApplicationStatus(sendFeedbackRequestDTO.getApplicationNo(), 6);

            return new SuccessResult("Application rejected successfully.", "1000");

        } catch (IOException e) {
            return new ErrorResult("Error processing file: " + e.getMessage(), "1001");
        } catch (Exception e) {
            return new ErrorResult("Error rejecting application: " + e.getMessage(), "1001");
        }
    }

    @Override
    public DataResult<SendFeedbackResponseDTO> getSendFeedbackById(int id) {
        try {
            SendFeedback sendFeedback = sendFeedbackRepository.getSendFeedbackById(id);
            if (sendFeedback == null) {
                return new SuccessDataResult<>(null, "Send feedback not found.");
            }

            SendFeedbackResponseDTO responseDTO = mapToResponseDTO(sendFeedback);
            return new SuccessDataResult<>(responseDTO, "Send feedback retrieved successfully.", "1000");

        } catch (Exception e) {
            return new SuccessDataResult<>(null, "Error retrieving send feedback: " + e.getMessage());
        }
    }

    @Override
    public DataResult<List<SendFeedbackResponseDTO>> getAllSendFeedback() {
        try {
            List<SendFeedback> sendFeedbacks = sendFeedbackRepository.getAllSendFeedback();
            List<SendFeedbackResponseDTO> responseDTOs = new ArrayList<>();

            for (SendFeedback sendFeedback : sendFeedbacks) {
                responseDTOs.add(mapToResponseDTO(sendFeedback));
            }

            return new SuccessDataResult<>(responseDTOs, "Send feedbacks retrieved successfully.", "1000");

        } catch (Exception e) {
            return new SuccessDataResult<>(new ArrayList<>(), "Error retrieving send feedbacks: " + e.getMessage());
        }
    }

    @Override
    public DataResult<SendFeedbackResponseDTO> getLatestFeedbackByApplicationNo(String applicationNo,
            int feedbackType) {
        try {
            SendFeedback sendFeedback = sendFeedbackRepository.getLatestFeedbackByApplicationNo(applicationNo,
                    feedbackType);
            if (sendFeedback == null) {
                return new SuccessDataResult<>(null, "No feedback found for this application.", "1000");
            }

            SendFeedbackResponseDTO responseDTO = mapToResponseDTO(sendFeedback);
            return new SuccessDataResult<>(responseDTO, "Latest feedback retrieved successfully.", "1000");

        } catch (Exception e) {
            return new SuccessDataResult<>(null, "Error retrieving latest feedback: " + e.getMessage());
        }
    }

    @Override
    public byte[] getFeedbackFileData(int id) {
        try {
            SendFeedback sendFeedback = sendFeedbackRepository.getSendFeedbackById(id);
            return sendFeedback != null ? sendFeedback.getFile() : null;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Result deleteSendFeedback(int id) {
        try {
            SendFeedback existingSendFeedback = sendFeedbackRepository.getSendFeedbackById(id);
            if (existingSendFeedback == null) {
                return new ErrorResult("Send feedback not found.", "1100");
            }

            sendFeedbackRepository.deleteSendFeedback(id);

            return new SuccessResult("Send feedback deleted successfully.", "1000");

        } catch (Exception e) {
            return new ErrorResult("Error deleting send feedback: " + e.getMessage(), "1001");
        }
    }

    private SendFeedbackResponseDTO mapToResponseDTO(SendFeedback sendFeedback) {
        SendFeedbackResponseDTO responseDTO = new SendFeedbackResponseDTO();
        responseDTO.setId(sendFeedback.getId());
        responseDTO.setRemarks(sendFeedback.getRemarks());
        responseDTO.setDescription(sendFeedback.getDescription());
        responseDTO.setFeedbackCategories(sendFeedback.getFeedbackCategories());
        responseDTO.setApplicationNo(sendFeedback.getApplicationNo());
        responseDTO.setFileName(sendFeedback.getFileName());
        responseDTO.setFileExtension(sendFeedback.getFileExtension());
        responseDTO.setFeedbackType(sendFeedback.getFeedbackType());
        responseDTO.setCreatedAt(sendFeedback.getCreatedAt());
        return responseDTO;
    }
}
