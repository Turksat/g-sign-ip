// Data Transformation Utility Functions
// Backend DTO'lara uygun data dönüşümleri

export interface BackendData {
  [key: string]: unknown;
}

// Application Summary to Form Data transformation
export const transformApplicationSummaryToFormData = (
  summary: Record<string, unknown>
): Record<string, unknown> => {
  return {
    // Step 1 - Applicant/Inventor Information
    applicantEntitlementRate: summary.applicantEntitlementRate
      ? (Number(summary.applicantEntitlementRate) * 100).toString()
      : "",
    nationalityNo: summary.nationalityNo?.toString() || "",
    nationalIdNo: summary.nationalIdNo || "",
    prefix: summary.prefix || "",
    suffix: summary.suffix || "",
    birthDate: summary.birthDate
      ? new Date(summary.birthDate as string | number | Date)
      : null,
    genderId: summary.genderId?.toString() || "",
    residencyTypeId: summary.residencyTypeId?.toString() || "",
    stateId: summary.stateId?.toString() || "",
    city: summary.city || "",
    countryId: summary.countryOfResidenceId?.toString() || "", // countryOfResidenceId kullan
    ciCountryId: summary.ciCountryId?.toString() || "",
    ciStreetAddressOne: summary.ciStreetAddressOne || "",
    ciStreetAddressTwo: summary.ciStreetAddressTwo || "",
    ciCity: summary.ciCity || "",
    ciPostalCode: summary.ciPostalCode || "",
    isAnonymous: summary.anonymous || false,

    // Step 2 - Application Type and Classification
    applicationTypeId: summary.applicationTypeId?.toString() || "",
    titleOfInvention: summary.titleOfInvention || "",
    inventionSummary: summary.inventionSummary || "",
    patentClassificationId: summary.classificationIds || [],
    geographicalOrigin: summary.geographicalOrigin || false,
    governmentFunded: summary.governmentFunded || false,

    // Step 4 - First Inventor to File
    firstInventorToFile: summary.aia || false,

    // Step 5 - Authorization (backend'den gelen değerler)
    refuseApplicationFileAccess: summary.authorizedToPdx,
    refuseSearchResultsAccess: summary.authorizedToEpo,

    // Step 3 - Likelihood (backend'den gelen değer - decimal'den yüzdelik'e çevir)
    likelihoodRate: summary.likelihood ? Number(summary.likelihood) * 100 : 0, // Step3'te kullanılan alan adı

    // User info for display (direct from summary)
    firstName: summary.firstName || "",
    middleName: summary.middleName || "",
    lastName: summary.lastName || "",
    email: summary.email || "",
    countryCode: summary.countryCode || "",
    phoneNumber: summary.phoneNumber || "",

    // Payment Information
    paymentAmount: summary.paymentAmount || null,
    paymentDate: summary.paymentDate || null,
    paymentCurrency: summary.paymentCurrency || null,
    paymentStatus: summary.paymentStatus || null,

    // Signature Information
    signature: summary.signature || "",

    // API response for success message
    apiResponse: "Application data loaded successfully",
  };
};

// Step1: ApplicationCreateRequestDTO
export const transformStep1Data = (
  formData: Record<string, unknown>
): BackendData => {
  return {
    applicantEntitlementRate:
      parseFloat(String(formData.applicantEntitlementRate)) || 0,
    nationalityNo: parseInt(String(formData.nationalityNo)) || 0,
    nationalIdNo: formData.nationalIdNo || "",
    prefix: formData.prefix || "",
    suffix: formData.suffix || "",
    birthDate: formData.birthDate
      ? new Date(formData.birthDate as string | number | Date)
          .toISOString()
          .split("T")[0]
      : null,
    genderId: parseInt(String(formData.genderId)) || 0,
    residencyTypeId: parseInt(String(formData.residencyTypeId)) || 0,
    stateId: parseInt(String(formData.stateId)) || 0,
    city: formData.city || "",
    countryId: parseInt(String(formData.countryId)) || 0,
    ciCountryId: parseInt(String(formData.ciCountryId)) || 0,
    ciStreetAddressOne: formData.ciStreetAddressOne || "",
    ciStreetAddressTwo: formData.ciStreetAddressTwo || "",
    ciCity: formData.ciCity || "",
    ciPostalCode: formData.ciPostalCode || "",
    isAnonymous:
      formData.isAnonymous === "true" || formData.isAnonymous === true,
  };
};

// Step2: ApplicationUpdateStage2RequestDTO
export const transformStep2Data = (
  formData: Record<string, unknown>
): BackendData => {
  return {
    applicationTypeId: parseInt(String(formData.applicationTypeId || "")) || 0,
    titleOfInvention: String(formData.titleOfInvention || ""),
    inventionSummary: String(formData.inventionSummary || ""),
    patentClassificationId: Array.isArray(formData.patentClassificationId)
      ? (formData.patentClassificationId as unknown[]).map(
          (id: unknown) => parseInt(String(id)) || 0
        )
      : [],
    geographicalOrigin:
      formData.geographicalOrigin === "yes" ||
      formData.geographicalOrigin === true,
    governmentFunded:
      formData.governmentFunded === "yes" || formData.governmentFunded === true,
  };
};

// Step3: ApplicationUpdateStage3RequestDTO
export const transformStep3Data = (
  formData: Record<string, unknown>
): BackendData => {
  return {
    claims: formData.claims || [],
    abstractOfTheDisclosures: formData.abstractOfTheDisclosures || [],
    drawings: formData.drawings || [],
    supportingDocuments: formData.supportingDocuments || [],
    likelihood: parseFloat(String(formData.likelihood || "")) || 0,
  };
};

// Step4: ApplicationUpdateStage4RequestDTO
export const transformStep4Data = (
  formData: Record<string, unknown>
): BackendData => {
  return {
    isAIA:
      formData.firstInventorToFile === "true" ||
      formData.firstInventorToFile === true,
  };
};

// Step5: ApplicationUpdateStage5RequestDTO
export const transformStep5Data = (
  formData: Record<string, unknown>
): BackendData => {
  return {
    isAuthorizedToPdx: !formData.refuseSearchResultsAccess,
    isAuthorizedToEpo: !formData.refuseApplicationFileAccess,
  };
};

// Step6: ApplicationUpdateStage6RequestDTO
export const transformStep6Data = (
  formData: Record<string, unknown>
): BackendData => {
  return {
    signature: String(formData.signature || ""),
  };
};

// Step7: ApplicationUpdateStage7RequestDTO
export const transformStep7Data = (
  formData: Record<string, unknown>
): BackendData => {
  return {
    firstName: String(formData.firstName || ""),
    lastName: String(formData.lastName || ""),
    applicationNumber: String(formData.applicationNumber || ""),
    emailAddress: String(formData.emailAddress || ""),
    cardNumber: String(formData.cardNumber || ""),
    nameOnCard: String(formData.nameOnCard || ""),
    expiryDate: String(formData.expiryDate || ""),
    cvvCode: String(formData.cvvCode || ""),
    checkoutTotal: parseFloat(String(formData.checkoutTotal || "")) || 0,
  };
};

// Generic transformation function
export const transformStepData = (
  step: number,
  formData: Record<string, unknown>
): BackendData => {
  switch (step) {
    case 1:
      return transformStep1Data(formData);
    case 2:
      return transformStep2Data(formData);
    case 3:
      return transformStep3Data(formData);
    case 4:
      return transformStep4Data(formData);
    case 5:
      return transformStep5Data(formData);
    case 6:
      return transformStep6Data(formData);
    case 7:
      return transformStep7Data(formData);
    default:
      return formData;
  }
};

// Helper functions for specific data types
export const parseInteger = (value: unknown): number => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = parseInt(String(value));
  return isNaN(parsed) ? 0 : parsed;
};

export const parseFloat = (value: unknown): number => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};

export const parseBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value === "true" || value === "yes" || value === "1";
  }
  if (typeof value === "number") {
    return value === 1;
  }
  return false;
};

export const parseDate = (value: unknown): string | null => {
  if (!value) return null;
  try {
    const date = new Date(value as string | number | Date);
    return date.toISOString().split("T")[0];
  } catch {
    return null;
  }
};
