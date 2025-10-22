import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { getApiUrl } from "@/libs/apiUtils";
import { User } from "@/types/User";

interface UserResponse {
  success: boolean;
  data: User;
  message: string;
  code: string;
}

export const useUser = (userId: number | null) => {
  const { getAuthToken } = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = getApiUrl(`/users/get/${id}`);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: UserResponse = await response.json();
      console.log("User API Response:", result);

      if (result.success && result.data) {
        setUser(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch user");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(new Error(errorMessage));
      console.error("Error fetching user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  return {
    user,
    isLoading,
    error,
    refetch: () => userId && fetchUser(userId),
  };
};
