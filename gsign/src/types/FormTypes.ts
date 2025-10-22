import { UploadedFile } from './FileTypes';

export interface FormDataStructure {
  // Step 1 - Applicant/Inventor Information
  applicantEntitlementRate?: string;
  nationalityNo?: string;
  nationalIdNo?: string;
  prefix?: string;
  suffix?: string;
  birthDate?: Date | null;
  genderId?: string;
  residencyTypeId?: string;
  stateId?: string;
  city?: string;
  countryId?: string;
  ciCountryId?: string;
  ciStreetAddressOne?: string;
  ciStreetAddressTwo?: string;
  ciCity?: string;
  ciPostalCode?: string;
  isAnonymous?: boolean;
  
  // Step 2 - Application Type and Classification
  applicationTypeId?: string;
  titleOfInvention?: string;
  inventionSummary?: string;
  patentClassificationId?: string[] | number[];
  geographicalOrigin?: boolean;
  governmentFunded?: boolean;
  
  // Step 3 - Detailed Description
  claims?: UploadedFile[];
  abstractOfTheDisclosures?: UploadedFile[];
  drawings?: UploadedFile[];
  supportingDocuments?: UploadedFile[];
  likelihood?: number;
  likelihoodRate?: number;
  uploadedFiles?: Record<string, UploadedFile[]>;
  
  // Step 4 - First Inventor to File
  firstInventorToFile?: string;
  
  // Step 5 - Authorization
  refuseApplicationFileAccess?: boolean;
  refuseSearchResultsAccess?: boolean;
  
  // Step 6 - Signature
  signature?: string;
  signatureFirstName?: string;
  signatureLastName?: string;
  
  // Step 7 - Payment
  paymentFirstName?: string;
  paymentLastName?: string;
  applicationNumber?: string;
  emailAddress?: string;
  cardNumber?: string;
  nameOnCard?: string;
  expiryDate?: string;
  cvvCode?: string;
  checkoutTotal?: number;
  
  // User info for display
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  phoneNumber?: string;
  
  // API response
  apiResponse?: string;
  
  // Additional fields
  [key: string]: unknown;
}

export interface CommonFormData {
  formData: FormDataStructure;
  handleChange: (name: string, value?: unknown) => void;
  onLikelihoodChecked?: (checked: boolean) => void;
}

export interface FormValidationResult {
  isValid: boolean;
  errors?: Record<string, string>;
}

export interface FormFieldValue {
  value: unknown;
  isValid: boolean;
  errorMessage?: string;
}
