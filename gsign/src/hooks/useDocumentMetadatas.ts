import { useState, useCallback } from "react";
import { getApiUrl } from "@/libs/apiUtils";

export interface ApplicationDocumentMetadata {
  applicationDocumentId: number;
  applicationDocumentTypeId: number;
  fileName: string;
  fileContent: string; // Base64 encoded file content
}

export const useDocumentMetadatas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentMetadatas, setDocumentMetadatas] = useState<
    ApplicationDocumentMetadata[]
  >([]);

  const fetchDocumentMetadatas = useCallback(
    async (
      applicationNo: string
    ): Promise<ApplicationDocumentMetadata[] | null> => {
      setLoading(true);
      setError(null);

      try {
        const url = getApiUrl(
          `/applications/get-document-metadatas/${applicationNo}`
        );

        // Auth token'ı session storage'dan al
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // POST request yap (backend @PostMapping bekliyor)
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}), // Boş body ile POST
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setDocumentMetadatas(result.data);
          return result.data;
        } else {
          setError(result.message || "Failed to fetch document metadatas");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    documentMetadatas,
    fetchDocumentMetadatas,
    loading,
    error,
  };
};
