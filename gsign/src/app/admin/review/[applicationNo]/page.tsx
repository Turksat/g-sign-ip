"use client";

import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Button} from "@edk/ui-react";
import {useApplicationSummary} from "@/hooks/useApplicationSummary";
import {transformApplicationSummaryToFormData} from "@/libs/dataTransformation";
import {usePatentClassifications} from "@/hooks/usePatentClassifications";
import {useApplicationTypes} from "@/hooks/useApplicationTypes";
import {useCountries} from "@/hooks/useCountries";
import {ApplicationDocumentMetadata, useDocumentMetadatas,} from "@/hooks/useDocumentMetadatas";
import {FORM_DATA_ARRAYS, getLabelByValue} from "@/libs/formData";
import ApplicationNumber from "@/components/common/ApplicationNumber";
import LikelihoodRateDisplay from "@/components/common/LikelihoodRateDisplay";
import {LoadingSpinner} from "@/components/common/LoadingSpinner";

const AdminReviewPage = () => {
    const params = useParams();
    const router = useRouter();
    const {fetchApplicationSummary} = useApplicationSummary();
    const {patentClassifications} = usePatentClassifications();
    const {applicationTypes} = useApplicationTypes();
    const {countries} = useCountries();
    const {documentMetadatas, fetchDocumentMetadatas} = useDocumentMetadatas();

    const [applicationNo, setApplicationNo] = useState<string>("");
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [processedData, setProcessedData] = useState<Record<string, unknown>>(
        {}
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get application number from URL params
    useEffect(() => {
        if (params?.applicationNo) {
            setApplicationNo(params.applicationNo as string);
        }
    }, [params]);

    // Load application data
    useEffect(() => {
        const loadApplicationData = async () => {
            if (!applicationNo) return;

            setLoading(true);
            setError(null);

            try {
                const summary = await fetchApplicationSummary(applicationNo);
                if (summary) {
                    const transformedData = transformApplicationSummaryToFormData(
                        summary as unknown as Record<string, unknown>
                    );
                    setFormData(transformedData);
                    setProcessedData(transformedData);
                } else {
                    setError("Application not found");
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setError("Failed to load application data");
            } finally {
                setLoading(false);
            }
        };

        loadApplicationData();
    }, [applicationNo, fetchApplicationSummary]);

    // Load document metadatas
    useEffect(() => {
        if (applicationNo) {
            fetchDocumentMetadatas(applicationNo);
        }
    }, [applicationNo, fetchDocumentMetadatas]);

    // Update processedData with document metadatas
    useEffect(() => {
        if (documentMetadatas && documentMetadatas.length > 0) {
            setProcessedData((prev) => ({
                ...prev,
                documentMetadatas: documentMetadatas,
                uploadedFiles: {
                    ...((prev.uploadedFiles as Record<string, unknown>) || {}),
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
                },
            }));
        }
    }, [documentMetadatas]);

    // Helper functions (same as Step6)
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

    const getData = (key: string): unknown => {
        if (
            key === "claims" ||
            key === "drawings" ||
            key === "supportingDocuments" ||
            key === "abstract"
        ) {
            const uploadedFiles =
                (processedData.uploadedFiles as Record<string, unknown>) || {};
            let files =
                uploadedFiles[key] ||
                uploadedFiles[key === "abstract" ? "abstractOfTheDisclosures" : key] ||
                [];

            if (!files || (Array.isArray(files) && files.length === 0)) {
                files = processedData[key] || [];
            }

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

        if (value === null || value === undefined || value === "") {
            value = (formData as Record<string, unknown>)?.[key];
        }

        if (value === null || value === undefined || value === "") {
            return "";
        }
        return value;
    };

    const getCountryName = (countryCode: unknown): string => {
        if (!countryCode || countryCode === "" || countryCode === "0") return "";

        const country = countries.find(
            (c) => c.countryCode === String(countryCode)
        );
        return country ? country.countryName : String(countryCode);
    };

    const getLabelValue = (key: string, value: unknown): string => {
        if (key === "countryId" || key === "ciCountryId") {
            return getCountryName(value);
        }

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

        if (value === true || value === "true") return "Yes";
        if (value === false || value === "false") return "No";

        return safeToString(value);
    };

    const getFileDisplayName = (file: Record<string, unknown>): string => {
        if (typeof file === "string") return file;
        if (file && typeof file === "object" && file.name) return String(file.name);
        if (file && typeof file === "object" && file.fileName)
            return String(file.fileName);
        return "Unknown file";
    };

    const handleFileDownload = (file: Record<string, unknown>) => {
        if (file && typeof file === "object") {
            if (file.file) {
                const url = URL.createObjectURL(file.file as File);
                const a = document.createElement("a");
                a.href = url;
                a.download = String(file.name) || "document.pdf";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else if (file.id) {
                const downloadUrl = `/api/upload/download/${String(file.id)}`;
                window.open(downloadUrl, "_blank");
            } else if (file.name) {
                const downloadUrl = `/api/upload/download/${String(file.name)}`;
                window.open(downloadUrl, "_blank");
            }
        }
    };

    const renderFilesList = (files: unknown, title: string) => {
        if (!files || !Array.isArray(files) || files.length === 0) {
            return (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <div
                        className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
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

    // Action handlers
    const handleApprove = () => {
        // Güvenli routing - Next.js router kullanarak Open Redirect saldırılarını önle
        router.push(`/admin/approve/${applicationNo}`);
    };

    const handleReject = () => {
        router.push(`/admin/reject/${applicationNo}`);
    };

    const handleSendFeedback = () => {
        // Güvenli routing - Next.js router kullanarak Open Redirect saldırılarını önle
        router.push(`/admin/feedback/${applicationNo}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <LoadingSpinner size="lg"/>
                    <p className="text-gray-600">Loading application...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">Error</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button
                        label="Back to Admin Panel"
                        variant="primary"
                        onClick={() => router.push("/admin")}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Application Review
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Review and evaluate patent application
                        </p>
                    </div>
                    <Button
                        label="Back to Admin Panel"
                        variant="secondary"
                        onClick={() => router.push("/admin")}
                    />
                </div>
            </div>

            {/* Information Banner */}
            <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">i</span>
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-800">
                            You can perform actions such as &quot;Approve&quot;,
                            &quot;Reject&quot; or &quot;Send Feedback&quot; on the application
                            status evaluation screen.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content - Same as Step6 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <form className="grid grid-cols-1 gap-6">
                    {/* Application Summary */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Application Summary
                        </h2>
                        <div className="flex justify-center">
                            <ApplicationNumber applicationNo={applicationNo || "N/A"}/>
                        </div>
                    </div>

                    {/* Applicant / Inventor Information */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Applicant / Inventor Information
                        </h2>
                        <div
                            className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
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
                        <div
                            className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
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
                        <div
                            className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
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
                        <div
                            className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
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
                        <div
                            className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
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
                        if (typeof govFunded === "boolean") {
                            return govFunded ? "Yes" : "No";
                        }
                        return getLabelValue("governmentFunded", govFunded);
                    })()}
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
                        <div
                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 space-y-8 text-sm text-gray-700 border border-gray-200 shadow-sm">
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
                        </div>
                    </div>

                    {/* First Inventor to File (AIA) */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            First Inventor to File (AIA)
                        </h2>
                        <div
                            className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
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
                        </div>
                    </div>

                    {/* Authorization to Permit Access */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Authorization to Permit Access
                        </h2>
                        <div
                            className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
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
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Signature
                        </h2>
                        <div
                            className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <strong className="text-gray-900">Applicant Name:</strong>
                                    <span className="ml-2">
                    {`${safeToString(getData("firstName"))} ${safeToString(
                        getData("middleName")
                    )} ${safeToString(getData("lastName"))}`}
                  </span>
                                </div>
                                <div>
                                    <strong className="text-gray-900">Digital Signature:</strong>
                                    <span className="ml-2 font-semibold text-blue-700">
                    {getData("signature") && safeToString(getData("signature"))
                        ? safeToString(getData("signature"))
                        : "Not yet signed"}
                  </span>
                                </div>
                                {Boolean(getData("signature")) && (
                                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 text-green-600 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-sm text-green-800 font-medium">
                        Application has been digitally signed by the applicant
                      </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Payment Information
                        </h2>
                        <div
                            className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700 border border-gray-200">
                            {getData("paymentAmount") ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <strong className="text-gray-900">Amount Paid:</strong>
                                        <span className="ml-2 font-semibold text-green-700">
                      {`${getData("paymentAmount")} ${getData(
                          "paymentCurrency"
                      )}`}
                    </span>
                                    </div>
                                    <div>
                                        <strong className="text-gray-900">Payment Date:</strong>
                                        <span className="ml-2">
                      {new Date(
                          getData("paymentDate") as string
                      ).toLocaleDateString("tr-TR")}
                    </span>
                                    </div>
                                    <div className="md:col-span-2">
                                        <strong className="text-gray-900">Payment Status:</strong>
                                        <span
                                            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                                getData("paymentStatus") === "COMPLETED"
                                                    ? "bg-green-100 text-green-800"
                                                    : getData("paymentStatus") === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : getData("paymentStatus") === "FAILED"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                      {String(getData("paymentStatus"))}
                    </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <div className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-orange-600 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                            />
                                        </svg>
                                        <span className="text-sm text-orange-800 font-medium">
                      Payment information not available for this application
                    </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Application Actions
                    </h3>
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={handleApprove}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-200"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Approve
                        </button>

                        <button
                            onClick={handleSendFeedback}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            Send Feedback
                        </button>

                        <button
                            onClick={handleReject}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-200"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReviewPage;
