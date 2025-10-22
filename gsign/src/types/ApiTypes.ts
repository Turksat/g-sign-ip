export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  redirectTo?: string;
}

export interface BackendData {
  [key: string]: unknown;
}

export interface ApiRequestData {
  [key: string]: unknown;
}

export interface SubmitStepResponse {
  success: boolean;
  message: string;
  data?: {
    applicationNo: string;
  };
}

export interface CheckLikelihoodResponse {
  success: boolean;
  likelihoodRate: number;
  message: string;
  details: {
    claimsCount: number;
    abstractCount: number;
    drawingsCount: number;
    supportingDocumentsCount: number;
    uploadedFiles: {
      claims: FileInfo[];
      abstract: FileInfo[];
      drawings: FileInfo[];
      supportingDocuments: FileInfo[];
    };
  };
}

export interface FileInfo {
  id: string;
  name: string;
}

export interface UserApplicationResponseDTO {
  applicationNo: string;
  applicationNumber: string; // Alias for applicationNo
  titleOfInvention: string;
  title: string; // Alias for titleOfInvention
  applicationType: string;
  applicationDate: string; // ISO string format
  description: string;
  applicationStatus: string;
  applicationStatusId: number;
  applicantName: string; // Added for consistency
}

export interface AdminDashboardStatsResponseDTO {
  submissionsStarted: number;
  submissionsAssigned: number;
  submissionsCompleted: number;
  month: string;
  monthName: string;
}

export interface FeedbackCategoryResponseDTO {
  id: number;
  feedbackCategoryDescription: string;
}
