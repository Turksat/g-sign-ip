import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import { getApiUrl } from "@/libs/apiUtils";

export interface ApproveApplicationRequest {
  applicationNo: string;
  remarks: string;
  file?: File;
}

export interface ApproveApplicationResult {
  approveApplication: (data: ApproveApplicationRequest) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const useApproveApplication = (): ApproveApplicationResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { post } = useApi();

  const approveApplication = useCallback(
    async (data: ApproveApplicationRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("applicationNo", data.applicationNo);
        formData.append("remarks", data.remarks);

        if (data.file) {
          formData.append("file", data.file);
        }

        // Use fetch directly for FormData instead of the useApi post method
        // because FormData requires different headers
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(getApiUrl("/send-feedback/approve"), {
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
          setError(result.message || "Failed to approve application");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while approving application";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [post]
  );

  return {
    approveApplication,
    loading,
    error,
  };
};
