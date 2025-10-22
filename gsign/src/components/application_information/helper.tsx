import React from "react";
import { ApplicationStatusId } from "@/libs/constants";
import {
  CancelButton,
  ApplicationFormButton,
  MakePaymentButton,
  ApplicationSummaryButton,
  ContinueApplicationButton,
  GenerateDocumentButton,
  ViewFeedbackButton,
} from "./CommonButtons";

export const getStatusColor = (status: string) => {
  // For backward compatibility, keep the old string-based approach
  // but also support the new statusId-based approach
  switch (status) {
    case "Completed":
      return "text-green-700 bg-green-50";
    case "Pending Payment":
      return "text-orange-700 bg-orange-50";
    case "Incomplete":
      return "text-gray-700 bg-gray-50";
    case "Patent Granted":
      return "text-purple-700 bg-purple-50";
    case "Under Review":
      return "text-purple-700 bg-purple-50";
    case "Awaiting Reply":
      return "text-yellow-700 bg-yellow-50";
    case "Rejected":
      return "text-red-700 bg-red-50";
    case "Cancelled":
      return "text-red-700 bg-red-50";
    case "System Cancelled":
      return "text-red-700 bg-red-50";
    default:
      return "text-gray-700 bg-gray-50";
  }
};

// New function for statusId-based approach
export const getStatusColorById = (statusId: ApplicationStatusId) => {
  return getStatusColor(statusId.toString());
};

export const getActionButtons = (
  status: string,
  applicationNumber: string = "",
  onAction?: (action: string, applicationNumber: string) => void,
  statusId?: number
) => {
  // Check if status is valid
  if (!status || status === "undefined" || !statusId) {
    return null;
  }

  // Common props for all buttons
  const commonProps = {
    onAction: onAction || (() => {}),
    applicationNumber,
  };

  // Use statusId directly for switch cases
  switch (statusId) {
    case 1: // Completed
      return (
        <div className="flex flex-col space-y-2">
          <CancelButton {...commonProps} />
          <ApplicationFormButton {...commonProps} />
        </div>
      );
    case 2: // Pending Payment
      return (
        <div className="flex flex-col space-y-2">
          <MakePaymentButton {...commonProps} />
          <ApplicationSummaryButton {...commonProps} />
        </div>
      );
    case 3: // Incomplete
      return (
        <div className="flex flex-col space-y-2">
          <CancelButton {...commonProps} />
          <ContinueApplicationButton {...commonProps} />
        </div>
      );
    case 4: // Patent Granted
      return (
        <div className="flex flex-col space-y-2">
          <ApplicationFormButton {...commonProps} />
          <GenerateDocumentButton {...commonProps} />
        </div>
      );
    case 5: // Under Review
      return (
        <div className="flex flex-col space-y-2">
          <CancelButton {...commonProps} />
          <ApplicationFormButton {...commonProps} />
        </div>
      );
    case 6: // Rejected
      return (
        <div className="flex flex-col space-y-2">
          <ApplicationFormButton {...commonProps} />
          <GenerateDocumentButton {...commonProps} />
        </div>
      );
    case 7: // Cancelled
      return (
        <div className="flex flex-col space-y-2">
          <ApplicationFormButton {...commonProps} />
        </div>
      );
    case 8: // Awaiting Reply
      return (
        <div className="flex flex-col space-y-2">
          <CancelButton {...commonProps} />
          <ViewFeedbackButton {...commonProps} />
        </div>
      );
    case 9: // System Cancelled
      return (
        <div className="flex flex-col space-y-2">
          <ApplicationFormButton {...commonProps} />
        </div>
      );
    default:
      return (
        <div className="flex flex-col space-y-2">
          <ApplicationFormButton {...commonProps} />
        </div>
      );
  }
};
