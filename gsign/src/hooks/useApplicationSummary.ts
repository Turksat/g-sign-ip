import { useState, useCallback } from "react";
import { getApiUrl } from "@/libs/apiUtils";

export interface ApplicationSummary {
  // Application info
  applicationNo: string;
  // User info for display
  firstName: string;
  middleName: string;
  lastName: string;
  countryName: string;
  nationalityNo: string;
  birthDate: string | null;
  nationalIdNo: string;
  genderName: string;
  genderId: number | null;
  applicantEntitlementRate: number | null;
  email: string;
  countryCode: string;
  phoneNumber: string;
  residencyTypeName: string;
  residencyTypeId: number | null;
  stateName: string;
  stateId: number | null;
  countryOfResidence: string;
  countryOfResidenceId: number | null;
  city: string;
  ciCountryName: string;
  ciCountryId: number | null;
  ciStreetAddressOne: string;
  ciStreetAddressTwo: string;
  ciCity: string;
  ciPostalCode: string;
  // Boolean fields - backend'den gelen gerçek field name'ler
  anonymous: boolean; // isAnonymous() getter method'ından
  applicationTypeName: string;
  applicationTypeId: number | null;
  titleOfInvention: string;
  inventionSummary: string;
  classificationNames: string[] | null;
  classificationIds: number[] | null;
  geographicalOrigin: boolean; // isGeographicalOrigin() getter method'ından
  governmentFunded: boolean; // isGovernmentFunded() getter method'ından
  aia: boolean; // isAIA() getter method'ından
  isAuthorizedToPdx: boolean; // isAuthorizedToPdx() getter method'ından
  isAuthorizedToEpo: boolean; // isAuthorizedToEpo() getter method'ından
  prefix: string;
  suffix: string;
  likelihood: number | null; // Backend'den gelen likelihood değeri
  signature: string; // Başvuruyu yapan kişinin signature bilgisi
  // Payment Information
  paymentAmount: number | null;
  paymentDate: string | null;
  paymentCurrency: string | null;
  paymentStatus: string | null;
}

export const useApplicationSummary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationSummary = useCallback(
    async (applicationNo: string): Promise<ApplicationSummary | null> => {
      setLoading(true);
      setError(null);

      try {
        const url = getApiUrl(
          `/applications/get-application-summary/${applicationNo}`
        );

        // Auth token'ı session storage'dan al
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // POST request yap (backend @PostMapping bekliyor)
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}), // Boş body ile POST
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          return result.data;
        } else {
          setError(result.message || "Failed to fetch application summary");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    fetchApplicationSummary,
    loading,
    error,
  };
};
