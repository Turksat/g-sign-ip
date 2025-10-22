import { useState, useCallback } from "react";
import { getApiUrl } from "@/libs/apiUtils";

// Patent Search Request Interface
export interface PatentSearchRequest {
  searchType: "basic" | "advanced";

  // Basic Search Parameters
  patentNumber?: string;

  // Advanced Search Parameters
  keyword?: string;
  title?: string;
  applicantInventor?: string;
  countryCode?: string;
  patentClassificationId?: string;
  publicationStartDate?: string; // YYYY-MM-DD format
  publicationEndDate?: string; // YYYY-MM-DD format

  // Pagination
  page?: number;
  size?: number;
}

// Patent Search Response Interface
export interface PatentSearchResult {
  id: string;
  patentNumber: string;
  title: string;
  applicant: string;
  inventor?: string;
  country: string;
  countryCode: string;
  publicationDate: string;
  status: string;
  classification?: string;
  abstract?: string;
  priority?: string;
  likelihood?: number;
}

export interface PatentSearchResponse {
  success: boolean;
  message?: string;
  code?: string;
  data: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    patents: PatentSearchResult[];
  };
}

export const usePatentSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPatents = useCallback(
    async (
      searchParams: PatentSearchRequest
    ): Promise<PatentSearchResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        // Get auth token
        const token =
          typeof window !== "undefined"
            ? sessionStorage.getItem("authToken")
            : null;
        if (!token) {
          setError("No authentication token found");
          return null;
        }

        // Backend endpoint for patent search with "Patent Granted" status filter
        const url = getApiUrl("/patents/search-granted");

        // Add default pagination if not provided
        const requestData: PatentSearchRequest = {
          ...searchParams,
          page: searchParams.page || 1,
          size: searchParams.size || 10,
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        const result = await response.json();

        // Handle HTTP errors
        if (!response.ok) {
          setError(result.message || `HTTP error! status: ${response.status}`);
          return null;
        }

        // Check if the response indicates success
        if (result.success) {
          // All successful responses (including code 1300) are valid
          return result;
        } else {
          // Only set error for actual backend failures
          setError(result.message || "Failed to search patents");
          return null;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // Only log actual network/parsing errors
        setError("Network error occurred. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    searchPatents,
    loading,
    error,
  };
};
