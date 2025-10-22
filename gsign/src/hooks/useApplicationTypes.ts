import { useState, useEffect, useRef } from "react";
import { useApi } from "./useApi";
import { getApiUrl } from "@/libs/apiUtils";

export interface ApplicationType {
  applicationTypeId: number;
  applicationTypeName: string;
}

export const useApplicationTypes = () => {
  const [applicationTypes, setApplicationTypes] = useState<ApplicationType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const { get } = useApi();

  useEffect(() => {
    // Sadece bir kez fetch yap
    if (hasFetched.current) return;

    const fetchApplicationTypes = async () => {
      try {
        setLoading(true);
        hasFetched.current = true;

        const result = await get(getApiUrl("/application-types/all"));

        if (result.success && result.data) {
          setApplicationTypes(result.data as ApplicationType[]);
        } else {
          throw new Error(
            result.message || "Failed to fetch application types"
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        hasFetched.current = false; // Hata durumunda tekrar deneyebilir
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationTypes();
  }, [get]);

  return { applicationTypes, loading, error };
};
