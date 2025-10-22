import { useState, useEffect, useRef } from "react";
import { useApi } from "./useApi";
import { getApiUrl } from "@/libs/apiUtils";

export interface PatentClassification {
  patentClassificationId: number;
  name: string;
}

export const usePatentClassifications = () => {
  const [patentClassifications, setPatentClassifications] = useState<
    PatentClassification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const { get } = useApi();

  useEffect(() => {
    // Sadece bir kez fetch yap
    if (hasFetched.current) return;

    const fetchPatentClassifications = async () => {
      try {
        setLoading(true);
        hasFetched.current = true;

        const result = await get(getApiUrl("/patent-classifications/all"));

        if (result.success && result.data) {
          setPatentClassifications(result.data as PatentClassification[]);
        } else {
          throw new Error(
            result.message || "Failed to fetch patent classifications"
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        hasFetched.current = false; // Hata durumunda tekrar deneyebilir
      } finally {
        setLoading(false);
      }
    };

    fetchPatentClassifications();
  }, [get]);

  return { patentClassifications, loading, error };
};
