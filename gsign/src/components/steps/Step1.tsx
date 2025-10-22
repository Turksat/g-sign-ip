"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { InputText, Select, Radio, InputDate } from "@edk/ui-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { CommonFormData, InputValue } from "@/types/CommonTypes";
import { FORM_DATA_ARRAYS } from "@/libs/formData";
import { useCountries } from "@/hooks/useCountries";
import { useStates } from "@/hooks/useStates";
import { useGenders } from "@/hooks/useGenders";
import { useApi } from "@/hooks/useApi";
import { useStep1 } from "@/hooks/useApplicationSteps";

type Step1FormData = {
  // Backend'e gönderilecek alanlar (DTO ile aynı)
  applicantEntitlementRate: string;
  nationalityNo: string;
  nationalIdNo: string;
  prefix: string;
  suffix: string;
  birthDate: Date;
  genderId: string;
  residencyTypeId: string;
  stateId: string;
  city: string;
  countryId: number;
  ciCountryId: number;
  ciStreetAddressOne: string;
  ciStreetAddressTwo: string;
  ciCity: string;
  ciPostalCode: string;
  isAnonymous: boolean;

  // Gösterim amaçlı (backend'e gönderilmeyecek)
  applicantInventor: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
};

const Step1 = forwardRef<{ trigger: () => Promise<boolean> }, CommonFormData>(
  ({ formData, handleChange }, ref) => {
    const router = useRouter();
    const { getUserInfo } = useApi();
    const { createApplication, updateApplicationStage1 } = useStep1();

    // Helper function to extract value from Select component
    const extractSelectValue = (value: InputValue): string | undefined => {
      if (typeof value === "object" && value !== null && "value" in value) {
        return (value as { label: string; value: string }).value;
      }
      return value as string;
    };
    // Session storage'dan applicationNo'yu oku
    const getApplicationNo = () => {
      if (typeof window !== "undefined") {
        return sessionStorage.getItem("currentApplicationNo");
      }
      return null;
    };

    // Session storage'a applicationNo'yu yaz ve parent component'e bildir
    const setApplicationNo = (appNo: string | null) => {
      if (typeof window !== "undefined") {
        if (appNo) {
          sessionStorage.setItem("currentApplicationNo", appNo);

          // Parent component'e bildir
          window.dispatchEvent(
            new CustomEvent("applicationNoUpdated", { detail: appNo })
          );
        } else {
          sessionStorage.removeItem("currentApplicationNo");
          window.dispatchEvent(
            new CustomEvent("applicationNoUpdated", { detail: null })
          );
        }
      }
    };
    const {
      countries,
      loading: countriesLoading,
      error: countriesError,
    } = useCountries();

    const { states, loading: statesLoading, error: statesError } = useStates();

    const {
      genders,
      loading: gendersLoading,
      error: gendersError,
    } = useGenders();

    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const {
      control,
      formState: { errors },
      watch,
      trigger,
      setValue,
    } = useForm<Step1FormData>({
      mode: "onChange",
      defaultValues: {
        applicantInventor: (formData.applicantInventor as string) || "both",
        applicantEntitlementRate:
          (formData.applicantEntitlementRate as string) || "",
        nationalityNo: (formData.nationalityNo as string) || "",
        nationalIdNo: (formData.nationalIdNo as string) || "",
        prefix: (formData.prefix as string) || "",
        firstName: (formData.firstName as string) || "",
        middleName: (formData.middleName as string) || "",
        lastName: (formData.lastName as string) || "",
        suffix: (formData.suffix as string) || "",
        birthDate: (() => {
          if (formData.birthDate instanceof Date) {
            return formData.birthDate;
          }
          if (
            typeof formData.birthDate === "string" ||
            typeof formData.birthDate === "number"
          ) {
            return new Date(formData.birthDate);
          }
          return undefined;
        })(),
        genderId: (formData.genderId as string) || "",
        email: (formData.email as string) || "",
        countryCode: (formData.countryCode as string) || "",
        phoneNumber: (formData.phoneNumber as string) || "",
        residencyTypeId: (formData.residencyTypeId as string) || "",
        stateId: (formData.stateId as string) || "",
        countryId: Number(formData.countryId) || 0,
        city: (formData.city as string) || "",
        ciCountryId: Number(formData.ciCountryId) || 0,
        ciStreetAddressOne: (formData.ciStreetAddressOne as string) || "",
        ciStreetAddressTwo: (formData.ciStreetAddressTwo as string) || "",
        ciCity: (formData.ciCity as string) || "",
        ciPostalCode: (formData.ciPostalCode as string) || "",
        isAnonymous:
          formData.isAnonymous !== undefined
            ? (formData.isAnonymous as boolean)
            : false,
      },
    });

    // Ref'e form metodlarını expose et
    useImperativeHandle(ref, () => ({
      trigger: async () => {
        const isValid = await trigger();

        if (isValid) {
          // Form data'yı context'e kaydet
          const formValues = watch();

          // Only save if formValues is not empty
          if (formValues && Object.keys(formValues).length > 0) {
            Object.entries(formValues).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                handleChange(key, value);
              }
            });
          }

          // Backend'e gönder - sadece DTO'da olan alanları gönder
          try {
            // Form values'dan backend data hazırla
            const backendData: Record<string, unknown> = {
              applicantEntitlementRate:
                Number(formValues?.applicantEntitlementRate) / 100 || 0,
              nationalityNo: formValues?.nationalityNo || "",
              nationalIdNo: formValues?.nationalIdNo || "",
              prefix: formValues?.prefix || "",
              suffix: formValues?.suffix || "",
              birthDate: formValues?.birthDate,
              genderId: Number(formValues?.genderId) || 0,
              residencyTypeId: Number(formValues?.residencyTypeId) || 0,
              stateId: Number(formValues?.stateId) || 0,
              city: formValues?.city || "",
              countryId: Number(formValues?.countryId) || 0,
              ciCountryId: Number(formValues?.ciCountryId) || 0,
              ciStreetAddressOne: formValues?.ciStreetAddressOne || "",
              ciStreetAddressTwo: formValues?.ciStreetAddressTwo || "",
              ciCity: formValues?.ciCity || "",
              ciPostalCode: formValues?.ciPostalCode || "",
              anonymous: formValues?.isAnonymous === true,
            };

            // Eğer session storage'da applicationNo varsa, backend'e de gönder
            const storedApplicationNo = getApplicationNo();
            if (storedApplicationNo) {
              backendData.applicationNo = storedApplicationNo;
            }

            // Eğer application number varsa update, yoksa create
            const currentApplicationNo = getApplicationNo();

            let result;
            if (currentApplicationNo) {
              // Update existing application
              result = await updateApplicationStage1(
                currentApplicationNo,
                backendData
              );
            } else {
              // Create new application
              result = await createApplication(backendData);
            }

            if (result && result.success) {
              let applicationNo: string;

              if (currentApplicationNo) {
                // Update işleminde mevcut application number'ı kullan
                applicationNo = currentApplicationNo;
              } else if (result.data) {
                // Backend'den gelen data string mi yoksa object mi kontrol et
                if (typeof result.data === "string") {
                  // Direkt string olarak applicationNo dönüyorsa
                  applicationNo = result.data;
                  setApplicationNo(applicationNo);
                } else if (typeof result.data === "object") {
                  // Object olarak dönüyorsa
                  const data = result.data as Record<string, unknown>;
                  if (data.applicationNo) {
                    applicationNo = String(data.applicationNo);
                    setApplicationNo(applicationNo);
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              } else {
                return false;
              }

              return true; // Başarılı
            } else if (result && result.redirectTo) {
              // JWT expired hatası - login sayfasına yönlendir
              // Güvenli routing - sadece güvenilir URL'lere yönlendir
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
        return isValid;
      },
    }));

    const residencyTypeId = watch("residencyTypeId");

    // FormData değiştiğinde form değerlerini güncelle
    useEffect(() => {
      if (formData) {
        setValue(
          "applicantInventor",
          (formData.applicantInventor as string) || "both"
        );
        setValue(
          "applicantEntitlementRate",
          (formData.applicantEntitlementRate as string) || ""
        );
        setValue("nationalityNo", (formData.nationalityNo as string) || "");
        setValue("nationalIdNo", (formData.nationalIdNo as string) || "");
        setValue("prefix", (formData.prefix as string) || "");
        setValue("firstName", (formData.firstName as string) || "");
        setValue("middleName", (formData.middleName as string) || "");
        setValue("lastName", (formData.lastName as string) || "");
        setValue("suffix", (formData.suffix as string) || "");
        const birthDateValue = (() => {
          if (formData.birthDate instanceof Date) {
            return formData.birthDate;
          }
          if (
            typeof formData.birthDate === "string" ||
            typeof formData.birthDate === "number"
          ) {
            return new Date(formData.birthDate);
          }
          return undefined; // No default date
        })();

        if (birthDateValue) {
          setValue("birthDate", birthDateValue);
        }
        setValue("genderId", (formData.genderId as string) || "");
        setValue("residencyTypeId", (formData.residencyTypeId as string) || "");
        setValue("stateId", (formData.stateId as string) || "");
        setValue("city", (formData.city as string) || "");
        setValue("countryId", Number(formData.countryId) || 0);
        setValue("ciCountryId", Number(formData.ciCountryId) || 0);
        setValue(
          "ciStreetAddressOne",
          (formData.ciStreetAddressOne as string) || ""
        );
        setValue(
          "ciStreetAddressTwo",
          (formData.ciStreetAddressTwo as string) || ""
        );
        setValue("ciCity", (formData.ciCity as string) || "");
        setValue("ciPostalCode", (formData.ciPostalCode as string) || "");
        setValue("isAnonymous", (formData.isAnonymous as boolean) || false);
        setValue("countryCode", (formData.countryCode as string) || "");
        setValue("phoneNumber", (formData.phoneNumber as string) || "");
      }
    }, [formData, setValue]);

    // Automatically set "both" value to formData when component mounts (display only)
    useEffect(() => {
      handleChange("applicantInventor", "both");
    }, [handleChange]);

    // Token'dan gelen user bilgisi ile countryCode ve phoneNumber alanlarını doldur
    useEffect(() => {
      const userInfo = getUserInfo();
      if (userInfo && countries.length > 0) {
        // phoneNumberCountryCodeId'den country code'u bul
        const selectedCountry = countries.find(
          (country) => country.countryId === userInfo.phoneNumberCountryCodeId
        );
        const countryCode = selectedCountry
          ? selectedCountry.countryCode
          : "+90";

        setValue("countryCode", countryCode);
        setValue("phoneNumber", userInfo.phoneNumber || "");
        handleChange("countryCode", countryCode);
        handleChange("phoneNumber", userInfo.phoneNumber || "");
      }
    }, [setValue, handleChange, countries]);

    // User bilgilerini form'a set et (sadece gösterim amaçlı)
    useEffect(() => {
      const userInfo = getUserInfo();
      if (userInfo) {
        // Form values'ını user bilgileri ile güncelle (sadece gösterim)
        setValue("firstName", userInfo.firstName || "");
        setValue("middleName", userInfo.middleName || "");
        setValue("lastName", userInfo.lastName || "");
        setValue("email", userInfo.email || "");

        // FormData'ya da set et (gösterim amaçlı)
        handleChange("firstName", userInfo.firstName || "");
        handleChange("middleName", userInfo.middleName || "");
        handleChange("lastName", userInfo.lastName || "");
        handleChange("email", userInfo.email || "");
      }
    }, [setValue, handleChange]);

    // Watch form values and trigger validation when they change
    useEffect(() => {
      const subscription = watch((value, { name }) => {
        // isAnonymous için validation tetikleme - sadece prefix ve suffix için
        if (name === "prefix" || name === "suffix") {
          setTimeout(() => trigger(name), 0);
        }
      });
      return () => subscription.unsubscribe();
    }, [watch, trigger]);

    // Handle initial loading state
    useEffect(() => {
      if (!countriesLoading && !statesLoading && !gendersLoading) {
        // Countries, states and genders loading finished (whether successful or not)
        setIsInitialLoading(false);
      }
    }, [countriesLoading, statesLoading, gendersLoading]);

    const handleRadioChange = (value: boolean) => {
      if (value !== undefined && value !== null) {
        setValue("isAnonymous", value);
        handleChange("isAnonymous", value);

        // isAnonymous için ekstra validation tetiklemeye gerek yok
        // Form state zaten güncellendi
      }
    };

    // Show loading spinner while data is being loaded
    if (
      isInitialLoading ||
      countriesLoading ||
      statesLoading ||
      gendersLoading
    ) {
      return (
        <div className="p-6 flex items-center justify-center min-h-96">
          <LoadingSpinner size="xl" text="Loading form data..." />
        </div>
      );
    }

    return (
      <div className="p-6">
        {countriesError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">
              Error loading countries: {countriesError}
            </p>
          </div>
        )}

        {statesError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">
              Error loading states: {statesError}
            </p>
          </div>
        )}

        {gendersError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">
              Error loading genders: {gendersError}
            </p>
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Applicant / Inventor Information Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Applicant / Inventor Information
            </h3>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              * Applicant/Inventor
            </label>
            <div className="w-full">
              <Controller
                name="applicantInventor"
                control={control}
                render={({ field }) => (
                  <Select
                    name="applicantInventor"
                    value={field.value}
                    onChange={(value: unknown) => {
                      const val =
                        (value as { label: string; value: string })?.value ||
                        value;
                      field.onChange(val);
                      handleChange("applicantInventor", String(val));
                    }}
                    placeholder="Please select"
                    data={FORM_DATA_ARRAYS.applicantInventor}
                    disabled={true}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Applicant Entitlement Rate (%)
            </label>
            <div className="w-full">
              <Controller
                name="applicantEntitlementRate"
                control={control}
                rules={{
                  required: "Entitlement rate is required",
                  pattern: {
                    value: /^(100|[1-9]?\d)$/,
                    message: "Please enter a number between 0 and 100",
                  },
                }}
                render={({ field }) => (
                  <InputText
                    name="applicantEntitlementRate"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      if (value !== undefined && value !== null) {
                        handleChange("applicantEntitlementRate", value);
                      }
                    }}
                    placeholder="Enter a number between 0 and 100"
                  />
                )}
              />
            </div>
            {errors.applicantEntitlementRate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.applicantEntitlementRate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              * Nationality
            </label>
            <div className="w-full">
              <Controller
                name="nationalityNo"
                control={control}
                rules={{ required: "Nationality is required" }}
                render={({ field }) => (
                  <Select
                    name="nationalityNo"
                    value={field.value}
                    onChange={(value: unknown) => {
                      const val =
                        (value as { label: string; value: number })?.value ||
                        value;
                      field.onChange(val);
                      if (val !== undefined && val !== null) {
                        handleChange("nationalityNo", String(val));
                      }
                    }}
                    data={FORM_DATA_ARRAYS.nationalityNo}
                  />
                )}
              />
            </div>
            {errors.nationalityNo && (
              <p className="text-sm text-red-500 mt-1">
                {errors.nationalityNo.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              * National Identity Number
            </label>
            <div className="w-full">
              <Controller
                name="nationalIdNo"
                control={control}
                rules={{
                  required: "National ID is required",
                  pattern: {
                    value: /^\d{11}$/,
                    message: "National ID must be exactly 11 digits",
                  },
                }}
                render={({ field }) => (
                  <InputText
                    name="nationalIdNo"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      if (value !== undefined && value !== null) {
                        handleChange("nationalIdNo", value);
                      }
                    }}
                    maxLength={11}
                    placeholder="12345678901"
                  />
                )}
              />
            </div>
            {errors.nationalIdNo && (
              <p className="text-sm text-red-500 mt-1">
                {errors.nationalIdNo.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Prefix
            </label>
            <div className="w-full">
              <Controller
                name="prefix"
                control={control}
                render={({ field }) => (
                  <Select
                    name="prefix"
                    value={field.value}
                    onChange={(value: InputValue) => {
                      const val = extractSelectValue(value);
                      field.onChange(val);
                      // Prefix zorunlu değil, undefined/null değer geldiğinde formData'dan sil
                      if (val === undefined || val === null || val === "") {
                        setValue("prefix", "");
                        handleChange("prefix", undefined);
                      } else {
                        setValue("prefix", val);
                        handleChange("prefix", val);
                      }
                      // Validation'ı tetikle - setTimeout ile async olarak
                      setTimeout(() => trigger(), 0);
                    }}
                    data={FORM_DATA_ARRAYS.prefix}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              * First Name
            </label>
            <div className="w-full">
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First name is required" }}
                render={({ field }) => (
                  <InputText
                    disabled={true}
                    name="firstName"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // Bu alan sadece gösterim amaçlı, handleChange kullanılmıyor
                    }}
                  />
                )}
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Middle Name
            </label>
            <div className="w-full">
              <Controller
                name="middleName"
                control={control}
                render={({ field }) => (
                  <InputText
                    disabled={true}
                    name="middleName"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // Bu alan sadece gösterim amaçlı, handleChange kullanılmıyor
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              * Last Name
            </label>
            <div className="w-full">
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Last name is required" }}
                render={({ field }) => (
                  <InputText
                    disabled={true}
                    name="lastName"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // Bu alan sadece gösterim amaçlı, handleChange kullanılmıyor
                    }}
                  />
                )}
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Suffix
            </label>
            <div className="w-full">
              <Controller
                name="suffix"
                control={control}
                render={({ field }) => (
                  <Select
                    name="suffix"
                    value={field.value}
                    onChange={(value: InputValue) => {
                      const val = extractSelectValue(value);
                      field.onChange(val);
                      // Suffix zorunlu değil, undefined/null değer geldiğinde formData'dan sil
                      if (val === undefined || val === null || val === "") {
                        setValue("suffix", "");
                        handleChange("suffix", undefined);
                      } else {
                        setValue("suffix", val);
                        handleChange("suffix", val);
                      }
                      // Validation'ı tetikle - setTimeout ile async olarak
                      setTimeout(() => trigger(), 0);
                    }}
                    data={FORM_DATA_ARRAYS.suffix}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              * Date of Birth
            </label>
            <div className="w-full">
              <Controller
                name="birthDate"
                control={control}
                rules={{ required: "Date of birth is required" }}
                render={({ field }) => (
                  <InputDate
                    name="birthDate"
                    value={(() => {
                      if (field.value instanceof Date) {
                        return field.value;
                      }
                      if (
                        typeof field.value === "string" ||
                        typeof field.value === "number"
                      ) {
                        return new Date(field.value);
                      }
                      return undefined;
                    })()}
                    onChange={(value: InputValue) => {
                      field.onChange(value);
                      if (value !== undefined && value !== null) {
                        handleChange("birthDate", value);
                      }
                    }}
                  />
                )}
              />
            </div>
            {errors.birthDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.birthDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              * Gender
            </label>
            <div className="w-full">
              <Controller
                name="genderId"
                control={control}
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <Select
                    name="genderId"
                    value={field.value}
                    onChange={(value: InputValue) => {
                      const val = extractSelectValue(value);
                      field.onChange(val);
                      if (val !== undefined && val !== null) {
                        handleChange("genderId", val);
                      }
                    }}
                    data={genders.map((gender) => ({
                      label: gender.genderName,
                      value: gender.genderId.toString(),
                    }))}
                    disabled={gendersLoading}
                  />
                )}
              />
            </div>
            {errors.genderId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.genderId.message}
              </p>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Contact Information
            </h3>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              * Email
            </label>
            <div className="w-full">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email format",
                  },
                }}
                render={({ field }) => (
                  <InputText
                    disabled={true}
                    name="email"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // Bu alan sadece gösterim amaçlı, handleChange kullanılmıyor
                    }}
                  />
                )}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number (from user profile)
            </label>
            <div className="flex gap-2">
              <div
                className="w-1/4 relative z-10"
                style={{ display: "contents" }}
              >
                <Controller
                  name="countryCode"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <Select
                      name="countryCode"
                      value={field.value}
                      onChange={() => {}}
                      data={
                        countries.length > 0
                          ? countries.map((country) => ({
                              label: `${country.countryName} (${country.countryCode})`,
                              value: country.countryId.toString(),
                            }))
                          : FORM_DATA_ARRAYS.countryCode
                      }
                      disabled={true}
                    />
                  )}
                />
              </div>
              <div className="w-3/4 relative z-0">
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <InputText
                      name="phoneNumber"
                      value={field.value}
                      onChange={() => {}}
                      disabled={true}
                    />
                  )}
                />
              </div>
            </div>
            {errors.countryCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.countryCode.message}
              </p>
            )}
            {errors.phoneNumber && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Residence Information Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Residence Information
            </h3>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700 whitespace-nowrap">
              * Residency Type
            </label>
            <div className="w-full">
              <Controller
                name="residencyTypeId"
                control={control}
                rules={{ required: "Residency type is required" }}
                render={({ field }) => (
                  <Select
                    name="residencyTypeId"
                    value={field.value}
                    onChange={(value: InputValue) => {
                      const val = extractSelectValue(value);
                      field.onChange(val);
                      if (val !== undefined && val !== null) {
                        handleChange("residencyTypeId", val);
                      }
                    }}
                    data={FORM_DATA_ARRAYS.residencyTypeId}
                  />
                )}
              />
            </div>
            {errors.residencyTypeId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.residencyTypeId.message}
              </p>
            )}
          </div>

          {(residencyTypeId === "1" || residencyTypeId === "3") && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                * State / Province
              </label>
              <div className="w-full">
                <Controller
                  name="stateId"
                  control={control}
                  rules={{ required: "State is required" }}
                  render={({ field }) => (
                    <Select
                      name="stateId"
                      value={field.value}
                      onChange={(value: InputValue) => {
                        const val = extractSelectValue(value);
                        field.onChange(val);
                        if (val !== undefined && val !== null) {
                          handleChange("stateId", val);
                        }
                      }}
                      data={states.map((state) => ({
                        label: state.stateName,
                        value: state.stateId.toString(),
                      }))}
                      disabled={statesLoading}
                    />
                  )}
                />
              </div>
              {errors.stateId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.stateId.message}
                </p>
              )}
            </div>
          )}

          {residencyTypeId === "2" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                * Country of Residence
              </label>
              <div className="w-full">
                <Controller
                  name="countryId"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <Select
                      name="countryId"
                      value={field.value}
                      onChange={(value: InputValue) => {
                        const val = extractSelectValue(value);
                        field.onChange(val);
                        if (val !== undefined && val !== null) {
                          handleChange("countryId", val);
                        }
                      }}
                      data={
                        countries.length > 0
                          ? countries.map((country) => ({
                              label: country.countryName,
                              value: country.countryId.toString(),
                            }))
                          : FORM_DATA_ARRAYS.countryId
                      }
                      disabled={countriesLoading}
                    />
                  )}
                />
              </div>
              {errors.countryId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.countryId.message}
                </p>
              )}
            </div>
          )}

          {(residencyTypeId === "1" ||
            residencyTypeId === "2" ||
            residencyTypeId === "3") && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                * City
              </label>
              <div className="w-full">
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: "City is required" }}
                  render={({ field }) => (
                    <InputText
                      name="city"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        if (value !== undefined && value !== null) {
                          handleChange("city", value);
                        }
                      }}
                    />
                  )}
                />
              </div>
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
          )}

          {/* Correspondence Information Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Correspondence Information
            </h3>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              * Country
            </label>
            <div className="w-full">
              <Controller
                name="ciCountryId"
                control={control}
                rules={{ required: "CI Country is required" }}
                render={({ field }) => (
                  <Select
                    name="ciCountryId"
                    value={field.value}
                    onChange={(value: InputValue) => {
                      const val = extractSelectValue(value);
                      field.onChange(val);
                      if (val !== undefined && val !== null) {
                        handleChange("ciCountryId", val);
                      }
                    }}
                    data={
                      countries.length > 0
                        ? countries.map((country) => ({
                            label: country.countryName,
                            value: country.countryId.toString(),
                          }))
                        : FORM_DATA_ARRAYS.ciCountryId
                    }
                    disabled={countriesLoading}
                  />
                )}
              />
            </div>
            {errors.ciCountryId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ciCountryId.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              * Street Address 1
            </label>
            <div className="w-full">
              <Controller
                name="ciStreetAddressOne"
                control={control}
                rules={{ required: "Street address is required" }}
                render={({ field }) => (
                  <InputText
                    name="ciStreetAddressOne"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      if (value !== undefined && value !== null) {
                        handleChange("ciStreetAddressOne", value);
                      }
                    }}
                  />
                )}
              />
            </div>
            {errors.ciStreetAddressOne && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ciStreetAddressOne.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Street Address 2
            </label>
            <div className="w-full">
              <Controller
                name="ciStreetAddressTwo"
                control={control}
                render={({ field }) => (
                  <InputText
                    name="ciStreetAddressTwo"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      if (value !== undefined && value !== null) {
                        handleChange("ciStreetAddressTwo", value);
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              * City
            </label>
            <div className="w-full">
              <Controller
                name="ciCity"
                control={control}
                rules={{ required: "CI City is required" }}
                render={({ field }) => (
                  <InputText
                    name="ciCity"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      if (value !== undefined && value !== null) {
                        handleChange("ciCity", value);
                      }
                    }}
                  />
                )}
              />
            </div>
            {errors.ciCity && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ciCity.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <div className="w-full">
              <div className="w-full">
                <Controller
                  name="ciPostalCode"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      name="ciPostalCode"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        if (value !== undefined && value !== null) {
                          handleChange("ciPostalCode", value);
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              The Inventor Wishes to Remain Anonymous.
            </label>
            <div className="flex flex-col gap-4">
              <Controller
                name="isAnonymous"
                control={control}
                rules={{
                  validate: (value) => {
                    if (value === undefined || value === null) {
                      return "Please select an option";
                    }
                    return true;
                  },
                }}
                render={({ field }) => {
                  return (
                    <>
                      <Radio
                        label="Yes"
                        value="yes"
                        checked={field.value === true}
                        onChange={() => handleRadioChange(true)}
                      />
                      <Radio
                        label="No"
                        value="no"
                        checked={field.value === false}
                        onChange={() => handleRadioChange(false)}
                      />
                    </>
                  );
                }}
              />
            </div>
            {errors.isAnonymous && (
              <p className="text-sm text-red-500 mt-1">
                {errors.isAnonymous.message}
              </p>
            )}
          </div>
        </form>
      </div>
    );
  }
);

Step1.displayName = "Step1";

export default Step1;
