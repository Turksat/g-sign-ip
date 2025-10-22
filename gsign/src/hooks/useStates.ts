import { useState, useEffect, useRef } from "react";
import { useApi } from "./useApi";
import { getApiUrl } from "@/libs/apiUtils";

export interface State {
  stateId: number;
  stateName: string;
  countryId: number;
}

export const useStates = (countryId: number = 221) => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const { get } = useApi();

  useEffect(() => {
    // Sadece bir kez fetch yap
    if (hasFetched.current) return;

    const fetchStates = async () => {
      try {
        setLoading(true);
        hasFetched.current = true;

        const result = await get(
          getApiUrl(`/states/getall?countryId=${countryId}`)
        );

        if (result.success && result.data) {
          setStates(result.data as State[]);
        } else {
          throw new Error(result.message || "Failed to fetch states");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        hasFetched.current = false; // Hata durumunda tekrar deneyebilir
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [get, countryId]);

  return { states, loading, error };
};
