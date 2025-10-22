/**
 * Custom hook for fetching user applications
 */

import { useQuery } from "@tanstack/react-query";
import { UserApplicationResponseDTO } from "@/types/ApiTypes";

interface ApplicationsResponse {
  success: boolean;
  data: UserApplicationResponseDTO[];
  message: string;
}

/**
 * Fetches applications for a specific user
 */
const fetchApplications = async (
  userId: number
): Promise<UserApplicationResponseDTO[]> => {
  if (typeof window === "undefined") {
    throw new Error("Cannot fetch applications on server side");
  }

  const token = sessionStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || process.env.API_URL
    }/api/applications/get-applications-for-user/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch applications: ${response.statusText}`);
  }

  const result: ApplicationsResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch applications");
  }

  return result.data;
};

/**
 * Custom hook for fetching user applications
 * @param userId User ID to fetch applications for
 * @param enabled Whether the query should be enabled
 */
export const useApplications = (
  userId: number | null,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["applications", userId],
    queryFn: () => fetchApplications(userId!),
    enabled:
      enabled && userId !== null && userId > 0 && typeof window !== "undefined",
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
  });
};

/**
 * Custom hook for fetching applications with loading state
 * @param userId User ID to fetch applications for
 */
export const useApplicationsWithLoading = (userId: number | null) => {
  const { data, isLoading, error, refetch } = useApplications(userId, true);

  return {
    applications: data || [],
    isLoading,
    error,
    refetch,
    hasApplications: data && data.length > 0,
  };
};
