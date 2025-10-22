import { APPLICATION_STATUS, APPLICATION_STATUS_NAMES } from "./constants";

// Types
export interface TransformedApplication {
  applicationNumber: string;
  title: string;
  applicationType: string;
  applicationDate: string;
  description: string;
  applicationStatusId: number;
  applicationStatus: string;
  statusColor: string;
  applicantName: string;
}

export interface StatusStatistics {
  [key: number]: number;
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  granted: number;
}

// Backend application data interface - unified for both allapplications and admin
interface BackendApplication {
  // Primary fields
  applicationNo?: string;
  applicationNumber?: string;
  titleOfInvention?: string;
  title?: string;
  applicationType?: string;
  applicationDate?: string;
  description?: string;
  applicationStatus?: string;
  applicationStatusId?: number;
  applicantName?: string;

  // Legacy field support
  application_number?: string;
  title_of_invention?: string;
  application_date?: string;
  application_status_id?: number;
}

/**
 * Get status color classes based on application status ID
 * @param statusId - Application status ID
 * @returns Tailwind CSS classes for status badge
 */
export const getStatusColor = (statusId: number): string => {
  switch (statusId) {
    case APPLICATION_STATUS.COMPLETED:
      return "bg-green-100 text-green-800";
    case APPLICATION_STATUS.PENDING_PAYMENT:
      return "bg-yellow-100 text-yellow-800";
    case APPLICATION_STATUS.INCOMPLETE:
      return "bg-blue-100 text-blue-800";
    case APPLICATION_STATUS.PATENT_GRANTED:
      return "bg-purple-100 text-purple-800";
    case APPLICATION_STATUS.UNDER_REVIEW:
      return "bg-orange-100 text-orange-800";
    case APPLICATION_STATUS.REJECTED:
      return "bg-red-100 text-red-800";
    case APPLICATION_STATUS.CANCELLED:
      return "bg-gray-100 text-gray-800";
    case APPLICATION_STATUS.AWAITING_REPLY:
      return "bg-orange-100 text-orange-800";
    case APPLICATION_STATUS.SYSTEM_CANCELLED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Get status name based on application status ID
 * @param statusId - Application status ID
 * @returns Human-readable status name
 */
export const getStatusName = (statusId: number): string => {
  return (
    APPLICATION_STATUS_NAMES[
      statusId as keyof typeof APPLICATION_STATUS_NAMES
    ] || "Unknown"
  );
};

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Transform backend application data to frontend format
 * @param applications - Array of backend application data
 * @returns Transformed application data
 */
export const transformBackendApplication = (
  applications: BackendApplication[]
): TransformedApplication[] => {
  return applications.map((app) => ({
    applicationNumber:
      app.applicationNumber ||
      app.applicationNo ||
      app.application_number ||
      "",
    title: app.title || app.titleOfInvention || app.title_of_invention || "",
    applicationType: app.applicationType || "",
    applicationDate: app.applicationDate || app.application_date || "",
    description: app.description || "",
    applicationStatusId:
      app.applicationStatusId || app.application_status_id || 0,
    applicationStatus: getStatusName(
      app.applicationStatusId || app.application_status_id || 0
    ),
    statusColor: getStatusColor(
      app.applicationStatusId || app.application_status_id || 0
    ),
    applicantName: app.applicantName || "",
  }));
};

/**
 * Get status statistics from applications
 * @param applications - Array of application data
 * @returns Object with status counts
 */
export const getStatusStatistics = (
  applications: TransformedApplication[]
): StatusStatistics => {
  const stats: StatusStatistics = {
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    granted: 0,
  };

  applications.forEach((app) => {
    const statusId = app.applicationStatusId;
    stats[statusId] = (stats[statusId] || 0) + 1;
    stats.total += 1;

    // Map specific status IDs to named properties
    if (statusId === APPLICATION_STATUS.COMPLETED) {
      stats.completed += 1;
    } else if (statusId === APPLICATION_STATUS.PENDING_PAYMENT) {
      stats.pending += 1;
    } else if (statusId === APPLICATION_STATUS.UNDER_REVIEW) {
      stats.inProgress += 1;
    } else if (statusId === APPLICATION_STATUS.PATENT_GRANTED) {
      stats.granted += 1;
    }
  });

  return stats;
};
