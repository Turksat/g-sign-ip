package com.turksat.EU_Patent_Registration_Project.webAPI.controllers;

import com.turksat.EU_Patent_Registration_Project.business.abstracts.SendFeedbackService;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.DataResult;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.Result;
import com.turksat.EU_Patent_Registration_Project.core.utils.results.ResultStatus;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.requests.SendFeedbackRequestDTO;
import com.turksat.EU_Patent_Registration_Project.entities.DTOs.responses.SendFeedbackResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/send-feedback")
public class SendFeedbackController {

    private final SendFeedbackService sendFeedbackService;
    private final ObjectMapper objectMapper;

    @Autowired
    public SendFeedbackController(SendFeedbackService sendFeedbackService, ObjectMapper objectMapper) {
        this.sendFeedbackService = sendFeedbackService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/approve")
    public ResponseEntity<Result> approveFeedback(
            @RequestParam("applicationNo") String applicationNo,
            @RequestParam("remarks") String remarks,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            // Create request DTO
            SendFeedbackRequestDTO requestDTO = new SendFeedbackRequestDTO();
            requestDTO.setApplicationNo(applicationNo);
            requestDTO.setRemarks(remarks);
            requestDTO.setDescription(""); // Empty for approve
            requestDTO.setFeedbackCategories(new int[] {}); // Empty for approve

            Result result = sendFeedbackService.approveFeedback(requestDTO, file);
            return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));

        } catch (Exception e) {
            Result errorResult = new Result(false, "Error processing request: " + e.getMessage(), "1001");
            return new ResponseEntity<>(errorResult, ResultStatus.fromCode(errorResult.getCode()));
        }
    }

    @PostMapping("/send")
    public ResponseEntity<Result> sendFeedback(
            @RequestParam("applicationNo") String applicationNo,
            @RequestParam(value = "remarks", required = false) String remarks,
            @RequestParam("description") String description,
            @RequestParam("feedbackCategories") String feedbackCategoriesJson,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            // Parse feedback categories from JSON string
            int[] feedbackCategories = objectMapper.readValue(feedbackCategoriesJson, int[].class);

            // Create request DTO
            SendFeedbackRequestDTO requestDTO = new SendFeedbackRequestDTO();
            requestDTO.setApplicationNo(applicationNo);
            requestDTO.setRemarks(remarks != null ? remarks : ""); // Optional for feedback
            requestDTO.setDescription(description);
            requestDTO.setFeedbackCategories(feedbackCategories);

            Result result = sendFeedbackService.sendFeedback(requestDTO, file);
            return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));

        } catch (Exception e) {
            Result errorResult = new Result(false, "Error processing request: " + e.getMessage(), "1001");
            return new ResponseEntity<>(errorResult, ResultStatus.fromCode(errorResult.getCode()));
        }
    }

    @PostMapping("/reject")
    public ResponseEntity<Result> rejectApplication(
            @RequestParam("applicationNo") String applicationNo,
            @RequestParam(value = "remarks", required = false) String remarks,
            @RequestParam("description") String description,
            @RequestParam("feedbackCategories") String feedbackCategoriesJson,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            // Parse feedback categories from JSON string
            int[] feedbackCategories = objectMapper.readValue(feedbackCategoriesJson, int[].class);

            // Create request DTO
            SendFeedbackRequestDTO requestDTO = new SendFeedbackRequestDTO();
            requestDTO.setApplicationNo(applicationNo);
            requestDTO.setRemarks(remarks != null ? remarks : ""); // Optional for rejection
            requestDTO.setDescription(description);
            requestDTO.setFeedbackCategories(feedbackCategories);

            Result result = sendFeedbackService.rejectApplication(requestDTO, file);
            return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));

        } catch (Exception e) {
            Result errorResult = new Result(false, "Error processing request: " + e.getMessage(), "1001");
            return new ResponseEntity<>(errorResult, ResultStatus.fromCode(errorResult.getCode()));
        }
    }

    @GetMapping("/getall")
    public ResponseEntity<DataResult<List<SendFeedbackResponseDTO>>> getAllSendFeedback() {
        DataResult<List<SendFeedbackResponseDTO>> result = sendFeedbackService.getAllSendFeedback();
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @GetMapping("/getbyid/{id}")
    public ResponseEntity<DataResult<SendFeedbackResponseDTO>> getSendFeedbackById(@PathVariable int id) {
        DataResult<SendFeedbackResponseDTO> result = sendFeedbackService.getSendFeedbackById(id);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @GetMapping("/latest/{applicationNo}/{feedbackType}")
    public ResponseEntity<DataResult<SendFeedbackResponseDTO>> getLatestFeedbackByApplicationNo(
            @PathVariable String applicationNo,
            @PathVariable int feedbackType) {
        DataResult<SendFeedbackResponseDTO> result = sendFeedbackService.getLatestFeedbackByApplicationNo(applicationNo,
                feedbackType);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFeedbackFile(@PathVariable int id) {
        try {
            DataResult<SendFeedbackResponseDTO> result = sendFeedbackService.getSendFeedbackById(id);

            if (!result.isSuccess() || result.getData() == null) {
                return ResponseEntity.notFound().build();
            }

            SendFeedbackResponseDTO feedback = result.getData();

            // Get file data from service
            byte[] fileData = sendFeedbackService.getFeedbackFileData(id);
            if (fileData == null) {
                return ResponseEntity.notFound().build();
            }

            String fileName = feedback.getFileName() != null ? feedback.getFileName()
                    : "feedback_file" + feedback.getFileExtension();
            String contentType = getContentType(feedback.getFileExtension());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(fileData);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String getContentType(String fileExtension) {
        if (fileExtension == null)
            return "application/octet-stream";

        switch (fileExtension.toLowerCase()) {
            case ".pdf":
                return "application/pdf";
            case ".doc":
                return "application/msword";
            case ".docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default:
                return "application/octet-stream";
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Result> deleteSendFeedback(@PathVariable int id) {
        Result result = sendFeedbackService.deleteSendFeedback(id);
        return new ResponseEntity<>(result, ResultStatus.fromCode(result.getCode()));
    }
}
