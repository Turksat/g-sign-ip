"use client";
import HeaderSection from "@/components/application_information/HeaderSection";
import {
  getActionButtons,
  getStatusColor,
} from "@/components/application_information/helper";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useApi } from "@/hooks/useApi";
import { useApplicationsWithLoading } from "@/hooks/useApplications";
import { ApplicationStatusId } from "@/libs/constants";
import {
  getStatusName,
  getStatusStatistics,
  transformBackendApplication,
} from "@/libs/statusUtils";
import { Table } from "@edk/ui-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PatentApplicationDashboard = () => {
  const { getUserInfo, isAuthenticated } = useApi();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const userInfo = getUserInfo();

  // Fetch applications from API - always call hooks at the top level
  const {
    applications: rawApplications,
    isLoading,
    error,
    hasApplications,
  } = useApplicationsWithLoading(
    isClient && userInfo?.userId ? userInfo.userId : null
  );

  // Show loading while hydrating
  if (!isClient) {
    return (
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated()) {
    router.push("/login");
    return null;
  }

  // Transform backend applications to frontend format
  const applications = Array.isArray(rawApplications)
    ? transformBackendApplication(rawApplications)
    : [];
  const stats = getStatusStatistics(applications);

  const handleNewApplicationClick = () => {
    router.push("/newapplication");
  };

  const handleAction = (action: string, applicationNumber: string) => {
    switch (action) {
      case "cancel":
        // Cancel application - redirect to cancel page
        router.push(`/cancel-application/${applicationNumber}`);
        break;
      case "view-application-summary":
        // View application summary PDF
        router.push(`/application-summary/${applicationNumber}`);
        break;
      case "make-payment":
        // Make payment - redirect to step 6
        // Application number'ı session storage'a kaydet
        sessionStorage.setItem("currentApplicationNo", applicationNumber);
        router.push(`/newapplication/step/6/${applicationNumber}`);
        break;
      case "view-summary":
        // View application summary
        break;
      case "continue":
        // Continue application
        router.push(`/newapplication/step/1/${applicationNumber}`);
        break;
      case "view-feedback":
        router.push(`/view-feedback/${applicationNumber}`);
        break;
      case "generate-document":
        // Generate barcoded document
        break;
      default:
        // Unknown action
        break;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading applications..." />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Applications
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!hasApplications) {
    return (
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Patent Applications
                </h1>
                <p className="text-gray-600">
                  Welcome back, {userInfo?.firstName} {userInfo?.lastName}
                </p>
              </div>
            </div>
          </div>

          {/* HeaderSection */}
          <HeaderSection
            onNewApplicationClick={handleNewApplicationClick}
            className="mb-8"
          />

          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Applications Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t submitted any patent applications yet. Start by
              creating your first application.
            </p>
            <button
              onClick={handleNewApplicationClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Create First Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Patent Applications
              </h1>
              <p className="text-gray-600">
                Welcome back, {userInfo?.firstName} {userInfo?.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* HeaderSection */}
        <HeaderSection
          onNewApplicationClick={handleNewApplicationClick}
          className="mb-8"
        />

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
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
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
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
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.inProgress}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
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
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Granted</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.granted}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Non-Provisional Utility Patent Application Information
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Manage and track your patent applications
            </p>
          </div>

          <div className="p-6">
            <Table
              columns={[
                {
                  dataKey: "applicationNumber",
                  title: "Application Number",
                },
                {
                  dataKey: "title",
                  title: "Title of the Invention",
                },
                {
                  dataKey: "applicationType",
                  title: "Application Type",
                },
                {
                  dataKey: "applicationDate",
                  title: "Application Date",
                  render: (value: string) =>
                    new Date(value).toLocaleDateString(),
                },
                {
                  dataKey: "description",
                  title: "Description",
                },
                {
                  dataKey: "applicationNumber",
                  title: "Application Status",
                  render: (value: string) => {
                    // Find the application by applicationNumber to get statusId
                    const application = applications.find(
                      (app) => app.applicationNumber === value
                    );
                    const statusId = application?.applicationStatusId;

                    // Use statusId to get correct status name and color
                    if (statusId) {
                      const statusName = getStatusName(
                        statusId as ApplicationStatusId
                      );
                      const colorClasses = getStatusColor(statusId.toString());
                      return (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClasses}`}
                        >
                          {statusName}
                        </span>
                      );
                    }

                    // Fallback to original status if no statusId
                    const status = application?.applicationStatus || "";
                    return (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    );
                  },
                },
                {
                  dataKey: "applicationNumber",
                  title: "Action",
                  render: (value: string) => {
                    // Find the application by applicationNumber to get status and statusId
                    const application = applications.find(
                      (app) => app.applicationNumber === value
                    );
                    const status = application?.applicationStatus || "";
                    const statusId = application?.applicationStatusId;
                    return getActionButtons(
                      status,
                      value,
                      handleAction,
                      statusId
                    );
                  },
                },
              ]}
              data={applications}
              loading={isLoading}
              hideTotalRecords
              reflectDataChanges
              pagination={{ rowsPerPage: 10, position: "right" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentApplicationDashboard;
