package com.turksat.EU_Patent_Registration_Project.dataAccess.abstracts;

import com.turksat.EU_Patent_Registration_Project.entities.concretes.SendFeedback;

import java.util.List;

public interface SendFeedbackRepository {
    void createSendFeedback(SendFeedback sendFeedback);

    SendFeedback getSendFeedbackById(int id);

    List<SendFeedback> getAllSendFeedback();

    SendFeedback getLatestFeedbackByApplicationNo(String applicationNo, int feedbackType);

    void deleteSendFeedback(int id);
}
