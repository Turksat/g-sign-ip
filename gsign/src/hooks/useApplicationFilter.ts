import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import { APPLICATION_STATUS } from "@/libs/constants";
import { getApiUrl } from "@/libs/apiUtils";

export interface ApplicationFilterRequest {
  applicationStatus?: number;
  applicantName?: string;
  inventorName?: string;
  applicationNumber?: string;
  startDate?: string;
  endDate?: string;
}

export interface FilteredApplication {
  applicationNumber: string;
  applicantName: string;
  title: string;
  applicationDate: string;
  applicationStatusId: number;
}

export interface ApplicationFilterResponse {
  applications: FilteredApplication[];
}

export const useApplicationFilter = () => {
  const { post } = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterApplications = useCallback(
    async (
      filterRequest: ApplicationFilterRequest
    ): Promise<ApplicationFilterResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await post<ApplicationFilterResponse>(
          getApiUrl("/applications/filter"),
          filterRequest
        );

        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.message || "Failed to filter applications");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while filtering applications";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [post]
  );

  const resetFilter =
    useCallback(async (): Promise<ApplicationFilterResponse | null> => {
      const defaultFilter: ApplicationFilterRequest = {
        applicationStatus: APPLICATION_STATUS.UNDER_REVIEW,
      };

      return await filterApplications(defaultFilter);
    }, [filterApplications]);

  return {
    filterApplications,
    resetFilter,
    loading,
    error,
    clearError: () => setError(null),
  };
};
