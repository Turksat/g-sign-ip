import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CommonFormData } from "@/types/CommonTypes";
import { InputText } from "@edk/ui-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

import { useApi } from "@/hooks/useApi";
import { useStep7 } from "@/hooks/useApplicationSteps";
import Link from "next/link";

type Step7FormData = {
  firstName: string;
  lastName: string;
  applicationNumber: string;
  emailAddress: string;
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvvCode: string;
};

interface Step7Ref {
  trigger: () => Promise<boolean>;
}

const Step7 = forwardRef<
  Step7Ref,
  CommonFormData & { applicationNo?: string | null }
>(({ formData, handleChange, applicationNo: propApplicationNo }, ref) => {
  const router = useRouter();
  const { getUserInfo } = useApi();
  const { updateApplicationStage7 } = useStep7();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Checkout total amount
  const total = 70.0;

  // applicationNo'yu session storage'dan al
  const getApplicationNo = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("currentApplicationNo");
    }
    return null;
  };

  // applicationNo'yu kullan
  const applicationNo = propApplicationNo || getApplicationNo();

  const {
    control,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<Step7FormData>({
    defaultValues: {
      firstName: "", // User bilgilerinden doldurulacak
      lastName: "", // User bilgilerinden doldurulacak
      applicationNumber: "", // Default değeri kaldırdık
      emailAddress: "test@example.com", // Test email address
      cardNumber: "4111 1111 1111 1111", // Test Visa card number
      nameOnCard: "JOHN DOE", // Test name
      expiryDate: "12/25", // Test expiry date
      cvvCode: "123", // Test CVV
    },
  });

  // FormData değiştiğinde form değerlerini güncelle
  useEffect(() => {
    if (formData) {
      setValue("firstName", (formData.firstName as string) || "");
      setValue("lastName", (formData.lastName as string) || "");
      setValue(
        "applicationNumber",
        (formData.applicationNumber as string) || ""
      );
      setValue(
        "emailAddress",
        (formData.emailAddress as string) || "test@example.com"
      );
      // Kart bilgileri için formData'dan gelen değer varsa onu kullan, yoksa test değerlerini kullan
      setValue(
        "cardNumber",
        (formData.cardNumber as string) || "4111 1111 1111 1111"
      );
      setValue("nameOnCard", (formData.nameOnCard as string) || "JOHN DOE");
      setValue("expiryDate", (formData.expiryDate as string) || "12/25");
      setValue("cvvCode", (formData.cvvCode as string) || "123");
    }
  }, [formData, setValue]);

  // User bilgilerini form'a set et
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setValue("firstName", userInfo.firstName || "");
      setValue("lastName", userInfo.lastName || "");
      setValue("emailAddress", userInfo.email || "");
    }
    // Form data loaded, stop initial loading
    setIsInitialLoading(false);
  }, [getUserInfo, setValue]);

  // Ref'e form metodlarını expose et
  useImperativeHandle(ref, () => ({
    trigger: async () => {
      const isValid = await trigger();
      if (isValid) {
        // Form data'yı context'e kaydet
        const formValues = watch();
        if (formValues && Object.keys(formValues).length > 0) {
          Object.entries(formValues).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              handleChange(key, value);
            }
          });
        }

        // checkoutTotal değerini formData'ya ekle
        handleChange("checkoutTotal", Number(total) || 0);

        // Backend'e gönder
        if (applicationNo) {
          try {
            // Session'dan token'ı al
            const token = sessionStorage.getItem("authToken");
            if (!token) {
              // Güvenli routing - Next.js router kullanarak Open Redirect saldırılarını önle
              router.push("/login");
              return false;
            }

            const paymentData = {
              firstName: formValues.firstName || "",
              lastName: formValues.lastName || "",
              applicationNumber: applicationNo || "",
              emailAddress: formValues.emailAddress || "",
              cardNumber: formValues.cardNumber || "",
              nameOnCard: formValues.nameOnCard || "",
              expiryDate: formValues.expiryDate || "",
              cvvCode: formValues.cvvCode || "",
              checkoutTotal: Number(total) || 0,
            };

            const result = await updateApplicationStage7(
              applicationNo,
              paymentData
            );
            if (!result || !result.success) {
              if (result && result.redirectTo) {
                // JWT expired hatası - güvenli yönlendirme
                const allowedRedirects = ["/login", "/forgotpassword"];
                const redirectUrl = result.redirectTo;

                if (
                  allowedRedirects.some((allowed) =>
                    redirectUrl.startsWith(allowed)
                  )
                ) {
                  router.push(redirectUrl);
                } else {
                  // Güvenilir olmayan URL'ler için varsayılan login sayfasına yönlendir
                  router.push("/login");
                }
                return false;
              }
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            return false;
          }
        }
      }
      return isValid;
    },
  }));

  // Show loading spinner while data is being loaded
  if (isInitialLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" text="Loading payment data..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <form className="space-y-8">
        {/* Applicant Information Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Applicant Information
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-gray-900">First Name:</strong>
                <span className="ml-2">{getUserInfo()?.firstName || ""}</span>
              </div>

              <div>
                <strong className="text-gray-900">Last Name:</strong>
                <span className="ml-2">{getUserInfo()?.lastName || ""}</span>
              </div>

              <div>
                <strong className="text-gray-900">Application Number:</strong>
                <span className="ml-2">{applicationNo || "17/123,456"}</span>
              </div>

              <div>
                <strong className="text-gray-900">Email Address:</strong>
                <span className="ml-2">{getUserInfo()?.email || ""}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">Total: $70.00</p>
            </div>
          </div>
        </div>

        {/* Pay with your card Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Pay with your card
          </h2>
          <p className="text-sm text-gray-600">
            We support Mastercard, Visa, Visa Electron and Maestro.
          </p>

          {/* Card Logos */}
          <div className="flex space-x-4">
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
            <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
              MC
            </div>
            <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
              VE
            </div>
            <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <div className="w-full">
                <Controller
                  name="cardNumber"
                  control={control}
                  rules={{
                    required: "Card number is required",
                    pattern: {
                      value: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
                      message:
                        "Please enter a valid card number (e.g., 1234 5678 9012 3456)",
                    },
                  }}
                  render={({ field }) => (
                    <InputText
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        handleChange("cardNumber", value);
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  )}
                />
              </div>
              {errors.cardNumber && (
                <p className="text-sm text-red-500">
                  {errors.cardNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name on Card
              </label>
              <div className="w-full">
                <Controller
                  name="nameOnCard"
                  control={control}
                  rules={{ required: "Name on card is required" }}
                  render={({ field }) => (
                    <InputText
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        handleChange("nameOnCard", value);
                      }}
                      placeholder="Enter name on card"
                    />
                  )}
                />
              </div>
              {errors.nameOnCard && (
                <p className="text-sm text-red-500">
                  {errors.nameOnCard.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <div className="w-full">
                  <Controller
                    name="expiryDate"
                    control={control}
                    rules={{
                      required: "Expiry date is required",
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                        message: "Please enter expiry date in MM/YY format",
                      },
                    }}
                    render={({ field }) => (
                      <InputText
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          handleChange("expiryDate", value);
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    )}
                  />
                </div>
                {errors.expiryDate && (
                  <p className="text-sm text-red-500">
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  CVV Code
                </label>
                <div className="w-full">
                  <Controller
                    name="cvvCode"
                    control={control}
                    rules={{
                      required: "CVV code is required",
                      pattern: {
                        value: /^\d{3,4}$/,
                        message: "Please enter a valid CVV code (3-4 digits)",
                      },
                    }}
                    render={({ field }) => (
                      <InputText
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          handleChange("cvvCode", value);
                        }}
                        placeholder="123"
                        maxLength={4}
                      />
                    )}
                  />
                </div>
                {errors.cvvCode && (
                  <p className="text-sm text-red-500">
                    {errors.cvvCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
          <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-6">
            <div className="space-y-3 text-sm text-blue-700">
              <p>
                • Based on your application, a fee of $70.00 will be charged to
                your credit card.
              </p>
              <p>
                • Payment must be made in order to complete the application. You
                can cancel your application after the payment is completed;
                however, the fee is not refundable.
              </p>
              <p>
                • If you believe there is a mistake in the applicant
                information,{" "}
                <Link
                  href={
                    applicationNo
                      ? `/newapplication/step/6/${applicationNo}`
                      : "/newapplication/step/6"
                  }
                  className="text-blue-800 underline hover:text-blue-900"
                >
                  click here
                </Link>{" "}
                to make a correction.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});

Step7.displayName = "Step7";

export default Step7;
