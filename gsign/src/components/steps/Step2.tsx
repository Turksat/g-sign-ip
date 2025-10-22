import { useApplicationTypes } from "@/hooks/useApplicationTypes";
import { usePatentClassifications } from "@/hooks/usePatentClassifications";
import { useStep2 } from "@/hooks/useApplicationSteps";
import { CommonFormData } from "@/types/CommonTypes";
import { Alert, Radio, Select, Textarea } from "@edk/ui-react";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ApplicationNumber from "@/components/common/ApplicationNumber";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

type Step2FormData = {
  // Backend DTO'ya uygun alanlar
  applicationTypeId: number;
  titleOfInvention: string;
  inventionSummary: string;
  patentClassificationId: number[];
  geographicalOrigin: boolean;
  governmentFunded: boolean;
};

const Step2 = forwardRef<
  { trigger: () => Promise<boolean> },
  CommonFormData & { applicationNo?: string | null }
>(({ formData, handleChange, applicationNo }, ref) => {
  const router = useRouter();
  const [selectedClassifications, setSelectedClassifications] = useState<
    number[]
  >((formData.patentClassificationId as number[]) || []);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // useApi hook'unu component'in en üst seviyesinde çağır
  const { updateApplicationStage2 } = useStep2();

  // Application types'ları fetch et
  const {
    applicationTypes,
    loading: applicationTypesLoading,
    error: applicationTypesError,
  } = useApplicationTypes();

  // Patent classifications'ları fetch et
  const {
    patentClassifications,
    loading: patentClassificationsLoading,
    error: patentClassificationsError,
  } = usePatentClassifications();

  const {
    control,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<Step2FormData>({
    defaultValues: {
      applicationTypeId: Number(formData.applicationTypeId) || 0,
      titleOfInvention: (formData.titleOfInvention as string) || "",
      inventionSummary: (formData.inventionSummary as string) || "",
      patentClassificationId:
        (formData.patentClassificationId as number[]) || [],
      geographicalOrigin: Boolean(formData.geographicalOrigin),
      governmentFunded: Boolean(formData.governmentFunded),
    },
  });

  const titleOfInvention = watch("titleOfInvention");
  const inventionSummary = watch("inventionSummary");
  const geographicalOrigin = watch("geographicalOrigin");
  const governmentFunded = watch("governmentFunded");

  // Helper function to convert string/boolean values to proper boolean - artık kullanılmıyor

  // FormData değiştiğinde form değerlerini güncelle
  useEffect(() => {
    if (formData) {
      setValue("applicationTypeId", Number(formData.applicationTypeId) || 0);
      setValue("titleOfInvention", (formData.titleOfInvention as string) || "");
      setValue("inventionSummary", (formData.inventionSummary as string) || "");
      setValue(
        "patentClassificationId",
        (formData.patentClassificationId as number[]) || []
      );

      // Boolean değerleri doğru şekilde set et
      const geoOrigin = Boolean(formData.geographicalOrigin);
      const govFunded = Boolean(formData.governmentFunded);

      setValue("geographicalOrigin", geoOrigin);
      setValue("governmentFunded", govFunded);

      // selectedClassifications state'ini de güncelle
      setSelectedClassifications(
        (formData.patentClassificationId as number[]) || []
      );
    }
  }, [formData, setValue]);

  // Watch form values and trigger validation when they change
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "applicationTypeId" || name === "patentClassificationId") {
        setTimeout(() => trigger(name), 0);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  // Handle initial loading state
  useEffect(() => {
    if (!applicationTypesLoading && !patentClassificationsLoading) {
      // All data loading finished (whether successful or not)
      setIsInitialLoading(false);
    }
  }, [applicationTypesLoading, patentClassificationsLoading]);

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

        // Backend'e gönder - sadece DTO'da olan alanları gönder
        if (applicationNo) {
          try {
            // Backend DTO'ya uygun data hazırla - sadece gerekli alanları gönder
            const backendData = {
              applicationTypeId: Number(formValues.applicationTypeId) || 0,
              titleOfInvention: formValues.titleOfInvention || "",
              inventionSummary: formValues.inventionSummary || "",
              patentClassificationId: Array.isArray(
                formValues.patentClassificationId
              )
                ? formValues.patentClassificationId
                : [],
              geographicalOrigin: formValues.geographicalOrigin,
              governmentFunded: formValues.governmentFunded,
            };

            const result = await updateApplicationStage2(
              applicationNo,
              backendData
            );

            if (result && result.success) {
              return true; // Başarılı
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
              return false;
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

  // Radio button'lar için özel handler fonksiyonları
  const handleGeographicalOriginChange = (value: boolean) => {
    setValue("geographicalOrigin", value);
    handleChange("geographicalOrigin", value);
    // Validation'ı tetikle
    setTimeout(() => trigger("geographicalOrigin"), 0);
  };

  const handleGovernmentFundedChange = (value: boolean) => {
    setValue("governmentFunded", value);
    handleChange("governmentFunded", value);
    // Validation'ı tetikle
    setTimeout(() => trigger("governmentFunded"), 0);
  };

  const handleClassificationChange = (value: unknown) => {
    // Multiple select için array değerini al ve sadece value'ları çıkar
    let classifications: number[] = [];

    if (Array.isArray(value)) {
      // Array ise, her item'dan value'yu al
      classifications = value
        .map((item: Record<string, unknown>) => {
          if (typeof item === "object" && item !== null && "value" in item) {
            return Number(item.value) || 0;
          }
          return Number(item) || 0;
        })
        .filter((id) => id > 0); // 0'dan büyük değerleri filtrele
    } else if (value && typeof value === "object" && "value" in value) {
      // Tek obje ise, value'yu al
      classifications = [Number(value.value) || 0];
    } else if (value) {
      // String veya başka bir değer ise, direkt kullan
      classifications = [Number(value) || 0];
    }

    // Local state ve form state'i güncelle
    setSelectedClassifications(classifications);
    setValue("patentClassificationId", classifications); // Processed classifications array'ini set et
    handleChange("patentClassificationId", classifications); // Processed classifications array'ini handleChange'e gönder
    // Validation'ı tetikle
    setTimeout(() => trigger("patentClassificationId"), 0);
  };

  // Show loading spinner while data is being loaded
  if (
    isInitialLoading ||
    applicationTypesLoading ||
    patentClassificationsLoading
  ) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" text="Loading application data..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Top Banner */}
      <Alert
        variant="info"
        message="With this application, the research/investigation request is automatically initiated. You are not expected to take any additional action or make any choices."
      />

      {/* Application Number Display */}
      <ApplicationNumber applicationNo={applicationNo || "17/123,456"} />

      <form className="space-y-8">
        {/* Non-Provisional Utility Patent Application Information Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-blue-600">
            Non-Provisional Utility Patent Application Information
          </h3>

          {/* Application Type */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              *Application Type
            </label>

            {/* Application Types Loading and Error States */}
            {applicationTypesLoading && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700 text-sm">
                  Loading application types...
                </p>
              </div>
            )}

            {applicationTypesError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">
                  Error loading application types: {applicationTypesError}
                </p>
              </div>
            )}

            <div className="w-full">
              <Controller
                name="applicationTypeId"
                control={control}
                rules={{ required: "Application type is required" }}
                render={({ field }) => (
                  <Select
                    name="applicationTypeId"
                    value={field.value || undefined}
                    onChange={(value) => {
                      // Select component'inden gelen value'yu doğru şekilde işle
                      const selectedValue =
                        value && typeof value === "object" && "value" in value
                          ? value.value
                          : value;
                      field.onChange(selectedValue);
                      if (
                        selectedValue &&
                        selectedValue !== "" &&
                        selectedValue !== undefined
                      ) {
                        setValue("applicationTypeId", selectedValue as number);
                        handleChange("applicationTypeId", selectedValue);
                      } else {
                        setValue("applicationTypeId", 0);
                        handleChange("applicationTypeId", 0);
                      }
                      // Validation'ı tetikle - setTimeout ile async olarak
                      setTimeout(() => trigger("applicationTypeId"), 0);
                    }}
                    data={applicationTypes.map((type) => ({
                      label: type.applicationTypeName,
                      value: type.applicationTypeId.toString(),
                    }))}
                  />
                )}
              />
              {errors.applicationTypeId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.applicationTypeId.message}
                </p>
              )}
            </div>
          </div>

          {/* Descriptive Text */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              A Non-Provisional Utility Patent application is a formal
              application that fully discloses the structure, operation or use
              of the invention, initiates the examination process and, if
              approved, grants enforceable patent rights.
            </p>
          </div>

          {/* Title of the Invention */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              *Title of the Invention
            </label>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                Remaining Character {500 - (titleOfInvention?.length || 0)}
              </span>
            </div>
            <div className="w-full">
              <Controller
                name="titleOfInvention"
                control={control}
                rules={{
                  required: "Invention title is required",
                  minLength: {
                    value: 5,
                    message: "Title must be at least 5 characters long",
                  },
                  maxLength: {
                    value: 500,
                    message: "Title must not exceed 500 characters",
                  },
                }}
                render={({ field }) => (
                  <Textarea
                    name="titleOfInvention"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      handleChange("titleOfInvention", value);
                    }}
                    placeholder="Enter the title of your invention"
                    rows={3}
                  />
                )}
              />
            </div>
            {errors.titleOfInvention && (
              <p className="text-sm text-red-500">
                {errors.titleOfInvention.message}
              </p>
            )}
            <div className="text-sm text-gray-600">
              The title of the invention should briefly describe the technical
              development subject to the invention and should not contain
              trademark terms.
            </div>
          </div>

          {/* Invention Summary */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              *Invention Summary
            </label>
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  Remaining Character {1000 - (inventionSummary?.length || 0)}
                </span>
              </div>
              <div className="w-full">
                <Controller
                  name="inventionSummary"
                  control={control}
                  rules={{
                    required: "Invention summary is required",
                    minLength: {
                      value: 50,
                      message: "Summary must be at least 50 characters long",
                    },
                    maxLength: {
                      value: 1000,
                      message: "Summary must not exceed 1000 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Textarea
                      name="inventionSummary"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        handleChange("inventionSummary", value);
                      }}
                      placeholder="Provide a detailed summary of your invention"
                      rows={5}
                    />
                  )}
                />
              </div>
              {errors.inventionSummary && (
                <p className="text-sm text-red-500">
                  {errors.inventionSummary.message}
                </p>
              )}
            </div>
            <div className="text-sm text-gray-600">
              The abstract includes the details of the invention, the main
              features of the claims and the drawings, if any, and also provides
              a clear understanding of the technical problem, the solution of
              this problem by means of the invention and the main use or uses of
              the invention by indicating the technical field to which the
              invention relates. (MPEP § 608.01(b))
            </div>
          </div>
        </div>

        {/* General Patent Classification Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            General Patent Classification
          </h3>

          <div className="w-full">
            {/* Patent Classifications Loading and Error States */}
            {patentClassificationsLoading && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700 text-sm">
                  Loading patent classifications...
                </p>
              </div>
            )}

            {patentClassificationsError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">
                  Error loading patent classifications:{" "}
                  {patentClassificationsError}
                </p>
              </div>
            )}

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Patent Classifications (Maximum 3)
            </label>
            <div className="w-full">
              <Controller
                name="patentClassificationId"
                control={control}
                rules={{
                  validate: (value: unknown) => {
                    // Check if value exists and is an array
                    if (!value || !Array.isArray(value)) {
                      return "At least one patent classification is required";
                    }

                    // Check if array has valid values
                    if (value.length === 0) {
                      return "At least one patent classification is required";
                    }

                    // Check if any of the values are empty or invalid
                    const validValues = (value as unknown[]).filter(
                      (item: unknown) => {
                        if (
                          typeof item === "object" &&
                          item !== null &&
                          "value" in item
                        ) {
                          return (
                            item.value && item.value.toString().trim() !== ""
                          );
                        }
                        return item && item.toString().trim() !== "";
                      }
                    );

                    if (validValues.length === 0) {
                      return "At least one patent classification is required";
                    }

                    if (validValues.length > 3) {
                      return "Maximum 3 patent classifications allowed. Please remove some selections.";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <Select
                    name="patentClassificationId"
                    value={field.value || []}
                    onChange={(value) => {
                      // Update both the form field and local state
                      field.onChange(value);

                      // If no classifications selected, remove from formData and update form state
                      if (
                        !value ||
                        (Array.isArray(value) && value.length === 0)
                      ) {
                        setValue("patentClassificationId", []);
                        setSelectedClassifications([]); // Local state'i de temizle
                        handleChange("patentClassificationId", []);
                      } else {
                        handleClassificationChange(value);
                      }

                      // Validation'ı tetikle - setTimeout ile async olarak
                      setTimeout(() => trigger("patentClassificationId"), 0);
                    }}
                    data={patentClassifications.map((type) => ({
                      label: type.name,
                      value: type.patentClassificationId.toString(),
                    }))}
                    multiple={true}
                  />
                )}
              />
            </div>
            {errors.patentClassificationId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.patentClassificationId.message}
              </p>
            )}
            {selectedClassifications.length > 0 && (
              <div
                className={`text-sm mt-1 ${
                  selectedClassifications.length > 3
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                Selected: {selectedClassifications.length}/3 classifications
                {selectedClassifications.length > 3 && (
                  <span className="text-red-600 ml-2 font-medium">
                    (Please remove {selectedClassifications.length - 3}{" "}
                    selection(s))
                  </span>
                )}
              </div>
            )}
            <div className="text-sm text-gray-500 mt-1">
              You can select up to 3 patent classifications.
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                • Inventions are classified according to the International
                Patent Classification System (IPC), a hierarchical
                classification system. If you know the patent class of your
                invention, please add it. Otherwise, you can skip this step.
              </li>
              <li>
                • You can select a maximum of 3 cooperative patent classes.
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Questions Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Additional Questions
          </h3>

          {/* Traditional Knowledge Question */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              *The invention is based on traditional knowledge linked to
              geographical origin.
            </label>
            <div className="w-full">
              <Controller
                name="geographicalOrigin"
                control={control}
                rules={{
                  validate: (value) => {
                    if (value === undefined || value === null) {
                      return "This field is required";
                    }
                    return true;
                  },
                }}
                render={() => (
                  <>
                    <Radio
                      label="Yes"
                      value="yes"
                      checked={geographicalOrigin === true}
                      onChange={() => handleGeographicalOriginChange(true)}
                    />
                    <Radio
                      label="No"
                      value="no"
                      checked={geographicalOrigin === false}
                      onChange={() => handleGeographicalOriginChange(false)}
                    />
                  </>
                )}
              />
            </div>
            {errors.geographicalOrigin && (
              <p className="text-sm text-red-500">
                {errors.geographicalOrigin.message}
              </p>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
              <div className="text-sm text-gray-600">
                If the invention is based on traditional knowledge of
                geographical origin, this should be indicated.
              </div>
            </div>
          </div>

          {/* Government-funded Project Question */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              *The invention is the result of a government-funded project.
            </label>
            <div className="w-full">
              <Controller
                name="governmentFunded"
                control={control}
                rules={{
                  validate: (value) => {
                    if (value === undefined || value === null) {
                      return "This field is required";
                    }
                    return true;
                  },
                }}
                render={() => (
                  <>
                    <Radio
                      label="Yes"
                      value="yes"
                      checked={governmentFunded === true}
                      onChange={() => handleGovernmentFundedChange(true)}
                    />
                    <Radio
                      label="No"
                      value="no"
                      checked={governmentFunded === false}
                      onChange={() => handleGovernmentFundedChange(false)}
                    />
                  </>
                )}
              />
            </div>
            {errors.governmentFunded && (
              <p className="text-sm text-red-500">
                {errors.governmentFunded.message}
              </p>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
              <div className="text-sm text-gray-600">
                If the application is related to inventions arising from
                projects supported by public institutions or organizations, it
                should be specified.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});

Step2.displayName = "Step2";

export default Step2;
