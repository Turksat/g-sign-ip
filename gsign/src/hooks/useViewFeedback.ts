import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import { getApiUrl } from "@/libs/apiUtils";

export interface ViewFeedbackData {
  id: number;
  remarks: string;
  description: string;
  feedbackCategories: number[];
  applicationNo: string;
  fileName: string;
  fileExtension: string;
  feedbackType: number;
  createdAt: string;
}

export interface ViewFeedbackResult {
  fetchLatestFeedback: (
    applicationNo: string,
    feedbackType: number
  ) => Promise<ViewFeedbackData | null>;
  loading: boolean;
  error: string | null;
}

export const useViewFeedback = (): ViewFeedbackResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { get } = useApi();

  const fetchLatestFeedback = useCallback(
    async (
      applicationNo: string,
      feedbackType: number
    ): Promise<ViewFeedbackData | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await get<ViewFeedbackData>(
          getApiUrl(`/send-feedback/latest/${applicationNo}/${feedbackType}`)
        );

        if (result.success && result.data) {
          return result.data;
        } else {
          setError(result.message || "No feedback found for this application");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching feedback";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [get]
  );

  return {
    fetchLatestFeedback,
    loading,
    error,
  };
};
