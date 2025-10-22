import { useState, useEffect, useRef } from "react";
import { getApiUrl } from "@/libs/apiUtils";

export interface Country {
  countryId: number;
  countryName: string;
  countryCode: string;
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Sadece bir kez fetch yap
    if (hasFetched.current) return;

    const fetchCountries = async () => {
      try {
        setLoading(true);
        hasFetched.current = true;

        // Countries API public olduğu için token olmadan çağır
        const response = await fetch(getApiUrl("/countries/getall"));

        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }

        const result = await response.json();

        if (result.success && result.data) {
          setCountries(result.data as Country[]);
        } else {
          throw new Error(result.message || "Failed to fetch countries");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        hasFetched.current = false; // Hata durumunda tekrar deneyebilir
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};
