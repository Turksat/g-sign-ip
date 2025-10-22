import React from "react";
import {
  getActionButtons,
  getStatusColor,
} from "@/components/application_information/helper";
import { getStatusName, type TransformedApplication } from "@/libs/statusUtils";
import { Table } from "@edk/ui-react";
import { ApplicationStatusId } from "@/libs/constants";

interface TableProps {
  applications: TransformedApplication[];
  onAction?: (action: string, applicationNumber: string) => void;
  loading?: boolean;
}

const TableComponent: React.FC<TableProps> = ({
  applications,
  onAction,
  loading = false,
}) => {
  const columns = [
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
      render: (value: string) => new Date(value).toLocaleDateString(),
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
          const statusName = getStatusName(statusId as ApplicationStatusId);
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
        return getActionButtons(status, value, onAction, statusId);
      },
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg">
      <Table
        hideTotalRecords
        columns={columns}
        data={applications}
        loading={loading}
      />
    </div>
  );
};

export default TableComponent;
