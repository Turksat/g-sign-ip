import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CommonFormData } from "@/types/CommonTypes";
import { Checkbox } from "@edk/ui-react";
import ApplicationNumber from "@/components/common/ApplicationNumber";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useStep5 } from "@/hooks/useApplicationSteps";

type Step5FormData = {
  refuseApplicationFileAccess: boolean;
  refuseSearchResultsAccess: boolean;
};

interface Step5Ref {
  trigger: () => Promise<boolean>;
}

const Step5 = forwardRef<
  Step5Ref,
  CommonFormData & { applicationNo?: string | null }
>(({ formData, handleChange, applicationNo }, ref) => {
  const router = useRouter();
  const { updateApplicationStage5 } = useStep5();
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const {
    control,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<Step5FormData>({
    defaultValues: {
      refuseApplicationFileAccess:
        (formData.refuseApplicationFileAccess as boolean) || false,
      refuseSearchResultsAccess:
        (formData.refuseSearchResultsAccess as boolean) || false,
    },
  });

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

        // Backend'e gönder
        if (applicationNo) {
          try {
            setIsLoading(true);
            setApiResponse(null); // Error mesajını temizle

            // Backend DTO'ya uygun data hazırla
            // Frontend'de refuse = false ise backend'de authorized = true olmalı
            const backendData = {
              isAuthorizedToPdx: !formValues.refuseApplicationFileAccess,
              isAuthorizedToEpo: !formValues.refuseSearchResultsAccess,
            };

            const result = await updateApplicationStage5(
              applicationNo,
              backendData.isAuthorizedToPdx,
              backendData.isAuthorizedToEpo
            );

            if (result && result.success) {
              setApiResponse("Step 5 data saved successfully");
              setTimeout(() => setApiResponse(null), 3000);
              return true;
            } else if (result && result.redirectTo) {
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
            } else {
              // HTTP 400 veya diğer hatalar
              setApiResponse(`Error: ${result?.message || "Unknown error"}`);
              setTimeout(() => setApiResponse(null), 5000);
              return false;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            setApiResponse("Error: Failed to save data");
            setTimeout(() => setApiResponse(null), 5000);
            return false;
          } finally {
            setIsLoading(false);
          }
        }
      }
      return isValid;
    },
  }));

  // FormData değiştiğinde form değerlerini güncelle
  useEffect(() => {
    if (formData) {
      setValue(
        "refuseApplicationFileAccess",
        (formData.refuseApplicationFileAccess as boolean) || false
      );
      setValue(
        "refuseSearchResultsAccess",
        (formData.refuseSearchResultsAccess as boolean) || false
      );
    }
    // Form data loaded, stop initial loading
    setIsInitialLoading(false);
  }, [formData, setValue]);

  // Show loading spinner while data is being loaded
  if (isInitialLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" text="Loading form data..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Application Number Display */}
      <ApplicationNumber applicationNo={applicationNo || "17/123,456"} />

      {/* Loading State */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700 text-sm">Loading data...</p>
        </div>
      )}

      {/* API Response */}
      {apiResponse && (
        <div
          className={`mb-4 p-3 border rounded-md ${
            apiResponse.includes("Error")
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          <p className="text-sm">{apiResponse}</p>
        </div>
      )}

      <form className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-blue-600">
            Authorization to Permit Access
          </h2>
        </div>

        {/* Information Box */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              The information text for the relevant section will be displayed.
              For example;
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                This section allows you to specify whether to allow foreign
                patent offices access to your application&apos;s information and
                search results. By default, access is allowed to participating
                foreign patent offices under the PDX program, and search results
                are forwarded to the European Patent Office (EPO). To refuse
                these accesses, you need to check the specific boxes below.
              </p>

              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">
                    Point A - Application File Access Authorization (PDX
                    Program):
                  </p>
                  <p className="mt-1">
                    The USPTO (United States Patent and Trademark Office) may
                    share the application file and priority information with the
                    European Patent Office (EPO), the Japanese Patent Office
                    (JPO), the Korean Intellectual Property Office (KIPO), the
                    Chinese National Intellectual Property Administration
                    (CNIPA), the World Intellectual Property Organization
                    (WIPO), and other treaty foreign offices.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-900">
                    Point B - Authorization to Communicate Search Results to the
                    EPO:
                  </p>
                  <p className="mt-1">
                    If a patent application is filed in Europe, the USPTO may
                    send the search results and application information to the
                    European Patent Office (EPO). A note clarifies that under
                    EPO rules, the applicant must timely file the US search
                    results in its European application.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <strong className="text-yellow-800">NOTE:</strong>
                <p className="text-yellow-700 mt-1">
                  These preferences can only be indicated during the initial
                  filing of the application, and separate forms are required for
                  subsequent amendments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Do you want to refuse the following data sharing related to your
            application?
          </label>
          <div className="flex flex-col gap-4">
            <Controller
              name="refuseApplicationFileAccess"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="A - I do not want my application file to be shared with foreign patent offices (EPO, JPO, KIPO, CNIPA, WIPO and other participating offices - under the PDX Program)"
                  name="refuseApplicationFileAccess"
                  checked={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    handleChange("refuseApplicationFileAccess", value);
                    // Validation'ı tetikle
                    setTimeout(() => trigger("refuseApplicationFileAccess"), 0);
                  }}
                />
              )}
            />

            <Controller
              name="refuseSearchResultsAccess"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="B - I do not want the search results of the application to be sent to the European Patent Office (EPO)."
                  name="refuseSearchResultsAccess"
                  checked={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    handleChange("refuseSearchResultsAccess", value);
                    // Validation'ı tetikle
                    setTimeout(() => trigger("refuseSearchResultsAccess"), 0);
                  }}
                />
              )}
            />
          </div>
          {(errors.refuseApplicationFileAccess ||
            errors.refuseSearchResultsAccess) && (
            <p className="text-sm text-red-500 mt-1">
              {errors.refuseApplicationFileAccess?.message ||
                errors.refuseSearchResultsAccess?.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
});

Step5.displayName = "Step5";

export default Step5;
