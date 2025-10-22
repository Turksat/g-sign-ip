import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CommonFormData } from "@/types/CommonTypes";
import { Radio } from "@edk/ui-react";

import ApplicationNumber from "@/components/common/ApplicationNumber";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useStep4 } from "@/hooks/useApplicationSteps";

type Step4FormData = {
  firstInventorToFile: boolean | undefined;
};

const Step4 = forwardRef<
  { trigger: () => Promise<boolean> },
  CommonFormData & { applicationNo?: string | null }
>(({ formData, handleChange, applicationNo }, ref) => {
  const router = useRouter();
  const { updateApplicationStage4 } = useStep4();
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const {
    control,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<Step4FormData>({
    defaultValues: {
      firstInventorToFile: undefined,
    },
  });

  // FormData değiştiğinde form değerlerini güncelle
  useEffect(() => {
    if (formData) {
      // firstInventorToFile boolean değer olarak set et
      const firstInventorToFileValue = Boolean(formData.firstInventorToFile);
      setValue("firstInventorToFile", firstInventorToFileValue);
    }
    // Form data loaded, stop initial loading
    setIsInitialLoading(false);
  }, [formData, setValue]);

  // Ref'e form metodlarını expose et
  useImperativeHandle(ref, () => ({
    trigger: async () => {
      const isValid = await trigger("firstInventorToFile");
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
            const backendData = {
              isAIA: Boolean(formValues.firstInventorToFile),
            };

            const result = await updateApplicationStage4(
              applicationNo,
              backendData.isAIA
            );

            if (result && result.success) {
              setApiResponse("Step 4 data saved successfully");
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

  const handleRadioChange = (value: boolean) => {
    setValue("firstInventorToFile", value);
    handleChange("firstInventorToFile", value);

    // Validation'ı tetikle
    setTimeout(() => trigger("firstInventorToFile"), 0);
  };

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
            First Inventor to File (AIA)
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
                The America Invents Act (AIA) changed the U.S. patent system to
                first-to-file, meaning the first person to file a patent gets
                the rights, not the first to invent. (35 U.S.C. § 102(a))
              </p>

              <div className="space-y-1">
                <p className="font-medium">Legal References:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>35 U.S.C. § 102</li>
                  <li>37 C.F.R. § 1.55</li>
                </ul>
              </div>

              <div className="space-y-1">
                <p className="font-medium">Who does this apply to?</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <strong>New Applicants:</strong> If filing on or after March
                    16, 2013, you must follow first-to-file.
                  </li>
                  <li>
                    <strong>Existing Patents:</strong> New applications filed
                    after March 16, 2013, must follow first-to-file for those
                    claims.
                  </li>
                  <li>
                    <strong>Old Patents:</strong> Patents granted before March
                    16, 2013, are still under first-to-invent.
                  </li>
                </ul>
              </div>

              <div className="space-y-1">
                <p className="font-medium">Conditions for checking a box:</p>
                <p className="ml-4">
                  Check this box ONLY if your application meets both:
                </p>
                <ol className="list-decimal list-inside ml-8 space-y-1">
                  <li>
                    Claims priority to an application filed before March 16,
                    2013.
                  </li>
                  <li>
                    Contains an invention claim filed on or after March 16,
                    2013.
                  </li>
                </ol>
              </div>

              <div className="space-y-1">
                <p className="font-medium">
                  Does your application follow &apos;First Inventor to
                  File&apos;?
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    Yes, it follows the First Inventor to File (AIA) rule.
                  </li>
                  <li>
                    No, it does not follow the First Inventor to File (AIA)
                    rule.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            * Does your application need to be evaluated according to the
            &quot;First Inventor to File&quot; rules?
          </label>
          <div className="flex flex-col gap-4">
            <Controller
              name="firstInventorToFile"
              control={control}
              rules={{
                validate: (value) => {
                  if (value === undefined || value === null) {
                    return "Please select an option";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <>
                  <Radio
                    label='Yes, my application should be considered under "First Inventor to File (AIA)".'
                    value="yes"
                    checked={field.value === true}
                    onChange={() => handleRadioChange(true)}
                  />
                  <Radio
                    label='No, my application is not considered under "First Inventor to File (AIA)".'
                    value="no"
                    checked={field.value === false}
                    onChange={() => handleRadioChange(false)}
                  />
                </>
              )}
            />
          </div>
          {errors.firstInventorToFile && (
            <p className="text-sm text-red-500 mt-1">
              {errors.firstInventorToFile.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
});

Step4.displayName = "Step4";

export default Step4;
