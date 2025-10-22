"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useApplicationSummary } from "@/hooks/useApplicationSummary";
import { useViewFeedback, ViewFeedbackData } from "@/hooks/useViewFeedback";
import { useFeedbackCategories } from "@/hooks/useFeedbackCategories";
import { FormDataStructure } from "@/types/CommonTypes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function ViewFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const applicationNo = params?.applicationNo as string;

  const { fetchApplicationSummary } = useApplicationSummary();
  const { fetchLatestFeedback } = useViewFeedback();
  const { feedbackCategories } = useFeedbackCategories();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [applicationData, setApplicationData] =
    useState<FormDataStructure | null>(null);
  const [feedbackData, setFeedbackData] = useState<ViewFeedbackData | null>(
    null
  );

  useEffect(() => {
    const loadData = async () => {
      if (!applicationNo) return;

      try {
        setLoading(true);

        // Load application summary and latest feedback (type 2 = Feedback Sent)
        const [summary, feedback] = await Promise.all([
          fetchApplicationSummary(applicationNo),
          fetchLatestFeedback(applicationNo, 2),
        ]);

        if (summary) {
          setApplicationData(summary as unknown as FormDataStructure);
        }

        if (feedback) {
          setFeedbackData(feedback);
        }
      } catch {
        setError("Failed to load feedback data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [applicationNo, fetchApplicationSummary, fetchLatestFeedback]);

  const handleGoBack = () => {
    router.push("/allapplications");
  };

  const handleDownloadFile = async () => {
    if (!feedbackData?.id) return;

    try {
      setDownloading(true);

      const token = sessionStorage.getItem("authToken");
      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/send-feedback/download/${feedbackData.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        feedbackData.fileName || `feedback_file${feedbackData.fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    } finally {
      setDownloading(false);
    }
  };

  const getCategoryNames = (categoryIds: number[]) => {
    if (!categoryIds || categoryIds.length === 0) return [];

    return categoryIds
      .map((id) => {
        const category = feedbackCategories.find((cat) => cat.id === id);
        return category
          ? category.feedbackCategoryDescription
          : `Category ${id}`;
      })
      .filter(Boolean);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading feedback details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Feedback
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/allapplications")}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  if (!feedbackData) {
    return (
      <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Feedback Found
          </h2>
          <p className="text-gray-600 mb-6">
            No feedback has been sent for this application yet.
          </p>
          <button
            onClick={handleGoBack}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Feedback Details
              </h1>
            </div>
            <div>
              <button
                onClick={() =>
                  router.push(`/newapplication/step/1/${applicationNo}`)
                }
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>Continue Application</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Information Card - Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-orange-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-white"
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
              <div>
                <h2 className="text-xl font-bold text-white">
                  Feedback Information
                </h2>
                <p className="text-orange-100 text-sm">
                  Feedback Type:{" "}
                  {feedbackData.feedbackType === 1
                    ? "Approved"
                    : feedbackData.feedbackType === 2
                    ? "Feedback Sent"
                    : "Rejected"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-sm font-medium">
                Sent on{" "}
                {new Date(feedbackData.createdAt).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-orange-100 text-xs">
                {new Date(feedbackData.createdAt).toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="p-6">
            {/* Application Information */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 text-blue-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Application Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">
                    Application Number:
                  </span>
                  <div className="text-gray-900 font-semibold">
                    {applicationNo}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Applicant / Inventor:
                  </span>
                  <div className="text-gray-900">
                    {applicationData?.firstName} {applicationData?.lastName}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <div className="text-gray-900">
                    {applicationData?.titleOfInvention || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Feedback Categories */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 text-orange-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Feedback Categories
                  </h3>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    {getCategoryNames(feedbackData.feedbackCategories).length >
                    0 ? (
                      <ul className="space-y-3">
                        {getCategoryNames(feedbackData.feedbackCategories).map(
                          (category, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-orange-800 font-medium">
                                {category}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-orange-800">No categories selected</p>
                    )}
                  </div>
                </div>

                {/* Attached File */}
                {feedbackData.fileName && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      Attached Document
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {feedbackData.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {feedbackData.fileExtension?.toUpperCase()} File
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleDownloadFile}
                          disabled={downloading}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {downloading ? (
                            <>
                              <LoadingSpinner
                                size="sm"
                                color="white"
                                className="w-4 h-4"
                              />
                              <span>Downloading...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Description and Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Feedback Description
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 leading-relaxed whitespace-pre-wrap">
                      {feedbackData.description || "No description provided"}
                    </p>
                  </div>
                </div>

                {/* Remarks */}
                {feedbackData.remarks && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 text-purple-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      Additional Remarks
                    </h3>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-purple-800 leading-relaxed whitespace-pre-wrap">
                        {feedbackData.remarks}
                      </p>
                    </div>
                  </div>
                )}

                {/* Feedback Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 text-indigo-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Timeline
                  </h3>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full mt-1"></div>
                      <div>
                        <p className="text-indigo-800 font-medium">
                          Feedback submitted
                        </p>
                        <p className="text-indigo-600 text-sm">
                          {new Date(feedbackData.createdAt).toLocaleDateString(
                            "tr-TR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                        <p className="text-indigo-600 text-xs mt-1">
                          The applicant has been notified and can now make
                          necessary revisions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end items-center">
              <div className="flex space-x-3">
                <button
                  onClick={handleGoBack}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to Applications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
