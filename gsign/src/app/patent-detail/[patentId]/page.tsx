"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@edk/ui-react";
import { useApi } from "@/hooks/useApi";
import { useCountries } from "@/hooks/useCountries";
import { useApplicationTypes } from "@/hooks/useApplicationTypes";
import { useApplicationSummary } from "@/hooks/useApplicationSummary";
import { useDocumentMetadatas } from "@/hooks/useDocumentMetadatas";
import ApplicationNumber from "@/components/common/ApplicationNumber";
import LikelihoodRateDisplay from "@/components/common/LikelihoodRateDisplay";
import { FORM_DATA_ARRAYS, getLabelByValue } from "@/libs/formData";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const PatentDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useApi();
  const { countries } = useCountries();
  const { applicationTypes } = useApplicationTypes();

  // Fetch application summary and documents
  const {
    fetchApplicationSummary,
    loading: summaryLoading,
    error: summaryError,
  } = useApplicationSummary();
  const {
    fetchDocumentMetadatas,
    loading: docsLoading,
    error: docsError,
  } = useDocumentMetadatas();

  const patentId = params?.patentId as string;
  const [processedData, setProcessedData] = useState<Record<string, unknown>>(
    {}
  );
  const [documentMetadatas, setDocumentMetadatas] = useState<
    Record<string, unknown>[]
  >([]);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch data when component mounts
  useEffect(() => {
    if (patentId) {
      const loadData = async () => {
        const summary = await fetchApplicationSummary(patentId);
        const docs = await fetchDocumentMetadatas(patentId);

        if (summary) {
          setProcessedData(summary as unknown as Record<string, unknown>);
        }
        if (docs) {
          setDocumentMetadatas(docs as unknown as Record<string, unknown>[]);
        }
      };

      loadData();
    }
  }, [patentId, fetchApplicationSummary, fetchDocumentMetadatas]);

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

  // Helper function to get data from processedData
  const getData = (key: string): unknown => {
    const value = processedData[key];
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
      if (file.id) {
        const downloadUrl = `/api/upload/download/${String(file.id)}`;
        window.open(downloadUrl, "_blank");
      } else if (file.name) {
        const downloadUrl = `/api/upload/download/${String(file.name)}`;
        window.open(downloadUrl, "_blank");
      }
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

  // Loading state
  if (summaryLoading || docsLoading) {
    return (
      <div className="flex-1 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading patent details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (summaryError || docsError) {
    return (
      <div className="flex-1 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Patent
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load patent details for ID: {patentId}
          </p>
          <button
            onClick={() => router.push("/similarapplications")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Patent Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Patent Details
            </h1>
            <p className="text-gray-600">
              Detailed information about the patent application
            </p>
          </div>
        </div>

        <form className="grid grid-cols-1 gap-6">
          {/* Application Summary */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Application Summary
            </h2>
            <div className="flex justify-center">
              <ApplicationNumber applicationNo={patentId || "17/123,456"} />
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
                  <strong className="text-gray-900">
                    Applicant / Inventor:
                  </strong>
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
                  <span className="ml-2">
                    {formatDate(getData("birthDate"))}
                  </span>
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
                    {getLabelValue(
                      "residencyTypeId",
                      getData("residencyTypeId")
                    )}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-900">State / Province:</strong>
                  <span className="ml-2">
                    {getLabelValue("stateId", getData("stateId"))}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-900">
                    Country of Residence:
                  </strong>
                  <span className="ml-2">
                    {getLabelValue("countryId", getData("countryId"))}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-900">City:</strong>
                  <span className="ml-2">{safeToString(getData("city"))}</span>
                </div>
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
                  <span className="ml-2">
                    {safeToString(getData("ciCity"))}
                  </span>
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

                      const selectedApplicationType = applicationTypes.find(
                        (type) => {
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
                        getData("titleOfInvention") ||
                        getData("inventionTitle");
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
                {renderFilesList(
                  documentMetadatas?.filter(
                    (doc: Record<string, unknown>) =>
                      doc.applicationDocumentTypeId === 1
                  ),
                  "Claims"
                )}
                {renderFilesList(
                  documentMetadatas?.filter(
                    (doc: Record<string, unknown>) =>
                      doc.applicationDocumentTypeId === 2
                  ),
                  "Abstract of the Disclosure"
                )}
                {renderFilesList(
                  documentMetadatas?.filter(
                    (doc: Record<string, unknown>) =>
                      doc.applicationDocumentTypeId === 3
                  ),
                  "Drawings"
                )}
                {renderFilesList(
                  documentMetadatas?.filter(
                    (doc: Record<string, unknown>) =>
                      doc.applicationDocumentTypeId === 4
                  ),
                  "Supporting Documents"
                )}

                {/* Likelihood Rate */}
                <div className="space-y-4 pt-4 border-t border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Likelihood Rate
                  </h3>
                  <LikelihoodRateDisplay
                    rate={Number(getData("likelihood")) || 0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-6 border-t border-gray-300">
            <Button
              label="Back to Patent Search"
              variant="secondary"
              onClick={() => router.push("/similarapplications")}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatentDetailPage;
