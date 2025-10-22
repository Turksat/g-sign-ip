// Form data arrays for select components
export const FORM_DATA_ARRAYS = {
  // Step1 - Applicant/Inventor Information
  applicantInventor: [
    { label: "Applicant", value: "applicant" },
    { label: "Inventor", value: "inventor" },
    { label: "Both", value: "both" },
  ],

  // Step2 - Application Type
  applicationType: [
    { label: "Non-Provisional Utility", value: "Non-Provisional Utility" },
    { label: "Provisional-Utility", value: "Provisional-Utility" },
    { label: "Design", value: "Design" },
    { label: "Non-Provisional Plant", value: "Non-Provisional Plant" },
  ],

  // Step2 - General Patent Classification
  generalPatentClassification: [
    { label: "A - HUMAN NECESSITIES", value: "A" },
    { label: "B - PERFORMING OPERATIONS; TRANSPORTING", value: "B" },
    { label: "C - CHEMISTRY; METALLURGY", value: "C" },
    { label: "D - TEXTILES; PAPER", value: "D" },
    { label: "E - FIXED CONSTRUCTIONS", value: "E" },
    {
      label: "F - MECHANICAL ENGINEERING; LIGHTING; HEATING; WEAPONS; BLASTING",
      value: "F",
    },
    { label: "G - PHYSICS", value: "G" },
    { label: "H - ELECTRICITY", value: "H" },
    { label: "Y - NEW AND MULTI-DOMAIN TECHNOLOGIES", value: "Y" },
  ],

  // Step2 - Geographical Origin
  geographicalOrigin: [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ],

  // Step2 - Traditional Knowledge (legacy - keep for backward compatibility)
  traditionalKnowledge: [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ],

  // Step2 - Government Funding
  governmentFunded: [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ],

  nationalityNo: [
    { label: "Turkey", value: "90" },
    { label: "USA", value: "1" },
    { label: "Norway", value: "578" },
    { label: "Tunisia", value: "788" },
    { label: "Ukraine", value: "804" },
  ] as Array<{ label: string; value: string }>,

  prefix: [
    { label: "Mr.", value: "Mr." },
    { label: "Mrs.", value: "Mrs." },
    { label: "Ms.", value: "Ms." },
    { label: "Dr.", value: "Dr." },
    { label: "Prof.", value: "Prof." },
    { label: "Sir", value: "Sir" },
    { label: "Lady", value: "Lady" },
    { label: "Lord", value: "Lord" },
    { label: "Dame", value: "Dame" },
    { label: "Rev.", value: "Rev." },
    { label: "Capt.", value: "Capt." },
    { label: "Col.", value: "Col." },
    { label: "Gen.", value: "Gen." },
    { label: "Lt.", value: "Lt." },
    { label: "Sgt.", value: "Sgt." },
    { label: "Cpl.", value: "Cpl." },
    { label: "Pvt.", value: "Pvt." },
    { label: "Other", value: "Other" },
  ],

  suffix: [
    { label: "Jr.", value: "Jr." },
    { label: "Sr.", value: "Sr." },
    { label: "I", value: "I" },
    { label: "II", value: "II" },
    { label: "III", value: "III" },
    { label: "IV", value: "IV" },
    { label: "V", value: "V" },
    { label: "VI", value: "VI" },
    { label: "VII", value: "VII" },
    { label: "VIII", value: "VIII" },
    { label: "IX", value: "IX" },
    { label: "X", value: "X" },
    { label: "Other", value: "Other" },
  ],

  // genderId artık API'den alınacak - useGenders hook'u kullanın
  genderId: [] as Array<{ label: string; value: string }>,

  // countryCode artık API'den alınacak - useCountries hook'u kullanın
  countryCode: [] as Array<{ label: string; value: string }>,

  residencyTypeId: [
    { label: "US Residency", value: "1" },
    { label: "Non US Residency", value: "2" },
    { label: "Active US Military", value: "3" },
  ],

  // stateId artık API'den alınacak - useStates hook'u kullanın
  stateId: [] as Array<{ label: string; value: string }>,

  // countryId artık API'den alınacak - useCountries hook'u kullanın
  countryId: [] as Array<{ label: string; value: string }>,

  // ciCountryId artık API'den alınacak - useCountries hook'u kullanın
  ciCountryId: [] as Array<{ label: string; value: string }>,

  anonymous: [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ],

  // Step4 - First Inventor to File
  firstInventorToFile: [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ],

  // Step5 - Authorization to Permit Access
  refuseApplicationFileAccess: [
    { label: "Allowed", value: "true" },
    { label: "Refused", value: "false" },
  ],

  refuseSearchResultsAccess: [
    { label: "Allowed", value: "true" },
    { label: "Refused", value: "false" },
  ],
};

// Helper function to get label by value
export const getLabelByValue = (
  arrayName: keyof typeof FORM_DATA_ARRAYS,
  value: string
): string => {
  const array = FORM_DATA_ARRAYS[arrayName];
  if (!array) return value;

  const item = array.find((item) => item.value === value);
  return item ? item.label : value;
};

// Helper function to get value by label
export const getValueByLabel = (
  arrayName: keyof typeof FORM_DATA_ARRAYS,
  label: string
): string => {
  const array = FORM_DATA_ARRAYS[arrayName];
  if (!array) return label;

  const item = array.find((item) => item.label === label);
  return item ? item.value : label;
};

// Countries API helper functions
export const formatCountriesForSelect = (
  countries: Array<{
    countryId: number;
    countryName: string;
    countryCode: string;
  }>
) => {
  return countries.map((country) => ({
    label: `${country.countryName} (${country.countryCode})`,
    value: country.countryId.toString(),
  }));
};

export const formatCountriesForIdSelect = (
  countries: Array<{
    countryId: number;
    countryName: string;
    countryCode: string;
  }>
) => {
  return countries.map((country) => ({
    label: country.countryName,
    value: country.countryId.toString(),
  }));
};
