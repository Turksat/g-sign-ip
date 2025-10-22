import { useState, useEffect, useRef } from "react";
import { useApi } from "./useApi";
import { getApiUrl } from "@/libs/apiUtils";

export interface Gender {
  genderId: number;
  genderName: string;
}

export const useGenders = () => {
  const [genders, setGenders] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const { get } = useApi();

  useEffect(() => {
    // Sadece bir kez fetch yap
    if (hasFetched.current) return;

    const fetchGenders = async () => {
      try {
        setLoading(true);
        hasFetched.current = true;

        const result = await get(getApiUrl("/genders/getall"));

        if (result.success && result.data) {
          setGenders(result.data as Gender[]);
        } else {
          throw new Error(result.message || "Failed to fetch genders");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        hasFetched.current = false; // Hata durumunda tekrar deneyebilir
      } finally {
        setLoading(false);
      }
    };

    fetchGenders();
  }, [get]);

  return { genders, loading, error };
};
