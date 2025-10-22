import React, { useState, useRef, useEffect } from "react";
import { Button } from "@edk/ui-react";

interface FileUploadProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string[];
  value?: File[];
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
  onUploadSuccess?: (uploadedFiles: UploadedFile[]) => void;
  messages?: {
    maxFileMessage?: string;
    maxSizeMessage?: string;
    mimeTypeMessage?: string;
  };
  disabled?: boolean;
  autoUpload?: boolean;
  existingUploadedFiles?: UploadedFile[]; // New prop for existing files
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File; // Original file object'i sakla
}

const FileUpload: React.FC<FileUploadProps> = ({
  maxFiles = 2,
  maxSize = 1024 * 1024, // 1MB default
  accept = ["application/pdf"],
  value = [],
  onChange,
  onError,
  onUploadSuccess,
  messages = {},
  disabled = false,
  autoUpload = true,
  existingUploadedFiles = [],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    existingUploadedFiles
  );
  const [failedFiles, setFailedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with existing uploaded files
  useEffect(() => {
    if (existingUploadedFiles && existingUploadedFiles.length > 0) {
      setUploadedFiles(existingUploadedFiles);
      // Don't call onUploadSuccess here as it causes duplicate issues
      // The parent component should handle existing files separately
    }
  }, [existingUploadedFiles]);

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    try {
      const formData = new FormData();
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      formData.append(fileId, file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload failed");
      }

      // Find the uploaded file in the response
      const uploadedFile = result.files?.find(
        (f: Record<string, unknown>) => f.id === fileId
      );
      if (!uploadedFile) {
        throw new Error("Upload response does not contain file information");
      }

      return {
        id: uploadedFile.id,
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        file: file, // Original file object'i sakla
      };
    } catch (error) {
      throw error;
    }
  };

  const deleteFile = async (fileId: string): Promise<void> => {
    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        body: fileId,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check file count
    const totalFiles = uploadedFiles.length + value.length + fileArray.length;
    if (totalFiles > maxFiles) {
      errors.push(
        messages.maxFileMessage || `Maximum ${maxFiles} files allowed.`
      );
    }

    fileArray.forEach((file) => {
      // Check if file already exists in uploaded files
      const existingFile = uploadedFiles.find(
        (uf) => uf.name === file.name && uf.size === file.size
      );
      if (existingFile) {
        errors.push(`File "${file.name}" is already uploaded.`);
        return;
      }

      // Check if file already exists in current value
      const existingValueFile = value.find(
        (vf) => vf.name === file.name && vf.size === file.size
      );
      if (existingValueFile) {
        errors.push(`File "${file.name}" is already selected.`);
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        errors.push(
          messages.maxSizeMessage ||
            `File ${file.name} is too large. Maximum size is ${Math.round(
              maxSize / 1024 / 1024
            )}MB.`
        );
        return;
      }

      // Check file type
      if (accept.length > 0 && !accept.includes(file.type)) {
        errors.push(
          messages.mimeTypeMessage ||
            `File ${file.name} is not a supported format.`
        );
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      errors.forEach((error) => onError?.(error));
      return;
    }

    if (validFiles.length > 0) {
      // Only add to value if autoUpload is disabled
      if (!autoUpload) {
        const newFiles = [...value, ...validFiles];
        onChange?.(newFiles);
      } else {
        // If autoUpload is enabled, directly upload the files
        await handleUpload(validFiles);
      }
    }
  };

  const handleUpload = async (files: File[]) => {
    const newUploadingFiles = new Set(uploadingFiles);
    const newUploadedFiles: UploadedFile[] = [];
    const newFailedFiles: File[] = [];

    for (const file of files) {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      newUploadingFiles.add(fileId);

      try {
        setUploadingFiles(newUploadingFiles);
        const uploadedFile = await uploadFile(file);
        if (uploadedFile) {
          newUploadedFiles.push(uploadedFile);
        }
      } catch (error) {
        // Ensure uploading state is cleared even on error
        newUploadingFiles.delete(fileId);
        setUploadingFiles(newUploadingFiles);

        // Add failed file to retry list
        newFailedFiles.push(file);

        onError?.(
          `Failed to upload ${file.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        // Make sure to clean up uploading state
        if (newUploadingFiles.has(fileId)) {
          newUploadingFiles.delete(fileId);
          setUploadingFiles(newUploadingFiles);
        }
      }
    }

    // Update failed files state
    if (newFailedFiles.length > 0) {
      setFailedFiles((prev) => [...prev, ...newFailedFiles]);
    }

    if (newUploadedFiles.length > 0) {
      const allUploadedFiles = [...uploadedFiles, ...newUploadedFiles];
      setUploadedFiles(allUploadedFiles);
      // Send all uploaded files to the callback
      onUploadSuccess?.(allUploadedFiles);
    }
  };

  const handleRemoveFile = async (
    index: number,
    type: "uploaded" | "value" = "value"
  ) => {
    if (type === "uploaded") {
      const file = uploadedFiles[index];
      if (file) {
        try {
          // Eğer File objesi varsa, backend'den silme işlemi yap
          if (file.file) {
            await deleteFile(file.id);
          }
          const newUploadedFiles = uploadedFiles.filter((_, i) => i !== index);
          setUploadedFiles(newUploadedFiles);
          // Send all uploaded files to the callback
          onUploadSuccess?.(newUploadedFiles);
        } catch (error) {
          onError?.(
            `Failed to delete ${file.name}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }
    } else {
      const file = value[index];
      if (file) {
        const newFiles = value.filter((_, i) => i !== index);
        onChange?.(newFiles);

        // Remove from uploaded files if exists
        const uploadedFile = uploadedFiles.find((uf) => uf.name === file.name);
        if (uploadedFile) {
          try {
            await deleteFile(uploadedFile.id);
            const newUploadedFiles = uploadedFiles.filter(
              (uf) => uf.id !== uploadedFile.id
            );
            setUploadedFiles(newUploadedFiles);
            // Send all uploaded files to the callback
            onUploadSuccess?.(newUploadedFiles);
          } catch (error) {
            onError?.(
              `Failed to delete ${file.name}: ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            );
          }
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const retryFailedUploads = async () => {
    if (failedFiles.length > 0) {
      setFailedFiles([]); // Clear failed files
      await handleUpload(failedFiles);
    }
  };

  const removeFailedFile = (index: number) => {
    setFailedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isUploading = uploadingFiles.size > 0;

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={accept.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${
          disabled || isUploading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!disabled && !isUploading ? openFileDialog : undefined}
      >
        <div className="space-y-4">
          <div className="text-gray-400">
            <svg
              className="mx-auto h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="text-gray-600">
            <Button
              label={isUploading ? "Uploading..." : "Add File"}
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
              disabled={disabled || isUploading}
            />
            <p className="mt-2 text-sm">
              {isUploading
                ? "Please wait while files are being uploaded..."
                : "Or drag it into the box."}
            </p>
          </div>

          {/* File limits info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              {messages.maxFileMessage ||
                `You can upload a maximum of ${maxFiles} file${
                  maxFiles > 1 ? "s" : ""
                }.`}
            </p>
            <p>
              {messages.maxSizeMessage ||
                `The maximum size of a file can be ${Math.round(
                  maxSize / 1024 / 1024
                )} MB.`}
            </p>
            <p>
              {messages.mimeTypeMessage ||
                `Supported File Format: ${accept
                  .map((type) => type.split("/")[1]?.toUpperCase())
                  .join(", ")}`}
            </p>
          </div>
        </div>
      </div>

      {/* File list */}
      {(value.length > 0 ||
        uploadedFiles.length > 0 ||
        failedFiles.length > 0) && (
        <div className="mt-4 space-y-2">
          {/* Display uploaded files */}
          {uploadedFiles.map((file, index) => {
            const isFileUploading = Array.from(uploadingFiles).some(
              (id) => id === file.id
            );

            return (
              <div
                key={file.id || `file-${index}-${file.name}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.size > 0
                        ? (file.size / 1024 / 1024).toFixed(2)
                        : "0"}{" "}
                      MB
                      {isFileUploading && " (Uploading...)"}
                    </p>
                  </div>
                </div>
                <Button
                  label="Remove"
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveFile(index, "uploaded")}
                  disabled={isFileUploading}
                />
              </div>
            );
          })}

          {/* Display selected files */}
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}-${file.size}`}
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="text-blue-400">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.size > 0 ? (file.size / 1024 / 1024).toFixed(2) : "0"}{" "}
                    MB
                  </p>
                </div>
              </div>
              <Button
                label="Remove"
                variant="danger"
                size="sm"
                onClick={() => handleRemoveFile(index, "value")}
              />
            </div>
          ))}

          {/* Display failed files with retry options */}
          {failedFiles.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-red-800">
                  Upload Failed ({failedFiles.length} file
                  {failedFiles.length > 1 ? "s" : ""})
                </h4>
                <Button
                  label="Retry All"
                  variant="primary"
                  size="sm"
                  onClick={retryFailedUploads}
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                {failedFiles.map((file, index) => (
                  <div
                    key={`failed-${file.name}-${index}`}
                    className="flex items-center justify-between p-2 bg-red-100 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-red-400">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-red-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB - Upload
                          failed
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        label="Retry"
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          const singleFile = [file];
                          setFailedFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                          handleUpload(singleFile);
                        }}
                        disabled={isUploading}
                      />
                      <Button
                        label="Remove"
                        variant="danger"
                        size="sm"
                        onClick={() => removeFailedFile(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
