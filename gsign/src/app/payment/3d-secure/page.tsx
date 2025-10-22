"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@edk/ui-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const Payment3DSecurePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [step, setStep] = useState<
    "loading" | "verification" | "processing" | "success" | "error"
  >("loading");

  const applicationNo = searchParams?.get("applicationNo");
  const amount = searchParams?.get("amount");

  useEffect(() => {
    // Simulate 3D Secure loading
    const timer = setTimeout(() => {
      setStep("verification");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (step === "verification" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setStep("error");
    }
  }, [timeLeft, step]);

  const handleVerification = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert("Please enter a valid 6-digit verification code");
      return;
    }

    setIsProcessing(true);
    setStep("processing");

    // Simulate 3D Secure verification
    setTimeout(() => {
      if (verificationCode === "123456") {
        setStep("success");
        // Redirect to result page after 2 seconds
        setTimeout(() => {
          router.push(
            `/payment/result?applicationNo=${applicationNo}&status=success`
          );
        }, 2000);
      } else {
        setStep("error");
        setIsProcessing(false);
      }
    }, 3000);
  };

  const handleCancel = () => {
    router.push(
      `/payment/result?applicationNo=${applicationNo}&status=cancelled`
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <LoadingSpinner size="xl" color="blue" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we redirect you to your bank&apos;s secure
              payment page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "verification") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              3D Secure Verification
            </h2>
            <p className="text-gray-600">
              Please complete the verification process to secure your payment
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  Payment Amount
                </span>
                <span className="text-lg font-bold text-blue-900">
                  ${amount}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-blue-700">Application No</span>
                <span className="text-sm font-mono text-blue-700">
                  {applicationNo}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit code sent to your registered mobile number
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-yellow-600 mr-2">⏰</span>
                <span className="text-sm text-yellow-800">
                  Time remaining:{" "}
                  <span className="font-bold">{formatTime(timeLeft)}</span>
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                label="Cancel"
                variant="secondary"
                onClick={handleCancel}
                className="flex-1"
              />
              <Button
                label={isProcessing ? "Verifying..." : "Verify & Pay"}
                variant="primary"
                onClick={handleVerification}
                disabled={isProcessing || verificationCode.length !== 6}
                className="flex-1"
              />
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                For testing: Use verification code{" "}
                <span className="font-bold">123456</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <LoadingSpinner size="xl" color="green" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we process your payment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your payment has been processed successfully. Redirecting...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {timeLeft === 0
                ? "Time expired. Please try again."
                : "Invalid verification code. Please try again."}
            </p>
            <div className="flex space-x-3">
              <Button
                label="Try Again"
                variant="primary"
                onClick={() => {
                  setStep("verification");
                  setTimeLeft(300);
                  setVerificationCode("");
                }}
                className="flex-1"
              />
              <Button
                label="Cancel"
                variant="secondary"
                onClick={handleCancel}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const Payment3DSecurePageWithSuspense = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" text="Loading 3D Secure page..." />
          </div>
        </div>
      }
    >
      <Payment3DSecurePage />
    </Suspense>
  );
};

export default Payment3DSecurePageWithSuspense;
