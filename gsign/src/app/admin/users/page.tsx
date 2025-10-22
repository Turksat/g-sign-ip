"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Table } from "@edk/ui-react";
import { useUsers } from "@/hooks/useUsers";
import { useApi } from "@/hooks/useApi";
import { USER_ROLES } from "@/types/User";

const GetAllUsers: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useApi();
  const [isClient, setIsClient] = useState(false);
  const { users, isLoading, error, refetch } = useUsers();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getRoleName = (roleId: number) => {
    return USER_ROLES.find((r) => r.id === roleId)?.name || "Unknown";
  };

  const handleEditUser = (userId: number) => {
    router.push(`/admin/users/${userId}`);
  };

  // Authentication check
  if (!isClient) {
    return (
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated()) {
    router.push("/login");
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading users..." />
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
            Error Loading Users
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
              <p className="text-gray-600">Manage registered system users</p>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">User List</h2>
            <p className="text-blue-100 text-sm mt-1">All registered users</p>
          </div>

          <div className="p-6">
            <Table
              columns={[
                {
                  dataKey: "userId",
                  title: "ID",
                },
                {
                  dataKey: "firstName",
                  title: "First Name",
                },
                {
                  dataKey: "middleName",
                  title: "Middle Name",
                  render: (value: string) => value || "-",
                },
                {
                  dataKey: "lastName",
                  title: "Last Name",
                },
                {
                  dataKey: "email",
                  title: "Email",
                  render: (value: string) => (
                    <span className="font-medium">{value}</span>
                  ),
                },
                {
                  dataKey: "phoneNumber",
                  title: "Phone Number",
                },
                {
                  dataKey: "userRoleId",
                  title: "Role",
                  render: (value: number) => {
                    const roleName = getRoleName(value);
                    const getRoleColor = (roleId: number) => {
                      switch (roleId) {
                        case 1: // USER
                          return "text-blue-700 bg-blue-50";
                        case 2: // ADMIN
                          return "text-red-700 bg-red-50";
                        default:
                          return "text-gray-700 bg-gray-50";
                      }
                    };
                    return (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                          value
                        )}`}
                      >
                        {roleName}
                      </span>
                    );
                  },
                },
                {
                  dataKey: "userId",
                  title: "Actions",
                  render: (value: number) => (
                    <button
                      onClick={() => handleEditUser(value)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Edit
                    </button>
                  ),
                },
              ]}
              data={users}
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

export default GetAllUsers;
