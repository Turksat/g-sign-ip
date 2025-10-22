export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
  path?: string;
}

export interface FileInfo {
  id: string;
  name: string;
}

export interface FileData {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileContent: string; // Base64 encoded
  fileExtension: string;
  applicationDocumentTypeId: number;
}

export interface FileUploadResult {
  success: boolean;
  message: string;
  files?: UploadedFile[];
}

export interface FileDownloadResponse {
  success: boolean;
  message: string;
  deletedFiles?: string[];
}
