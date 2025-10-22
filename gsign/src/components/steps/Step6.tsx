import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { CommonFormData } from "@/types/CommonTypes";
import { Button } from "@edk/ui-react";
import { FORM_DATA_ARRAYS, getLabelByValue } from "@/libs/formData";
import ApplicationNumber from "@/components/common/ApplicationNumber";
import LikelihoodRateDisplay from "@/components/common/LikelihoodRateDisplay";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

import { useForm, Controller } from "react-hook-form";
import { useApi } from "@/hooks/useApi";
import { usePatentClassifications } from "@/hooks/usePatentClassifications";
import { useApplicationTypes } from "@/hooks/useApplicationTypes";
import { useCountries } from "@/hooks/useCountries";
import { useStep6 } from "@/hooks/useApplicationSteps";
import {
  useDocumentMetadatas,
  ApplicationDocumentMetadata,
} from "@/hooks/useDocumentMetadatas";

interface Step6Ref {
  trigger: () => Promise<boolean>;
}

type Step6FormData = {
  confirmInfo: boolean;
  confirmPayment: boolean;
  signatureFirstName: string;
  signatureLastName: string;
  signature: string;
};

const Step6 = forwardRef<
  Step6Ref,
  CommonFormData & { applicationNo?: string | null }
>(({ formData, handleChange, applicationNo: propApplicationNo }, ref) => {
  const router = useRouter();
  const { getUserInfo } = useApi();
  const { updateApplicationStage6 } = useStep6();
  const { patentClassifications } = usePatentClassifications();
  const { applicationTypes } = useApplicationTypes();
  const { countries } = useCountries();
  const {
    documentMetadatas,
    fetchDocumentMetadatas,
    loading: documentsLoading,
  } = useDocumentMetadatas();
  const [processedData, setProcessedData] = useState<Record<string, unknown>>(
    {}
  );
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // applicationNo'yu session storage'dan al
  const getApplicationNo = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("currentApplicationNo");
    }
    return null;
  };

  // applicationNo'yu kullan
  const applicationNo = propApplicationNo || getApplicationNo();

  // Form validation için useForm hook'u
  const {
    control,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<Step6FormData>({
    defaultValues: {
      confirmInfo: false,
      confirmPayment: false,
      signatureFirstName: "", // User bilgilerinden doldurulacak
      signatureLastName: "", // User bilgilerinden doldurulacak
      signature: "", // User bilgilerinden doldurulacak
    },
  });

  // Ref'e form metodlarını expose et (validation yok ama consistency için)
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
            // Session'dan token'ı al
            const token = sessionStorage.getItem("authToken");
            if (!token) {
              // Güvenli routing - Next.js router kullanarak Open Redirect saldırılarını önle
              router.push("/login");
              return false;
            }

            const result = await updateApplicationStage6(
              applicationNo,
              formValues.signature || ""
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
          } catch (error) {}
        }
      }
      return isValid;
    },
  }));

  // FormData değiştiğinde form değerlerini güncelle
  useEffect(() => {
    if (formData) {
      setValue("confirmInfo", (formData.confirmInfo as boolean) || false);
      setValue("confirmPayment", (formData.confirmPayment as boolean) || false);
      setValue(
        "signatureFirstName",
        (formData.signatureFirstName as string) || ""
      );
      setValue(
        "signatureLastName",
        (formData.signatureLastName as string) || ""
      );
      setValue("signature", (formData.signature as string) || "");
    }
  }, [formData, setValue]);

  // User bilgilerini form'a set et (signature alanları için - sadece gösterim)
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      // Signature alanlarını user bilgileri ile doldur (sadece gösterim için)
      const firstName = userInfo.firstName || "";
      const lastName = userInfo.lastName || "";
      const signature = `${firstName} ${lastName}`.trim();

      setValue("signatureFirstName", firstName);
      setValue("signatureLastName", lastName);
      setValue("signature", signature);

      // Context'e de kaydet
      handleChange("signatureFirstName", firstName);
      handleChange("signatureLastName", lastName);
      handleChange("signature", signature);
    }
  }, [getUserInfo, setValue, handleChange]);

  // Process formData when component mounts or formData changes
  useEffect(() => {
    // Prop olarak gelen formData'yı kullan
    if (formData && typeof formData === "object") {
      // Ensure all form data is properly processed
      const processed = {
        ...formData,
        // Ensure nested objects are properly handled
        uploadedFiles:
          (formData as Record<string, unknown>).uploadedFiles || {},
        // Ensure arrays are properly handled
        claims:
          (
            (formData as Record<string, unknown>).uploadedFiles as Record<
              string,
              unknown
            >
          )?.claims ||
          (formData as Record<string, unknown>).claims ||
          [],
        abstract:
          (
            (formData as Record<string, unknown>).uploadedFiles as Record<
              string,
              unknown
            >
          )?.abstractOfTheDisclosures ||
          (
            (formData as Record<string, unknown>).uploadedFiles as Record<
              string,
              unknown
            >
          )?.abstract ||
          (formData as Record<string, unknown>).abstract ||
          [],
        drawings:
          (
            (formData as Record<string, unknown>).uploadedFiles as Record<
              string,
              unknown
            >
          )?.drawings ||
          (formData as Record<string, unknown>).drawings ||
          [],
        supportingDocuments:
          (
            (formData as Record<string, unknown>).uploadedFiles as Record<
              string,
              unknown
            >
          )?.supportingDocuments ||
          (formData as Record<string, unknown>).supportingDocuments ||
          [],
      };

      setProcessedData(processed);
    } else {
      setProcessedData({});
    }
  }, [formData]);

  // Load document metadatas when applicationNo is available
  useEffect(() => {
    if (applicationNo) {
      fetchDocumentMetadatas(applicationNo);
    }
  }, [applicationNo, fetchDocumentMetadatas]);

  // Handle initial loading state
  useEffect(() => {
    if (
      applicationNo &&
      !documentsLoading &&
      (documentMetadatas.length > 0 || !documentsLoading)
    ) {
      // Data loaded or no documents to load
      setIsInitialLoading(false);
    } else if (!applicationNo) {
      // No application number, not loading
      setIsInitialLoading(false);
    }
  }, [applicationNo, documentsLoading, documentMetadatas]);

  // Update processedData with document metadatas when they are loaded
  useEffect(() => {
    if (documentMetadatas && documentMetadatas.length > 0) {
      const uploadedFilesData = {
        claims: documentMetadatas.filter(
          (doc: ApplicationDocumentMetadata) =>
            doc.applicationDocumentTypeId === 1
        ),
        abstract: documentMetadatas.filter(
          (doc: ApplicationDocumentMetadata) =>
            doc.applicationDocumentTypeId === 2
        ),
        drawings: documentMetadatas.filter(
          (doc: ApplicationDocumentMetadata) =>
            doc.applicationDocumentTypeId === 3
        ),
        supportingDocuments: documentMetadatas.filter(
          (doc: ApplicationDocumentMetadata) =>
            doc.applicationDocumentTypeId === 4
        ),
      };

      setProcessedData((prev) => ({
        ...prev,
        documentMetadatas: documentMetadatas,
        // Update uploadedFiles with document metadatas
        uploadedFiles: {
          ...((prev.uploadedFiles as Record<string, unknown>) || {}),
          ...uploadedFilesData,
        },
      }));

      // Also update the form context with the loaded files
      handleChange("uploadedFiles", uploadedFilesData);
    }
  }, [documentMetadatas, handleChange]);

  // Helper function to safely convert InputValue to string
  const safeToString = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "string") return value.trim() || "";
    if (typeof value === "number") return value.toString();
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value))
      return value.length > 0 ? `${value.length} file(s)` : "No files uploaded";
    if (value instanceof Date) return value.toLocaleDateString();
    return "";
  };

  // Helper function to get data from processedData with fallback
  const getData = (key: string): unknown => {
    // Special handling for file arrays
    if (
      key === "claims" ||
      key === "drawings" ||
      key === "supportingDocuments" ||
      key === "abstract"
    ) {
      // First try to get from uploadedFiles
      const uploadedFiles =
        (processedData.uploadedFiles as Record<string, unknown>) || {};
      let files =
        uploadedFiles[key] ||
        uploadedFiles[key === "abstract" ? "abstractOfTheDisclosures" : key] ||
        [];

      // If no files in uploadedFiles, try direct access
      if (!files || (Array.isArray(files) && files.length === 0)) {
        files = processedData[key] || [];
      }

      // If still no files, try from formData directly
      if (!files || (Array.isArray(files) && files.length === 0)) {
        const formDataFiles =
          ((formData as Record<string, unknown>).uploadedFiles as Record<
            string,
            unknown
          >) || {};
        files =
          formDataFiles[key] ||
          formDataFiles[
            key === "abstract" ? "abstractOfTheDisclosures" : key
          ] ||
          [];
      }

      return files;
    }

    let value = processedData[key];

    // If not found in processedData, try formData directly
    if (value === null || value === undefined || value === "") {
      value = (formData as Record<string, unknown>)?.[key];
    }

    if (value === null || value === undefined || value === "") {
      return "";
    }
    return value;
  };

  // Helper function to get country name by country code
  const getCountryName = (countryCode: unknown): string => {
    if (!countryCode || countryCode === "" || countryCode === "0") return "";

    const country = countries.find(
      (c) => c.countryCode === String(countryCode)
    );
    return country ? country.countryName : String(countryCode);
  };

  // Helper function to get label by value for select fields
  const getLabelValue = (key: string, value: unknown): string => {
    // Special handling for country fields
    if (key === "countryId" || key === "ciCountryId") {
      return getCountryName(value);
    }

    // Check if the key exists in FORM_DATA_ARRAYS
    if (key in FORM_DATA_ARRAYS) {
      // Boolean değerleri string'e çevir
      let stringValue = value;
      if (typeof value === "boolean") {
        stringValue = value.toString();
      }
      const label = getLabelByValue(
        key as keyof typeof FORM_DATA_ARRAYS,
        String(stringValue)
      );
      return label;
    }

    // Special handling for boolean-like values
    if (value === true || value === "true") return "Yes";
    if (value === false || value === "false") return "No";

    return safeToString(value);
  };

  // Helper function to get file display name
  const getFileDisplayName = (file: Record<string, unknown>): string => {
    if (typeof file === "string") return file;
    if (file && typeof file === "object" && file.name) return String(file.name);
    if (file && typeof file === "object" && file.fileName)
      return String(file.fileName);
    return "Unknown file";
  };

  // Helper function to handle file download
  const handleFileDownload = (file: Record<string, unknown>) => {
    if (file && typeof file === "object") {
      if (file.file) {
        // If we have a File object, create a download link
        const url = URL.createObjectURL(file.file as File);
        const a = document.createElement("a");
        a.href = url;
        a.download = String(file.name) || "document.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (file.id) {
        // If we have file ID, try to download from cache
        const downloadUrl = `/api/upload/download/${String(file.id)}`;
        window.open(downloadUrl, "_blank");
      } else if (file.name) {
        // If we have file name, try to download from cache
        const downloadUrl = `/api/upload/download/${String(file.name)}`;
        window.open(downloadUrl, "_blank");
      }
    }
  };

  // Helper function to navigate to specific step
  const navigateToStep = (stepNumber: number) => {
    if (applicationNo) {
      router.push(`/newapplication/step/${stepNumber}/${applicationNo}`);
    } else {
      router.push(`/newapplication/step/${stepNumber}`);
    }
  };

  // Helper function to render files list
  const renderFilesList = (files: unknown, title: string) => {
    if (!files || !Array.isArray(files) || files.length === 0) {
      return (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <span className="text-gray-500 italic">No files uploaded</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="space-y-3">
          {(files as Record<string, unknown>[]).map(
            (file: Record<string, unknown>, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <span className="text-gray-700 font-medium">
                  {getFileDisplayName(file)}
                </span>
                <Button
                  label="Download"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleFileDownload(file)}
                />
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  // Helper function to format date
  const formatDate = (dateValue: unknown): string => {
    if (!dateValue) return "";
    if (dateValue instanceof Date) return dateValue.toLocaleDateString();
    if (typeof dateValue === "string") {
      try {
        const date = new Date(dateValue);
        return date.toLocaleDateString();
      } catch {
        return dateValue;
      }
    }
    return "";
  };

  // Show loading spinner while data is being loaded
  if (isInitialLoading || documentsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" text="Loading application data..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <form className="grid grid-cols-1 gap-6">
        {/* Application Summary */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Application Summary
          </h2>
          <div className="flex justify-center">
            <ApplicationNumber applicationNo={applicationNo || "17/123,456"} />
          </div>
        </div>

        {/* Applicant / Inventor Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Applicant / Inventor Information
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-gray-900">Applicant / Inventor:</strong>
                <span className="ml-2">
                  {getLabelValue(
                    "applicantInventor",
                    getData("applicantInventor")
                  )}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">
                  Prefix-First Last Name-Suffix:
                </strong>
                <span className="ml-2">
                  {getLabelValue("prefix", getData("prefix"))}{" "}
                  {safeToString(getData("firstName"))}{" "}
                  {safeToString(getData("middleName"))}{" "}
                  {safeToString(getData("lastName"))}{" "}
                  {getLabelValue("suffix", getData("suffix"))}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">Nationality:</strong>
                <span className="ml-2">
                  {getLabelValue("nationalityNo", getData("nationalityNo"))}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">Date of Birth:</strong>
                <span className="ml-2">{formatDate(getData("birthDate"))}</span>
              </div>
              <div>
                <strong className="text-gray-900">National ID Number:</strong>
                <span className="ml-2">
                  {safeToString(getData("nationalIdNo"))}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">Gender:</strong>
                <span className="ml-2">
                  {getLabelValue("genderId", getData("genderId"))}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">
                  Applicant Entitlement Rate (%):
                </strong>
                <span className="ml-2">
                  {safeToString(getData("applicantEntitlementRate"))}%
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                label="Update"
                variant="primary"
                size="sm"
                onClick={() => navigateToStep(1)}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Contact Information
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-gray-900">Email Address:</strong>
                <span className="ml-2">{safeToString(getData("email"))}</span>
              </div>
              <div>
                <strong className="text-gray-900">Cell Phone Number:</strong>
                <span className="ml-2">
                  {getLabelValue("countryCode", getData("countryCode"))}{" "}
                  {safeToString(getData("phoneNumber"))}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                label="Update"
                variant="primary"
                size="sm"
                onClick={() => navigateToStep(1)}
              />
            </div>
          </div>
        </div>

        {/* Residence Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Residence Information
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-gray-900">Residency Type:</strong>
                <span className="ml-2">
                  {getLabelValue("residencyTypeId", getData("residencyTypeId"))}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">State / Province:</strong>
                <span className="ml-2">
                  {getLabelValue("stateId", getData("stateId"))}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">Country of Residence:</strong>
                <span className="ml-2">
                  {getLabelValue("countryId", getData("countryId"))}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">City:</strong>
                <span className="ml-2">{safeToString(getData("city"))}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                label="Update"
                variant="primary"
                size="sm"
                onClick={() => navigateToStep(1)}
              />
            </div>
          </div>
        </div>

        {/* Correspondence Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Correspondence Information
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-gray-900">Country:</strong>
                <span className="ml-2">
                  {getLabelValue("ciCountryId", getData("ciCountryId"))}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">City:</strong>
                <span className="ml-2">{safeToString(getData("ciCity"))}</span>
              </div>
              <div>
                <strong className="text-gray-900">Street Address 1:</strong>
                <span className="ml-2">
                  {safeToString(getData("ciStreetAddressOne"))}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">Postal Code:</strong>
                <span className="ml-2">
                  {safeToString(getData("ciPostalCode"))}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">Street Address 2:</strong>
                <span className="ml-2">
                  {safeToString(getData("ciStreetAddressTwo"))}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">
                  Inventor Information Confidential:
                </strong>
                <span className="ml-2">
                  {getLabelValue("anonymous", getData("anonymous"))}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                label="Update"
                variant="primary"
                size="sm"
                onClick={() => navigateToStep(1)}
              />
            </div>
          </div>
        </div>

        {/* Non-Provisional Utility Patent Application Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Non-Provisional Utility Patent Application Information
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-gray-900">Application Type:</strong>
                <span className="ml-2">
                  {(() => {
                    const appTypeId = getData("applicationTypeId");

                    if (!appTypeId || appTypeId === "") {
                      return (
                        <span className="text-gray-500 italic">
                          No application type selected
                        </span>
                      );
                    }

                    // applicationTypes'dan seçilen ID'ye göre name'i bul
                    const selectedApplicationType = applicationTypes.find(
                      (type) => {
                        // Type conversion yap - string'i number'a çevir
                        const appTypeIdNumber = parseInt(
                          appTypeId as string,
                          10
                        );
                        return type.applicationTypeId === appTypeIdNumber;
                      }
                    );

                    if (!selectedApplicationType) {
                      return (
                        <span className="text-gray-500 italic">
                          Application type not found
                        </span>
                      );
                    }

                    return selectedApplicationType.applicationTypeName;
                  })()}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">
                  Title of the Invention:
                </strong>
                <span className="ml-2">
                  {(() => {
                    const title =
                      getData("titleOfInvention") || getData("inventionTitle");
                    if (!title || title === "") {
                      return (
                        <span className="text-gray-500 italic">
                          No title provided
                        </span>
                      );
                    }
                    return safeToString(title);
                  })()}
                </span>
              </div>
              <div className="md:col-span-2">
                <strong className="text-gray-900">Invention Summary:</strong>
                <span className="ml-2">
                  {safeToString(getData("inventionSummary"))}
                </span>
              </div>
              <div className="md:col-span-2">
                <strong className="text-gray-900">
                  General Patent Classification:
                </strong>
                <div className="ml-2 mt-3">
                  {(() => {
                    const selectedClassificationIds = getData(
                      "patentClassificationId"
                    );
                    if (
                      !selectedClassificationIds ||
                      !Array.isArray(selectedClassificationIds) ||
                      selectedClassificationIds.length === 0
                    ) {
                      return (
                        <span className="text-gray-500 italic">
                          No classifications selected
                        </span>
                      );
                    }

                    // Seçilen classification ID'leri ile patentClassifications'dan eşleştir
                    const selectedClassifications =
                      patentClassifications.filter((classification) =>
                        selectedClassificationIds.includes(
                          classification.patentClassificationId
                        )
                      );

                    if (selectedClassifications.length === 0) {
                      return (
                        <span className="text-gray-500 italic">
                          No classifications found
                        </span>
                      );
                    }

                    return (
                      <div className="flex flex-wrap gap-4">
                        {selectedClassifications.map(
                          (classification, index) => (
                            <div
                              key={index}
                              className="group relative inline-flex items-start bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 text-blue-800 text-sm font-medium px-5 py-4 rounded-2xl border-2 border-blue-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                            >
                              <div className="flex flex-col">
                                <span className="text-blue-700 leading-relaxed max-w-xs">
                                  {classification.name}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div>
                <strong className="text-gray-900">
                  Geographical Origin of the Source / Knowledge:
                </strong>
                <span className="ml-2">
                  {getLabelValue(
                    "geographicalOrigin",
                    getData("geographicalOrigin")
                  )}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">Government Funding:</strong>
                <span className="ml-2">
                  {(() => {
                    const govFunded = getData("governmentFunded");
                    if (govFunded === null || govFunded === undefined) {
                      return (
                        <span className="text-gray-500 italic">
                          Not specified
                        </span>
                      );
                    }
                    // Boolean değer için direkt gösterim
                    if (typeof govFunded === "boolean") {
                      return govFunded ? "Yes" : "No";
                    }
                    // String değer için getLabelValue kullan
                    return getLabelValue("governmentFunded", govFunded);
                  })()}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                label="Update"
                variant="primary"
                size="sm"
                onClick={() => navigateToStep(2)}
              />
            </div>
          </div>
        </div>

        {/* Detailed Description of the Invention */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Detailed Description of the Invention
          </h2>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 space-y-8 text-sm text-gray-700 border border-gray-200 shadow-sm">
            <div className="space-y-8">
              {renderFilesList(getData("claims"), "Claims")}
              {renderFilesList(
                getData("abstract"),
                "Abstract of the Disclosure"
              )}
              {renderFilesList(getData("drawings"), "Drawings")}
              {renderFilesList(
                getData("supportingDocuments"),
                "Supporting Documents"
              )}

              {/* Likelihood Rate */}
              <div className="space-y-4 pt-4 border-t border-gray-300">
                <h3 className="text-lg font-semibold text-gray-900">
                  Likelihood Rate
                </h3>
                <LikelihoodRateDisplay
                  rate={Number(getData("likelihoodRate")) || 0}
                />
              </div>
            </div>
            <div className="flex justify-end pt-6 border-t border-gray-300">
              <Button
                label="Update"
                variant="primary"
                size="sm"
                onClick={() => navigateToStep(3)}
              />
            </div>
          </div>
        </div>

        {/* First Inventor to File (AIA) */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            First Inventor to File (AIA)
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-gray-900">
                  Evaluate the application under &quot;First Inventor to
                  File&quot;:
                </strong>
                <span className="ml-2">
                  {getLabelValue(
                    "firstInventorToFile",
                    getData("firstInventorToFile")
                  )}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                label="Update"
                variant="primary"
                size="sm"
                onClick={() => navigateToStep(4)}
              />
            </div>
          </div>
        </div>

        {/* Authorization to Permit Access */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Authorization to Permit Access
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-gray-900">
                  Allow Access to Application Documents:
                </strong>
                <span className="ml-2">
                  {getLabelValue(
                    "refuseApplicationFileAccess",
                    getData("refuseApplicationFileAccess")
                  )}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">
                  Allow Access to Search Results:
                </strong>
                <span className="ml-2">
                  {getLabelValue(
                    "refuseSearchResultsAccess",
                    getData("refuseSearchResultsAccess")
                  )}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                label="Update"
                variant="primary"
                size="sm"
                onClick={() => navigateToStep(5)}
              />
            </div>
          </div>
        </div>

        {/* Office Action Education */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Office Action Education
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="space-y-4 text-sm text-gray-700">
              <p className="font-medium">
                During the examination of your application, it may be rejected
                for the following reasons:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  <strong>§102:</strong> Lack of novelty - The invention is not
                  new or has been previously disclosed.
                </li>
                <li>
                  <strong>§103:</strong> Obviousness - The invention would have
                  been obvious to a person skilled in the art.
                </li>
                <li>
                  <strong>§112:</strong> Insufficient description or vague
                  claims - The specification does not provide adequate support
                  for the claims.
                </li>
              </ul>
              <p className="font-medium">
                Please carefully review all the details of the information you
                entered during the application process before proceeding. This
                information is critical for the validity of your application.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Controller
              name="confirmInfo"
              control={control}
              rules={{
                required:
                  "You must confirm that all information is accurate to proceed",
              }}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="confirmInfo"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <label
              htmlFor="confirmInfo"
              className="text-sm font-medium text-gray-700"
            >
              * I confirm that all the information I provided during the
              application process is accurate. I understand that missing or
              incorrect information may result in delays or rejection of my
              application.
            </label>
          </div>
          {errors.confirmInfo && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmInfo.message}
            </p>
          )}
          <p className="text-sm text-gray-600">
            Unless you accept this condition, you will not be able to proceed
            with the process.
          </p>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Information
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="space-y-4 text-sm text-gray-700">
              <p>To complete your application, payment must be made.</p>
              <p>
                After the payment is completed, you may withdraw your
                application, but the fee is non-refundable.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Controller
              name="confirmPayment"
              control={control}
              rules={{
                required: "You must confirm payment terms to proceed",
              }}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="confirmPayment"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <label
              htmlFor="confirmPayment"
              className="text-sm font-medium text-gray-700"
            >
              * I have read and approved the above Non-Provisional Utility
              Patent application, and I acknowledge that the payment is
              non-refundable.
            </label>
          </div>
          {errors.confirmPayment && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPayment.message}
            </p>
          )}
          <p className="text-sm text-gray-600">
            Unless you accept this condition, you will not be able to proceed
            with the process.
          </p>
        </div>

        {/* Signature */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Signature
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * First Name
                </label>
                <Controller
                  name="signatureFirstName"
                  control={control}
                  rules={{
                    required: "First name is required for signature",
                  }}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Automatically filled from your profile"
                    />
                  )}
                />
                {errors.signatureFirstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.signatureFirstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * Last Name
                </label>
                <Controller
                  name="signatureLastName"
                  control={control}
                  rules={{
                    required: "Last name is required for signature",
                  }}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Automatically filled from your profile"
                    />
                  )}
                />
                {errors.signatureLastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.signatureLastName.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * Signature
                </label>
                <Controller
                  name="signature"
                  control={control}
                  rules={{
                    required: "Signature is required",
                  }}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Automatically filled from your profile"
                    />
                  )}
                />
                {errors.signature && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.signature.message}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                Your application is not complete until you complete this field.
                (35 U.S.C. § 115 37 CFR § 1.63)
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
});

Step6.displayName = "Step6";

export default Step6;
