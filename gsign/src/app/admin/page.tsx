"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Table } from "@edk/ui-react";
import {
  useApplicationFilter,
  ApplicationFilterRequest,
  FilteredApplication,
} from "@/hooks/useApplicationFilter";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";
import { APPLICATION_STATUS } from "@/libs/constants";
import { getStatusColor, getStatusName, formatDate } from "@/libs/statusUtils";

const AdminDashboard = () => {
  const router = useRouter();
  const { filterApplications, loading } = useApplicationFilter();
  const [applications, setApplications] = useState<FilteredApplication[]>([]);
  const [filterData, setFilterData] = useState<ApplicationFilterRequest>({
    applicationStatus: APPLICATION_STATUS.UNDER_REVIEW,
  });
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useAdminDashboardStats();

  // Load initial data
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async (filterRequest?: ApplicationFilterRequest) => {
    const request = filterRequest || filterData;
    const result = await filterApplications(request);

    if (result) {
      setApplications(result.applications);
    }
  };

  const handleFilterChange = (
    field: keyof ApplicationFilterRequest,
    value: string | number
  ) => {
    setFilterData((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleFilter = async () => {
    await loadApplications(filterData);
  };

  const handleResetFilter = async () => {
    const resetData: ApplicationFilterRequest = {
      applicationStatus: APPLICATION_STATUS.UNDER_REVIEW,
    };
    setFilterData(resetData);
    await loadApplications(resetData);
  };

  const tableColumns = [
    {
      dataKey: "applicationNumber",
      title: "Application Number",
    },
    {
      dataKey: "applicantName",
      title: "Applicant",
    },
    {
      dataKey: "title",
      title: "Title",
    },
    {
      dataKey: "applicationDate",
      title: "Application Date",
      render: (data: string) => formatDate(data),
    },
    {
      dataKey: "applicationStatusId",
      title: "Application Status",
      render: (data: number) => {
        // data burada sadece applicationStatusId değeri, tüm row objesi değil
        const statusId = data;

        return (
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              statusId
            )}`}
          >
            {getStatusName(statusId)}
          </span>
        );
      },
    },
    {
      dataKey: "applicationNumber",
      title: "Action",
      render: (data: string) => (
        <Button
          label="Review Application"
          variant="primary"
          size="sm"
          onClick={() => {
            // Güvenli routing - Next.js router kullanarak Open Redirect saldırılarını önle
            router.push(`/admin/review/${data}`);
          }}
        />
      ),
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Patent Applications Management Panel
        </h1>
        <p className="text-gray-600 mt-1">
          Manage and review patent applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Submissions Started
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {statsLoading ? (
                  <span className="animate-pulse">...</span>
                ) : statsError ? (
                  <span className="text-red-500">Error</span>
                ) : (
                  stats?.submissionsStarted || 0
                )}
              </p>
              {stats?.monthName && (
                <p className="text-xs text-gray-400 mt-1">{stats.monthName}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Submissions Assigned
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {statsLoading ? (
                  <span className="animate-pulse">...</span>
                ) : statsError ? (
                  <span className="text-red-500">Error</span>
                ) : (
                  stats?.submissionsAssigned || 0
                )}
              </p>
              {stats?.monthName && (
                <p className="text-xs text-gray-400 mt-1">{stats.monthName}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Submissions Completed
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {statsLoading ? (
                  <span className="animate-pulse">...</span>
                ) : statsError ? (
                  <span className="text-red-500">Error</span>
                ) : (
                  stats?.submissionsCompleted || 0
                )}
              </p>
              {stats?.monthName && (
                <p className="text-xs text-gray-400 mt-1">{stats.monthName}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Filter Applications
        </h2>
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Application Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={
                filterData.applicationStatus || APPLICATION_STATUS.UNDER_REVIEW
              }
              onChange={(e) =>
                handleFilterChange(
                  "applicationStatus",
                  parseInt(e.target.value)
                )
              }
            >
              <option value={APPLICATION_STATUS.UNDER_REVIEW}>
                Under Review
              </option>
              <option value={APPLICATION_STATUS.PENDING_PAYMENT}>
                Pending Payment
              </option>
              <option value={APPLICATION_STATUS.INCOMPLETE}>Incomplete</option>
              <option value={APPLICATION_STATUS.COMPLETED}>Completed</option>
              <option value={APPLICATION_STATUS.PATENT_GRANTED}>
                Patent Granted
              </option>
              <option value={APPLICATION_STATUS.REJECTED}>Rejected</option>
              <option value={APPLICATION_STATUS.CANCELLED}>Cancelled</option>
              <option value={APPLICATION_STATUS.AWAITING_REPLY}>
                Awaiting Reply
              </option>
              <option value={APPLICATION_STATUS.SYSTEM_CANCELLED}>
                System Cancelled
              </option>
            </select>
          </div>

          {/* Applicant / Inventor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applicant
            </label>
            <input
              type="text"
              placeholder="Enter applicant name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterData.applicantName || ""}
              onChange={(e) =>
                handleFilterChange("applicantName", e.target.value)
              }
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Application Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Number
            </label>
            <input
              type="text"
              placeholder="Enter application number..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterData.applicationNumber || ""}
              onChange={(e) =>
                handleFilterChange("applicationNumber", e.target.value)
              }
            />
          </div>

          {/* Application Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Date
            </label>
            <div className="space-y-2">
              <div>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterData.startDate || ""}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                />
              </div>
              <div>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterData.endDate || ""}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter a date using the &apos;Select Date&apos; feature or in the
                format DD/MM/YYYY.
              </p>
            </div>
          </div>
        </div>

        {/* Third Row - Filter Buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            label="Reset Filter"
            variant="secondary"
            onClick={handleResetFilter}
            disabled={loading}
          />
          <Button
            label="Filter"
            variant="primary"
            onClick={handleFilter}
            disabled={loading}
          />
        </div>
      </div>

      {/* Last Applications Submitted Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Last Applications Submitted
            </h2>
            <div className="text-sm text-gray-600">
              {applications.length} record found
            </div>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={tableColumns}
            data={applications}
            loading={loading}
            reflectDataChanges
            pagination={{ rowsPerPage: 20, position: "right" }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
