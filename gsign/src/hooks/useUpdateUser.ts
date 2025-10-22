import { useState } from "react";
import { useApi } from "./useApi";
import { getApiUrl } from "@/libs/apiUtils";

interface UpdateUserRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneNumberCountryCodeId: number;
  userRoleId: number;
  password: string; // Backend'de password zorunlu
}

interface UpdateUserResponse {
  success: boolean;
  message: string;
  code: string;
}

export const useUpdateUser = () => {
  const { getAuthToken } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateUser = async (userId: number, userData: UpdateUserRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = getApiUrl(`/users/update/${userId}`);
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: UpdateUserResponse = await response.json();

      if (result.success) {
        return { success: true, message: result.message };
      } else {
        throw new Error(result.message || "Failed to update user");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(new Error(errorMessage));
      console.error("Error updating user:", err);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUser,
    isLoading,
    error,
  };
};
