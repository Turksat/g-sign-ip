import { useCallback, useState } from "react";
import { useApi } from "./useApi";
import { getApiUrl } from "@/libs/apiUtils";

interface PaymentSuccessRequest {
  amount: number;
  currency: string;
  paymentStatus: string;
  transactionReference: string;
}

interface PaymentSuccessResponse {
  success: boolean;
  message?: string;
  code?: string;
}

export const usePaymentSuccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { post } = useApi();

  const processSuccessfulPayment = useCallback(
    async (
      applicationNo: string,
      paymentData: PaymentSuccessRequest
    ): Promise<PaymentSuccessResponse | null> => {
      if (!applicationNo.trim()) {
        setError("Application number is required");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        // Transform the data to match backend PaymentRequestDTO format
        const requestData = {
          amount: paymentData.amount,
          currency: paymentData.currency,
          paymentStatus: paymentData.paymentStatus,
          transactionReference: paymentData.transactionReference,
        };

        const url = getApiUrl(`/payments/create-payment/${applicationNo}`);

        const response = await post<PaymentSuccessResponse>(url, requestData);

        if (response.success) {
          return response;
        }

        setError(response.message || "Failed to process payment");
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to process payment";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [post]
  );

  return {
    processSuccessfulPayment,
    loading,
    error,
  };
};
