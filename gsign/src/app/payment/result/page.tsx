"use client";

import ApplicationNumber from "@/components/common/ApplicationNumber";
import { Button } from "@edk/ui-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { usePaymentSuccess } from "@/hooks/usePaymentSuccess";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const PaymentResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const { processSuccessfulPayment, loading: paymentLoading } =
    usePaymentSuccess();

  const applicationNo = searchParams?.get("applicationNo");
  const status = searchParams?.get("status");
  const amount = searchParams?.get("amount");
  const currency = searchParams?.get("currency") || "USD";
  const transactionReference = searchParams?.get("transactionReference") || "";

  useEffect(() => {
    // Check if payment was already processed (stored in sessionStorage)
    const paymentProcessedKey = `payment_processed_${applicationNo}`;
    const wasPaymentProcessed = sessionStorage.getItem(paymentProcessedKey);

    // Geçici olarak sessionStorage'ı temizle (test için)
    sessionStorage.removeItem(paymentProcessedKey);

    // Show loading for a brief moment to ensure smooth UX
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Payment success olduğunda payment kaydı yap ve application status güncelle
    if (
      status === "success" &&
      applicationNo &&
      !wasPaymentProcessed &&
      !paymentProcessed
    ) {
      // Mark payment as being processed (both in state and sessionStorage)
      setPaymentProcessed(true);
      sessionStorage.setItem(paymentProcessedKey, "true");

      // Use default amount if not provided in URL
      const paymentAmount = amount || "70.00"; // Default amount
      processPayment(
        applicationNo,
        paymentAmount,
        currency,
        transactionReference
      );
    }
  }, [
    status,
    applicationNo,
    amount,
    currency,
    transactionReference,
    processSuccessfulPayment,
    router,
    paymentProcessed,
  ]);

  const processPayment = async (
    applicationNo: string,
    amount: string,
    currency: string,
    transactionReference: string
  ) => {
    try {
      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber)) {
        return;
      }

      const paymentData = {
        amount: amountNumber,
        currency: currency,
        paymentStatus: "PAID",
        transactionReference: transactionReference || `TXN-${Date.now()}`,
      };

      const response = await processSuccessfulPayment(
        applicationNo,
        paymentData
      );
      if (response) {
        // Eğer payment zaten varsa (code: 1250), allapplications'a yönlendir
        if (response.code === "1250") {
          setTimeout(() => {
            router.push("/allapplications");
          }, 1000);
        } else {
          // Payment başarılı, success sayfasında kalıyoruz
        }
      } else {
      }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  const handleContinue = () => {
    // Navigate to all applications page
    router.push("/allapplications");
  };

  const handleNewApplication = () => {
    // Clear application context and start new application
    sessionStorage.removeItem("currentApplicationNo");
    router.push("/newapplication");
  };

  if (isLoading || paymentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-12 max-w-md w-full mx-4 text-center">
          <LoadingSpinner
            size="xl"
            text={
              paymentLoading
                ? "Processing payment..."
                : "Processing payment result..."
            }
          />
        </div>
      </div>
    );
  }

  const isSuccess = status === "success";
  const isCancelled = status === "cancelled";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isSuccess
                ? "bg-green-100"
                : isCancelled
                ? "bg-yellow-100"
                : "bg-red-100"
            }`}
          >
            <span className="text-4xl">
              {isSuccess ? "✅" : isCancelled ? "⚠️" : "❌"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSuccess
              ? "Payment Successful!"
              : isCancelled
              ? "Payment Cancelled"
              : "Payment Failed"}
          </h1>
          <p className="text-gray-600 text-lg">
            {isSuccess
              ? "Your patent application has been submitted successfully"
              : isCancelled
              ? "Your payment was cancelled. You can try again later."
              : "There was an issue processing your payment. Please try again."}
          </p>
        </div>

        {/* Application Number */}
        {applicationNo && (
          <div className="flex justify-center mb-8">
            <ApplicationNumber applicationNo={applicationNo} />
          </div>
        )}

        {/* Status Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Payment Details
            </h2>

            {isSuccess && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-green-600 mr-2">💳</span>
                    <span className="font-medium text-green-900">
                      Payment Processed
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your payment has been successfully processed and your
                    application is now under review.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-blue-600 mr-2">📧</span>
                    <span className="font-medium text-blue-900">
                      Confirmation Email
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    A confirmation email has been sent to your registered email
                    address.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-green-600 mr-2">🌱</span>
                    <span className="font-medium text-green-900">
                      Environmental Impact
                    </span>
                  </div>
                  <p className="text-sm text-green-700 text-center">
                    This service has helped save ${amount || "70.00"} amount of
                    carbon emissions.
                  </p>
                  <p className="text-xs text-green-600 text-center mt-1">
                    With love from Türksat&apos;s solar panels...
                  </p>
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-yellow-600 mr-2">⏸️</span>
                    <span className="font-medium text-yellow-900">
                      Payment Cancelled
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Your payment was cancelled. No charges have been made to
                    your account.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-gray-600 mr-2">💾</span>
                    <span className="font-medium text-gray-900">
                      Application Saved
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Your application has been saved and you can continue the
                    payment process later.
                  </p>
                </div>
              </div>
            )}

            {!isSuccess && !isCancelled && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-red-600 mr-2">❌</span>
                    <span className="font-medium text-red-900">
                      Payment Failed
                    </span>
                  </div>
                  <p className="text-sm text-red-700">
                    There was an issue processing your payment. Please check
                    your payment details and try again.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            What&apos;s Next?
          </h2>

          {isSuccess && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 text-lg">1️⃣</span>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Application Under Review
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your application will be reviewed by our team within 2-3
                    business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 text-lg">2️⃣</span>
                <div>
                  <h3 className="font-medium text-gray-900">Status Updates</h3>
                  <p className="text-sm text-gray-600">
                    You will receive email notifications about your application
                    status.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 text-lg">3️⃣</span>
                <div>
                  <h3 className="font-medium text-gray-900">Track Progress</h3>
                  <p className="text-sm text-gray-600">
                    Monitor your application progress in the &quot;All
                    Applications&quot; section.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isSuccess && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 text-lg">1️⃣</span>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Check Payment Details
                  </h3>
                  <p className="text-sm text-gray-600">
                    Verify your payment information and try again.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 text-lg">2️⃣</span>
                <div>
                  <h3 className="font-medium text-gray-900">Contact Support</h3>
                  <p className="text-sm text-gray-600">
                    If the issue persists, contact our support team for
                    assistance.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {isSuccess ? (
            <>
              <Button
                label="View All Applications"
                variant="primary"
                onClick={handleContinue}
              />
              <Button
                label="Start New Application"
                variant="secondary"
                onClick={handleNewApplication}
              />
            </>
          ) : (
            <>
              <Button
                label="Try Payment Again"
                variant="primary"
                onClick={() =>
                  router.push(`/newapplication/step/7/${applicationNo}`)
                }
              />
              <Button
                label="View All Applications"
                variant="secondary"
                onClick={handleContinue}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PaymentResultPageWithSuspense = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-12 max-w-md w-full mx-4 text-center">
            <LoadingSpinner size="xl" text="Loading payment result..." />
          </div>
        </div>
      }
    >
      <PaymentResultPage />
    </Suspense>
  );
};

export default PaymentResultPageWithSuspense;
