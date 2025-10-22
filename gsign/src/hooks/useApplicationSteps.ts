import { useCallback, useState } from "react";
import { useApi } from "./useApi";
import { getApiUrl } from "@/libs/apiUtils";

interface StepResponse {
  success: boolean;
  message?: string;
  code?: string;
  data?: unknown;
  redirectTo?: string;
}

// Step 1 - Application Create/Update
export const useStep1 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { post, put } = useApi();

  const createApplication = useCallback(
    async (
      applicationData: Record<string, unknown>
    ): Promise<StepResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const url = getApiUrl("/applications/create");
        const response = await post<StepResponse>(url, applicationData);

        if (response.success) {
          return response;
        }

        setError(response.message || "Failed to create application");
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create application";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [post]
  );

  const updateApplicationStage1 = useCallback(
    async (
      applicationNo: string,
      applicationData: Record<string, unknown>
    ): Promise<StepResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const url = getApiUrl(`/applications/update/stage-1/${applicationNo}`);
        const response = await put<StepResponse>(url, applicationData);

        if (response.success) {
          return response;
        }

        setError(response.message || "Failed to update application");
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update application";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [put]
  );

  return {
    createApplication,
    updateApplicationStage1,
    loading,
    error,
  };
};

// Step 2 Hook
export const useStep2 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { put } = useApi();

  const updateApplicationStage2 = useCallback(
    async (
      applicationNo: string,
      applicationData: Record<string, unknown>
    ): Promise<StepResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const url = getApiUrl(`/applications/update/stage-2/${applicationNo}`);
        const response = await put<StepResponse>(url, applicationData);

        if (response.success) {
          return response;
        }

        setError(response.message || "Failed to update application stage 2");
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update application stage 2";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [put]
  );

  return {
    updateApplicationStage2,
    loading,
    error,
  };
};

// Step 3 Hook
export const useStep3 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { put } = useApi();

  const updateApplicationStage3 = useCallback(
    async (
      applicationNo: string,
      applicationData: Record<string, unknown>
    ): Promise<StepResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const url = getApiUrl(`/applications/update/stage-3/${applicationNo}`);
        const response = await put<StepResponse>(url, applicationData);

        if (response.success) {
          return response;
        }

        setError(response.message || "Failed to update application stage 3");
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update application stage 3";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [put]
  );

  return {
    updateApplicationStage3,
    loading,
    error,
  };
};

// Step 4 Hook
export const useStep4 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { put } = useApi();

  const updateApplicationStage4 = useCallback(
    async (
      applicationNo: string,
      isAIA: boolean
    ): Promise<StepResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const url = getApiUrl(`/applications/update/stage-4/${applicationNo}`);
        const response = await put<StepResponse>(url, { isAIA });

        if (response.success) {
          return response;
        }

        setError(response.message || "Failed to update application stage 4");
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update application stage 4";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [put]
  );

  return {
    updateApplicationStage4,
    loading,
    error,
  };
};

// Step 5 Hook
export const useStep5 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { put } = useApi();

  const updateApplicationStage5 = useCallback(
    async (
      applicationNo: string,
      isAuthorizedToPdx: boolean,
      isAuthorizedToEpo: boolean
    ): Promise<StepResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const url = getApiUrl(`/applications/update/stage-5/${applicationNo}`);
        const response = await put<StepResponse>(url, {
          isAuthorizedToPdx,
          isAuthorizedToEpo,
        });

        if (response.success) {
          return response;
        }

        setError(response.message || "Failed to update application stage 5");
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update application stage 5";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [put]
  );

  return {
    updateApplicationStage5,
    loading,
    error,
  };
};

// Step 6 Hook
export const useStep6 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { put } = useApi();

  const updateApplicationStage6 = useCallback(
    async (
      applicationNo: string,
      signature: string
    ): Promise<StepResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const url = getApiUrl(`/applications/update/stage-6/${applicationNo}`);
        const response = await put<StepResponse>(url, { signature });

        if (response.success) {
          return response;
        }

        setError(response.message || "Failed to update application stage 6");
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update application stage 6";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [put]
  );

  return {
    updateApplicationStage6,
    loading,
    error,
  };
};

// Step 7 Hook - Payment Information
export const useStep7 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { put } = useApi();

  const updateApplicationStage7 = useCallback(
    async (
      applicationNo: string,
      paymentData: Record<string, unknown>
    ): Promise<StepResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const url = getApiUrl(`/applications/update/stage-7/${applicationNo}`);
        const response = await put<StepResponse>(url, paymentData);

        if (response.success) {
          return response;
        }

        setError(response.message || "Failed to update application stage 7");
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update application stage 7";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [put]
  );

  return {
    updateApplicationStage7,
    loading,
    error,
  };
};
