import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { getApiUrl } from "@/libs/apiUtils";

export interface FeedbackCategory {
  id: number;
  feedbackCategoryDescription: string;
}

interface FeedbackCategoriesResult {
  feedbackCategories: FeedbackCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFeedbackCategories = (): FeedbackCategoriesResult => {
  const [feedbackCategories, setFeedbackCategories] = useState<
    FeedbackCategory[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { get } = useApi();

  const fetchFeedbackCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await get<FeedbackCategory[]>(
        getApiUrl("/feedback-categories/getall")
      );

      if (result.success && result.data) {
        setFeedbackCategories(result.data);
      } else {
        setError(result.message || "Failed to fetch feedback categories");
      }
    } catch {
      setError("An error occurred while fetching feedback categories");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchFeedbackCategories();
  };

  useEffect(() => {
    fetchFeedbackCategories();
  }, []);

  return {
    feedbackCategories,
    loading,
    error,
    refetch,
  };
};
