import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { CommonFormData } from "@/types/CommonTypes";
import { Button } from "@edk/ui-react";
import { MIME_TYPES } from "@/libs/fileUtil";
import { getApiUrl } from "@/libs/apiUtils";
import FileUpload from "@/components/common/FileUpload";
import ApplicationNumber from "@/components/common/ApplicationNumber";
import LikelihoodRateDisplay from "@/components/common/LikelihoodRateDisplay";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useDocumentMetadatas } from "@/hooks/useDocumentMetadatas";
import { useStep3 } from "@/hooks/useApplicationSteps";

// Document type ID constants (ekran görüntüsünden)
const DOCUMENT_TYPE_IDS = {
  CLAIMS: 1,
  ABSTRACT_OF_THE_DISCLOSURE: 2,
  DRAWINGS: 3,
  SUPPORTING_DOCUMENTS: 4,
} as const;

// ApplicationDocument interface (backend ile uyumlu)
interface ApplicationDocument {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileContent: string; // Base64 encoded
  fileExtension: string;
  applicationDocumentTypeId: number;
}

type Step3FormData = {
  // Backend DTO'ya uygun alanlar
  claims: File[];
  abstractOfTheDisclosures: File[];
  drawings: File[];
  supportingDocuments: File[];
  likelihood: number;
};

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File; // File object'i ekle
}

const Step3 = forwardRef<
  { trigger: () => Promise<boolean> },
  CommonFormData & { applicationNo?: string | null }
>(({ formData, handleChange, onLikelihoodChecked, applicationNo }, ref) => {
  const { updateApplicationStage3 } = useStep3();
  const {
    fetchDocumentMetadatas,
    loading: documentsLoading,
    error: documentsError,
  } = useDocumentMetadatas();
  const [likelihoodRate, setLikelihoodRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [documentsLoaded, setDocumentsLoaded] = useState(false);

  // Initialize loading state based on applicationNo
  useEffect(() => {
    if (!applicationNo) {
      // If no applicationNo, no need to load documents
      setIsInitialLoading(false);
      setDocumentsLoaded(true);
    }
  }, [applicationNo]);

  // Dosyayı base64'e çeviren yardımcı fonksiyon
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file || !(file instanceof File)) {
        reject(new Error("Invalid file object provided"));
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // "data:application/pdf;base64," prefix'ini kaldır
        const base64Content = base64.split(",")[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const [uploadedFiles, setUploadedFiles] = useState<{
    claims: UploadedFile[];
    abstractOfTheDisclosures: UploadedFile[];
    drawings: UploadedFile[];
    supportingDocuments: UploadedFile[];
  }>({
    claims: [],
    abstractOfTheDisclosures: [],
    drawings: [],
    supportingDocuments: [],
  });

  // Use ref to track uploadedFiles state
  const uploadedFilesRef = useRef(uploadedFiles);
  uploadedFilesRef.current = uploadedFiles;

  // Use ref to track likelihoodRate state
  const likelihoodRateRef = useRef(likelihoodRate);
  likelihoodRateRef.current = likelihoodRate;

  const {
    control,
    formState: { errors },
    setValue,
  } = useForm<Step3FormData>({
    defaultValues: {
      claims: [],
      abstractOfTheDisclosures: [],
      drawings: [],
      supportingDocuments: [],
      likelihood: 0,
    },
  });

  // Load existing data when component mounts
  useEffect(() => {
    // Load uploaded files from formData
    if (formData.uploadedFiles) {
      const files = formData.uploadedFiles as Record<string, UploadedFile[]>;
      if (files.claims) {
        setUploadedFiles((prev) => ({ ...prev, claims: files.claims }));
      }
      if (files.abstractOfTheDisclosures) {
        setUploadedFiles((prev) => ({
          ...prev,
          abstractOfTheDisclosures: files.abstractOfTheDisclosures,
        }));
      }
      if (files.drawings) {
        setUploadedFiles((prev) => ({ ...prev, drawings: files.drawings }));
      }
      if (files.supportingDocuments) {
        setUploadedFiles((prev) => ({
          ...prev,
          supportingDocuments: files.supportingDocuments,
        }));
      }
    }

    // Load likelihood rate from formData
    if (formData.likelihoodRate) {
      setLikelihoodRate(formData.likelihoodRate as number);
      onLikelihoodChecked?.(true);
    }

    // Load API response from formData
  }, [formData, onLikelihoodChecked]);

  // FormData değiştiğinde form değerlerini güncelle
  useEffect(() => {
    if (formData) {
      setValue("likelihood", (formData.likelihood as number) || 0);

      // Likelihood rate'i de güncelle
      if (formData.likelihoodRate) {
        setLikelihoodRate(formData.likelihoodRate as number);
      }
    }
  }, [formData, setValue]);

  // Backend'den gelen dosyayı frontend'e download et, File objesi oluştur ve cache'e yükle
  const downloadAndCreateFile = useCallback(
    async (
      doc: Record<string, unknown>,
      fileId: string
    ): Promise<
      { file: File; uploadedPath?: string; fileId: string } | undefined
    > => {
      if (!doc.fileContent) return undefined;

      try {
        // Base64 string'i temizle (whitespace, newline, vb. kaldır)
        const cleanedBase64 = String(doc.fileContent).replace(/\s/g, "");

        // Base64 string'in geçerli olup olmadığını kontrol et
        if (!cleanedBase64 || cleanedBase64.length === 0) {
          return undefined;
        }

        // Base64 string'i binary data'ya çevir
        const byteCharacters = atob(cleanedBase64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        // Blob oluştur
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // File objesi oluştur
        const file = new File([blob], String(doc.fileName) || "Unknown File", {
          type: "application/pdf",
        });

        // Dosyayı cache klasörüne yükle
        try {
          const formData = new FormData();
          formData.append(fileId, file);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            return {
              file,
              uploadedPath: uploadResult.files?.[0]?.path,
              fileId,
            };
          } else {
            return { file, fileId }; // File objesi var ama cache'e yüklenemedi
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (uploadError) {
          return { file, fileId }; // File objesi var ama cache'e yüklenemedi
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return undefined;
      }
    },
    []
  );

  // Function to load existing documents from backend
  const loadExistingDocuments = useCallback(
    async (appNo: string) => {
      try {
        const documents = await fetchDocumentMetadatas(appNo);
        if (documents && documents.length > 0) {
          // Group documents by type and convert to UploadedFile format
          const groupedDocuments: {
            claims: UploadedFile[];
            abstractOfTheDisclosures: UploadedFile[];
            drawings: UploadedFile[];
            supportingDocuments: UploadedFile[];
          } = {
            claims: [],
            abstractOfTheDisclosures: [],
            drawings: [],
            supportingDocuments: [],
          };

          documents.forEach((doc) => {
            // applicationDocumentId null/undefined olabiliyor, fallback olarak index kullan
            const fileId =
              doc.applicationDocumentId?.toString() ||
              `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            const uploadedFile: UploadedFile = {
              id: fileId,
              name: doc.fileName || "Unknown File",
              size: 0, // Backend'den size gelmiyor, File objesi oluşturulduktan sonra hesaplanacak
              type: doc.fileContent ? "application/pdf" : "unknown",
              url: undefined,
              file: undefined, // Async olarak oluşturulacak
            };

            // Document type ID'ye göre grupla
            switch (doc.applicationDocumentTypeId) {
              case DOCUMENT_TYPE_IDS.CLAIMS:
                groupedDocuments.claims.push(uploadedFile);
                break;
              case DOCUMENT_TYPE_IDS.ABSTRACT_OF_THE_DISCLOSURE:
                groupedDocuments.abstractOfTheDisclosures.push(uploadedFile);
                break;
              case DOCUMENT_TYPE_IDS.DRAWINGS:
                groupedDocuments.drawings.push(uploadedFile);
                break;
              case DOCUMENT_TYPE_IDS.SUPPORTING_DOCUMENTS:
                groupedDocuments.supportingDocuments.push(uploadedFile);
                break;
            }
          });

          // Async olarak File objelerini oluştur ve size'ları hesapla
          const processedDocuments = { ...groupedDocuments };

          // Her document type için File objelerini oluştur
          for (const [docType, docs] of Object.entries(groupedDocuments)) {
            if (docs.length > 0) {
              const processedDocs = await Promise.all(
                docs.map(async (doc: UploadedFile) => {
                  try {
                    // Backend'den gelen document'ı bul
                    const backendDoc = documents.find(
                      (d) => d.applicationDocumentId?.toString() === doc.id
                    );
                    if (backendDoc && backendDoc.fileContent) {
                      // File objesi oluştur ve cache'e yükle
                      const fileResult = await downloadAndCreateFile(
                        backendDoc as unknown as Record<string, unknown>,
                        doc.id
                      );
                      if (fileResult) {
                        return {
                          ...doc,
                          file: fileResult.file,
                          size: fileResult.file.size, // Gerçek dosya boyutu
                          url: `/api/upload/download/${fileResult.fileId}`, // Cache'den download URL'i
                        };
                      }
                    }
                    return doc;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  } catch (error) {
                    return doc;
                  }
                })
              );

              processedDocuments[docType as keyof typeof groupedDocuments] =
                processedDocs;
            }
          }

          // Uploaded files state'ini güncelle
          setUploadedFiles(processedDocuments);

          // Form data'ya da kaydet (handleChange otomatik olarak session storage'a kaydediyor)
          handleChange("uploadedFiles", processedDocuments);
        }

        // Mark documents as loaded
        setDocumentsLoaded(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Even if there's an error, mark as loaded to stop loading state
        setDocumentsLoaded(true);
      }
    },
    [fetchDocumentMetadatas, handleChange, downloadAndCreateFile]
  );

  // Load document metadatas when applicationNo is available
  useEffect(() => {
    if (applicationNo) {
      loadExistingDocuments(applicationNo);
    }
  }, [applicationNo, loadExistingDocuments]);

  // Handle initial loading state
  useEffect(() => {
    // Stop loading if documents are not being loaded and either:
    // 1. Documents have been loaded, or
    // 2. No application number (so no documents to load)
    if (!documentsLoading && (documentsLoaded || !applicationNo)) {
      setIsInitialLoading(false);
    }
  }, [documentsLoading, documentsLoaded, applicationNo]);

  // Update refs when state changes
  useEffect(() => {
    uploadedFilesRef.current = uploadedFiles;
  }, [uploadedFiles]);

  useEffect(() => {
    likelihoodRateRef.current = likelihoodRate;
  }, [likelihoodRate]);

  useImperativeHandle(ref, () => ({
    trigger: async () => {
      const currentUploadedFiles = uploadedFilesRef.current;
      const currentLikelihoodRate = likelihoodRateRef.current;

      // Form data'yı context'e kaydet
      if (currentUploadedFiles) {
        handleChange("uploadedFiles", currentUploadedFiles);
      }
      if (currentLikelihoodRate !== null) {
        handleChange("likelihoodRate", currentLikelihoodRate);
      }

      // Backend'e gönder
      if (applicationNo) {
        try {
          setIsLoading(true);

          // Dosyaları base64'e çevir ve ApplicationDocument olarak hazırla
          const prepareFileData = async (
            files: UploadedFile[],
            documentTypeId: number
          ) => {
            const fileData: ApplicationDocument[] = [];
            for (const file of files) {
              let base64Content = "";
              try {
                if (file.file && file.file instanceof File) {
                  // File object varsa direkt base64'e çevir
                  base64Content = await convertFileToBase64(file.file);
                } else if (file.url) {
                  // URL varsa fetch edip base64'e çevir
                  const response = await fetch(file.url);
                  const blob = await response.blob();
                  const fileObject = new File([blob], file.name, {
                    type: file.type,
                  });
                  base64Content = await convertFileToBase64(fileObject);
                } else {
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (error) {}

              // Eğer base64Content yoksa bu dosyayı atla
              if (!base64Content) {
                continue;
              }

              // Dosya uzantısını çıkar
              const fileExtension = file.name.split(".").pop() || "";

              fileData.push({
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                fileContent: base64Content,
                fileExtension: fileExtension,
                applicationDocumentTypeId: documentTypeId,
              });
            }
            return fileData;
          };

          // Claims dosyalarını hazırla
          const claimsData = await prepareFileData(
            currentUploadedFiles.claims || [],
            DOCUMENT_TYPE_IDS.CLAIMS
          );

          // Abstract dosyalarını hazırla
          const abstractData = await prepareFileData(
            currentUploadedFiles.abstractOfTheDisclosures || [],
            DOCUMENT_TYPE_IDS.ABSTRACT_OF_THE_DISCLOSURE
          );

          // Drawings dosyalarını hazırla
          const drawingsData = await prepareFileData(
            currentUploadedFiles.drawings || [],
            DOCUMENT_TYPE_IDS.DRAWINGS
          );

          // Supporting documents dosyalarını hazırla
          const supportingData = await prepareFileData(
            currentUploadedFiles.supportingDocuments || [],
            DOCUMENT_TYPE_IDS.SUPPORTING_DOCUMENTS
          );

          // Likelihood değerini 0-100'den 0-1 aralığına çevir
          const likelihoodValue = currentLikelihoodRate
            ? currentLikelihoodRate / 100
            : 0;

          const finalData = {
            applicationNo: applicationNo,
            claims: claimsData,
            abstractOfTheDisclosures: abstractData,
            drawings: drawingsData,
            supportingDocuments: supportingData,
            likelihood: likelihoodValue,
          };

          // Backend API'ye gönder
          const result = await updateApplicationStage3(
            applicationNo,
            finalData
          );

          if (result && result.success) {
            // Step 3 data saved successfully
            return true;
          } else {
            return false;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          return false;
        } finally {
          setIsLoading(false);
        }
      }

      // Check if required files are uploaded
      if (currentUploadedFiles.claims.length === 0) {
        onLikelihoodChecked?.(false);
        return false;
      }

      if (currentUploadedFiles.abstractOfTheDisclosures.length === 0) {
        onLikelihoodChecked?.(false);
        return false;
      }

      if (currentUploadedFiles.drawings.length === 0) {
        onLikelihoodChecked?.(false);
        return false;
      }

      // Check if likelihood has been checked
      if (currentLikelihoodRate === null) {
        onLikelihoodChecked?.(false);
        return false;
      }
      onLikelihoodChecked?.(true);
      return true;
    },
  }));

  const checkLikelihoodRate = async () => {
    setIsLoading(true);
    // Clear any previous messages

    try {
      // Check if abstractOfTheDisclosures file is uploaded
      if (uploadedFiles.abstractOfTheDisclosures.length === 0) {
        onLikelihoodChecked?.(false);
        return;
      }

      // Get the first abstractOfTheDisclosures file
      const abstractFile = uploadedFiles.abstractOfTheDisclosures[0];

      // Create FormData for multipart request
      const formData = new FormData();
      if (abstractFile.file) {
        formData.append("abstractOfTheDisclosures", abstractFile.file);
      }

      const response = await fetch(
        getApiUrl("/applications/check-likelihood"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const likelihood = result.data.likelihood;
        const analysis = result.data.analysis;
        const retrievedDocuments = result.data.retrievedDocuments;
        const processingTime = result.data.processingTimeMs;

        console.log(`Likelihood analysis completed in ${processingTime}ms`);

        setLikelihoodRate(likelihood);
        onLikelihoodChecked?.(true);

        // Save to formData for persistence
        setTimeout(() => {
          handleChange("likelihoodRate", likelihood);
          handleChange("apiResponse", analysis);
          handleChange("retrievedDocuments", retrievedDocuments);
        }, 0);
      } else {
        onLikelihoodChecked?.(false);
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while checking likelihood rate";
      onLikelihoodChecked?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = useCallback(
    (field: keyof typeof uploadedFiles) => (files: UploadedFile[]) => {
      setUploadedFiles((prev) => {
        const updatedFiles = {
          ...prev,
          [field]: files,
        };

        // handleChange çağrısını setTimeout ile async hale getir
        setTimeout(() => {
          handleChange("uploadedFiles", updatedFiles);
          handleChange(field, files);
        }, 0);

        return updatedFiles;
      });
    },
    [handleChange]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleError = (_error: string) => {
    // Error handling - UI will reset to allow retry
    // You can implement a toast notification here if needed
  };

  // Validation functions using useCallback
  const validateClaims = useCallback(() => {
    const totalFiles = uploadedFiles?.claims?.length || 0;
    if (totalFiles === 0) return "At least one claims document is required";
    if (totalFiles > 2) return "Maximum 2 files allowed";
    return true;
  }, [uploadedFiles?.claims?.length]);

  const validateAbstract = useCallback(() => {
    const totalFiles = uploadedFiles?.abstractOfTheDisclosures?.length || 0;
    if (totalFiles === 0) return "Abstract document is required";
    if (totalFiles > 1) return "Maximum 1 file allowed";
    return true;
  }, [uploadedFiles?.abstractOfTheDisclosures?.length]);

  const validateDrawings = useCallback(() => {
    const totalFiles = uploadedFiles?.drawings?.length || 0;
    if (totalFiles === 0) return "At least one drawing is required";
    if (totalFiles > 2) return "Maximum 2 files allowed";
    return true;
  }, [uploadedFiles?.drawings?.length]);

  // Show loading spinner while data is being loaded
  if (isInitialLoading || documentsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" text="Loading documents..." />
      </div>
    );
  }

  return (
    <form className="space-y-6">
      {/* Application Number Display */}
      <ApplicationNumber applicationNo={applicationNo || "17/123,456"} />

      {/* Loading State */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700 text-sm">Loading data...</p>
        </div>
      )}

      {/* Documents Loading State */}
      {documentsLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700 text-sm">Loading existing documents...</p>
        </div>
      )}

      {/* Documents Error State */}
      {documentsError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            Error loading documents: {documentsError}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Claims Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            * Claims (≤2 files)
          </h3>

          <Controller
            name="claims"
            control={control}
            rules={{
              required: "Claims document is required",
              validate: validateClaims,
            }}
            render={({ field }) => (
              <div>
                <FileUpload
                  {...field}
                  maxFiles={2}
                  accept={[MIME_TYPES.PDF]}
                  maxSize={1024 * 1024}
                  messages={{
                    maxFileMessage: "You can upload a maximum of 2 files.",
                    maxSizeMessage: "The maximum size of a file can be 1 MB.",
                    mimeTypeMessage: "Supported File Format: .PDF",
                  }}
                  onUploadSuccess={handleUploadSuccess("claims")}
                  onError={handleError}
                  autoUpload={true}
                  existingUploadedFiles={uploadedFiles.claims}
                />
                {errors.claims && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.claims.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              The claims are the part of the invention for which protection is
              claimed, specifying the technical features that are claimed to be
              novel. In other words, the scope of protection is determined by
              the claims. The technical features to be protected must be written
              in the claims. Features not written in the claims cannot be
              protected.
            </p>
          </div>
        </div>

        {/* Abstract Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            * Abstract of the Disclosure (≤150 words)
          </h3>

          <Controller
            name="abstractOfTheDisclosures"
            control={control}
            rules={{
              required: "Abstract document is required",
              validate: validateAbstract,
            }}
            render={({ field }) => (
              <div>
                <FileUpload
                  {...field}
                  maxFiles={1}
                  accept={[MIME_TYPES.PDF]}
                  maxSize={1024 * 1024}
                  messages={{
                    maxFileMessage: "You can upload a maximum of 1 file.",
                    maxSizeMessage: "The maximum size of a file can be 1 MB.",
                    mimeTypeMessage: "Supported File Format: .PDF",
                  }}
                  onUploadSuccess={handleUploadSuccess(
                    "abstractOfTheDisclosures"
                  )}
                  onError={handleError}
                  autoUpload={true}
                  existingUploadedFiles={uploadedFiles.abstractOfTheDisclosures}
                />
                {errors.abstractOfTheDisclosures && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.abstractOfTheDisclosures.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              The abstract of the disclosure includes a detailed description of
              the invention, the main features of the claims and drawings, if
              any, and also provides a clear understanding of the technical
              problem to which the invention relates by indicating the technical
              field to which the invention relates, the solution of that problem
              by means of the invention, and the main use or uses of the
              invention. (37 CFR § 1.72)
            </p>
          </div>
        </div>

        {/* Drawings Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">* Drawings</h3>

          <Controller
            name="drawings"
            control={control}
            rules={{
              required: "Drawings document is required",
              validate: validateDrawings,
            }}
            render={({ field }) => (
              <div>
                <FileUpload
                  {...field}
                  maxFiles={2}
                  accept={[MIME_TYPES.PDF]}
                  maxSize={1024 * 1024}
                  messages={{
                    maxFileMessage: "You can upload a maximum of 2 files.",
                    maxSizeMessage: "The maximum size of a file can be 1 MB.",
                    mimeTypeMessage: "Supported File Format: .PDF",
                  }}
                  onUploadSuccess={handleUploadSuccess("drawings")}
                  onError={handleError}
                  autoUpload={true}
                  existingUploadedFiles={uploadedFiles.drawings}
                />
                {errors.drawings && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.drawings.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              Drawings are required when necessary to understand the invention.
              The drawings must show every feature of the claims and must be in
              a form that is suitable for reproduction. Drawings must be black
              and white line drawings, unless color drawings are the only
              practicable medium to disclose the subject matter sought to be
              patented.
            </p>
          </div>
        </div>

        {/* Supporting Documents Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Supporting Documents (Optional)
          </h3>

          <Controller
            name="supportingDocuments"
            control={control}
            render={({ field }) => (
              <div>
                <FileUpload
                  {...field}
                  accept={["application/pdf"]}
                  maxFiles={2}
                  maxSize={1024 * 1024} // 1MB
                  messages={{
                    maxFileMessage: "You can upload a maximum of 2 files.",
                    maxSizeMessage: "The maximum size of a file can be 1 MB.",
                    mimeTypeMessage: "Supported File Format: .PDF",
                  }}
                  onUploadSuccess={handleUploadSuccess("supportingDocuments")}
                  onError={handleError}
                  autoUpload={true}
                  existingUploadedFiles={uploadedFiles.supportingDocuments}
                />
              </div>
            )}
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              Supporting documents may include additional technical information,
              research papers, or other relevant materials that support your
              patent application. These documents are optional but can help
              strengthen your application.
            </p>
          </div>
        </div>

        {/* Likelihood Check Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Check Likelihood Rate
            </h3>
            <Button
              label={isLoading ? "Checking..." : "Check Likelihood Rate"}
              variant="primary"
              onClick={checkLikelihoodRate}
              disabled={isLoading}
            />
          </div>

          <LikelihoodRateDisplay rate={likelihoodRate || 0} />
        </div>
      </div>
    </form>
  );
});

Step3.displayName = "Step3";

export default Step3;
