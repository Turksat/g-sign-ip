

// Step 1 Types
export interface Step1FormData {
  applicantEntitlementRate: string;
  nationalityNo: string;
  nationalIdNo: string;
  prefix: string;
  suffix: string;
  birthDate: Date;
  genderId: string;
  residencyTypeId: string;
  stateId: string;
  city: string;
  countryId: number;
  ciCountryId: number;
  ciStreetAddressOne: string;
  ciStreetAddressTwo: string;
  ciCity: string;
  ciPostalCode: string;
  isAnonymous: boolean;
  applicantInventor: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
}

// Step 2 Types
export interface Step2FormData {
  applicationTypeId: number;
  titleOfInvention: string;
  inventionSummary: string;
  patentClassificationId: number[];
  geographicalOrigin: boolean;
  governmentFunded: boolean;
}

// Step 3 Types
export interface Step3FormData {
  claims: File[];
  abstractOfTheDisclosures: File[];
  drawings: File[];
  supportingDocuments: File[];
  likelihood: number;
}

export interface ApplicationDocument {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileContent: string; // Base64 encoded
  fileExtension: string;
  applicationDocumentTypeId: number;
}

// Step 4 Types
export interface Step4FormData {
  firstInventorToFile: string;
}

// Step 5 Types
export interface Step5FormData {
  refuseApplicationFileAccess: boolean;
  refuseSearchResultsAccess: boolean;
}

// Step 6 Types
export interface Step6FormData {
  confirmInfo: boolean;
  confirmPayment: boolean;
  signatureFirstName: string;
  signatureLastName: string;
  signature: string;
}

// Step 7 Types
export interface Step7FormData {
  firstName: string;
  lastName: string;
  applicationNumber: string;
  emailAddress: string;
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvvCode: string;
}

// Common Step Ref Interface
export interface StepRef {
  trigger: () => Promise<boolean>;
}

// Step Navigation
export interface StepNavigation {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastStep: boolean;
}
