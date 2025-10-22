"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useApplicationSummary } from "@/hooks/useApplicationSummary";
import { useApproveApplication } from "@/hooks/useApproveApplication";
import FileUpload from "@/components/common/FileUpload";
import { FormDataStructure } from "@/types/CommonTypes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Modal, Button } from "@edk/ui-react";

interface ApproveFormData {
  remarks: string;
  attachedFiles: File[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
}

export default function AdminApprovePage() {
  const params = useParams();
  const router = useRouter();
  const applicationNo = params?.applicationNo as string;

  const { fetchApplicationSummary } = useApplicationSummary();
  const {
    approveApplication,
    loading: approving,
    error: approveError,
  } = useApproveApplication();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationData, setApplicationData] =
    useState<FormDataStructure | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ApproveFormData>({
    mode: "onChange",
    defaultValues: {
      remarks: "",
      attachedFiles: [],
    },
  });

  // Watch form values
  const remarks = watch("remarks");

  // Register file validation (optional)
  useEffect(() => {
    register("attachedFiles", {
      required: false, // File upload is optional for approval
    });
  }, [register]);

  useEffect(() => {
    const loadApplicationData = async () => {
      if (!applicationNo) return;

      try {
        setLoading(true);
        const summary = await fetchApplicationSummary(applicationNo);
        if (summary) {
          setApplicationData(summary as unknown as FormDataStructure);
        } else {
          setError("Application not found");
        }
      } catch {
        setError("Failed to load application data");
      } finally {
        setLoading(false);
      }
    };

    loadApplicationData();
  }, [applicationNo, fetchApplicationSummary]);

  // File upload handlers
  const handleFileUploadSuccess = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    setValue("attachedFiles", files.map((f) => f.file!).filter(Boolean));
    // Trigger validation for attached files
    trigger("attachedFiles");
  };

  const handleFileUploadError = (error: string) => {
    setFormErrors((prev) => [...prev, error]);
  };

  const onSubmit = async () => {
    setFormErrors([]);

    try {
      // Get the first uploaded file (if any)
      const file = uploadedFiles.length > 0 ? uploadedFiles[0].file : undefined;

      const success = await approveApplication({
        applicationNo,
        remarks: remarks.trim(),
        file,
      });

      if (success) {
        setShowSuccessModal(true);
      } else if (approveError) {
        setFormErrors([approveError]);
      }
    } catch {
      setFormErrors(["Failed to approve application. Please try again."]);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="xl" color="green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Approve Application
          </h1>
          <p className="text-gray-600">
            Approve patent application and provide final approval documentation
          </p>
        </div>

        {/* Application Information Card */}
        <div className="mb-8 p-6 bg-white shadow-sm border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
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
            Application Information
          </h2>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
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

              <div>
                <span className="font-medium text-gray-700">
                  Application Date:
                </span>
                <div className="text-gray-900">
                  {applicationData?.createdAt
                    ? new Date(
                        String(applicationData.createdAt)
                      ).toLocaleDateString("tr-TR")
                    : "N/A"}
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-700">
                  Application Status:
                </span>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Under Review
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approve Form Card */}
        <div className="p-6 bg-white shadow-sm border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Approval Details
          </h2>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  Congratulations! Your patent application has been approved.
                </p>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks *
              </label>
              <textarea
                {...register("remarks", {
                  required: "Remarks are required",
                  minLength: {
                    value: 10,
                    message: "Remarks must be at least 10 characters long",
                  },
                  maxLength: {
                    value: 500,
                    message: "Remarks cannot exceed 500 characters",
                  },
                })}
                placeholder="Enter approval remarks..."
                rows={4}
                maxLength={500}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 resize-none ${
                  errors.remarks
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                }`}
              />
              <div className="mt-1 flex justify-between items-center">
                {errors.remarks && (
                  <p className="text-sm text-red-600">
                    {errors.remarks.message}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Remaining Characters: {500 - (remarks?.length || 0)}
                </p>
              </div>
            </div>

            {/* File Attachment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Examiner&apos;s Report *
              </label>
              <FileUpload
                maxFiles={1}
                maxSize={1024 * 1024} // 1MB
                accept={["application/pdf"]}
                onUploadSuccess={handleFileUploadSuccess}
                onError={handleFileUploadError}
                messages={{
                  maxFileMessage: "You can upload a maximum of 1 file.",
                  maxSizeMessage: "The maximum size of a file can be 1 MB.",
                  mimeTypeMessage: "Supported File Format: PDF",
                }}
                disabled={approving}
                autoUpload={true}
              />
              {errors.attachedFiles && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.attachedFiles.message}
                </p>
              )}
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    &quot;You are about to approve this patent
                    application.&quot;
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    This means the application meets all the required criteria
                    and no further feedback or changes will be requested. Please
                    review the application one last time before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* General Form Errors (for API errors, etc.) */}
            {formErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0"
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
                  <div>
                    <p className="text-sm text-red-800 font-medium">Error:</p>
                    <ul className="mt-1 text-sm text-red-700 space-y-1">
                      {formErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={approving}
              className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {approving ? (
                <>
                  <LoadingSpinner
                    size="sm"
                    color="white"
                    className="-ml-1 mr-2"
                  />
                  Approving...
                </>
              ) : (
                "Approve"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal with EDK UI */}
      <Modal
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        title=""
        size="sm"
      >
        <div className="flex flex-col items-center p-6 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
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
          </div>

          {/* Success Message */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Application Approved Successfully
          </h3>
          <p className="text-gray-600 mb-6">
            The patent application has been approved and the applicant will be
            notified.
          </p>

          {/* Continue Button */}
          <Button
            onClick={handleSuccessModalClose}
            variant="primary"
            size="lg"
            label="Continue"
          />
        </div>
      </Modal>
    </div>
  );
}
