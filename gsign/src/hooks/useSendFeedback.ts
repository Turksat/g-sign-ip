import { useState, useCallback } from "react";
import { getApiUrl } from "@/libs/apiUtils";

export interface SendFeedbackRequest {
  applicationNo: string;
  feedbackCategories: number[];
  description: string;
  file?: File;
}

export interface SendFeedbackResult {
  sendFeedback: (data: SendFeedbackRequest) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const useSendFeedback = (): SendFeedbackResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendFeedback = useCallback(
    async (data: SendFeedbackRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("applicationNo", data.applicationNo);
        formData.append("description", data.description);

        // Add feedback categories as JSON string
        formData.append(
          "feedbackCategories",
          JSON.stringify(data.feedbackCategories)
        );

        if (data.file) {
          formData.append("file", data.file);
        }

        // Use fetch directly for FormData instead of the useApi post method
        // because FormData requires different headers
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(getApiUrl("/send-feedback/send"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData, let the browser set it
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          return true;
        } else {
          setError(result.message || "Failed to send feedback");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while sending feedback";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    sendFeedback,
    loading,
    error,
  };
};
