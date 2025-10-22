import { useState, useEffect } from "react";
import { getApiUrl } from "@/libs/apiUtils";

export interface RejectionCategory {
  id: number;
  rejection_category_name: string;
}

export interface UseRejectionCategoriesResult {
  rejectionCategories: RejectionCategory[];
  loading: boolean;
  error: string | null;
}

export const useRejectionCategories = (): UseRejectionCategoriesResult => {
  const [rejectionCategories, setRejectionCategories] = useState<
    RejectionCategory[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRejectionCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          getApiUrl("/rejection-categories/getall"),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setRejectionCategories(result.data);
        } else {
          throw new Error(
            result.message || "Failed to fetch rejection categories"
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch rejection categories";
        setError(errorMessage);
        setRejectionCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectionCategories();
  }, []);

  return {
    rejectionCategories,
    loading,
    error,
  };
};
