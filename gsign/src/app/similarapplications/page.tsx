"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { InputDate, InputText, Select } from "@edk/ui-react";
import { useCountries } from "@/hooks/useCountries";
import { usePatentClassifications } from "@/hooks/usePatentClassifications";
import { PatentSearchRequest, usePatentSearch } from "@/hooks/usePatentSearch";
import CustomTable from "@/components/common/CustomTable";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// Helper to check if any advanced input is filled
const hasAnyValue = (obj: Record<string, string>) =>
  Object.values(obj).some((v) => (v ?? "").toString().trim().length > 0);

export default function PatentSearchPage() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"basic" | "advanced">("basic");
  const { countries, loading: countriesLoading } = useCountries();
  const { patentClassifications, loading: classificationsLoading } =
    usePatentClassifications();
  const { searchPatents, loading: isLoading } = usePatentSearch();
  const [searchResults, setSearchResults] = useState<null | {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    message?: string;
    patents: Array<{
      id: number;
      patentNumber?: string;
      publicationDate: string;
      applicationDate: string;
      title: string;
      applicant: string;
      inventor: string;
      country: string;
    }>;
  }>(null);

  // Basic search state
  const [patentNumber, setPatentNumber] = useState("");
  const [, setCurrentPage] = useState(1);

  // Advanced search state
  const [adv, setAdv] = useState({
    keyword: "",
    title: "",
    applicantInventor: "",
    country: "",
    classification: "",
    startDate: "",
    endDate: "",
  });

  const advancedDisabled = useMemo(() => !hasAnyValue(adv), [adv]);

  const handleSearch = async () => {
    // Guard rails
    if (searchType === "basic" && !patentNumber.trim()) return;
    if (searchType === "advanced" && advancedDisabled) return;

    // Reset to page 1 for new searches
    setCurrentPage(1);

    // Prepare search request based on search type
    const searchRequest: PatentSearchRequest = {
      searchType,
      page: 1, // Always start from page 1 for new searches
      size: 10,
    };

    if (searchType === "basic") {
      searchRequest.patentNumber = patentNumber.trim();
    } else {
      // Advanced search parameters
      if (adv.keyword) searchRequest.keyword = adv.keyword;
      if (adv.title) searchRequest.title = adv.title;
      if (adv.applicantInventor)
        searchRequest.applicantInventor = adv.applicantInventor;
      if (adv.country) searchRequest.countryCode = adv.country;
      if (adv.classification)
        searchRequest.patentClassificationId = adv.classification;
      if (adv.startDate) searchRequest.publicationStartDate = adv.startDate;
      if (adv.endDate) searchRequest.publicationEndDate = adv.endDate;
    }

    const response = await searchPatents(searchRequest);
    if (response) {
      setSearchResults({
        totalRecords: response.data.totalRecords,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        pageSize: response.data.pageSize,
        message: response.message,
        patents: response.data.patents.map((patent) => ({
          id: Number(patent.id) || 0,
          patentNumber: patent.patentNumber,
          publicationDate: patent.publicationDate,
          applicationDate: patent.publicationDate, // Using publication date as fallback
          title: patent.title,
          applicant: patent.applicant,
          inventor: patent.inventor || "N/A",
          country: patent.country,
        })),
      });
      setCurrentPage(response.data.currentPage);
    }
  };

  const handleReset = () => {
    setPatentNumber("");
    setCurrentPage(1);
    setAdv({
      keyword: "",
      title: "",
      applicantInventor: "",
      country: "",
      classification: "",
      startDate: "",
      endDate: "",
    });
    setSearchResults(null);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);

    // Create search request with the new page
    const searchRequest: PatentSearchRequest = {
      searchType,
      page: page, // Use the new page directly
      size: 10,
    };

    if (searchType === "basic") {
      searchRequest.patentNumber = patentNumber.trim();
    } else {
      // Advanced search parameters
      if (adv.keyword) searchRequest.keyword = adv.keyword;
      if (adv.title) searchRequest.title = adv.title;
      if (adv.applicantInventor)
        searchRequest.applicantInventor = adv.applicantInventor;
      if (adv.country) searchRequest.countryCode = adv.country;
      if (adv.classification)
        searchRequest.patentClassificationId = adv.classification;
      if (adv.startDate) searchRequest.publicationStartDate = adv.startDate;
      if (adv.endDate) searchRequest.publicationEndDate = adv.endDate;
    }

    const response = await searchPatents(searchRequest);
    if (response) {
      setSearchResults({
        totalRecords: response.data.totalRecords,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        pageSize: response.data.pageSize,
        message: response.message,
        patents: response.data.patents.map((patent) => ({
          id: Number(patent.id) || 0,
          patentNumber: patent.patentNumber,
          publicationDate: patent.publicationDate,
          applicationDate: patent.publicationDate,
          title: patent.title,
          applicant: patent.applicant,
          inventor: patent.inventor || "N/A",
          country: patent.country,
        })),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search for Similar Patent Applications
            </h1>
            <p className="text-lg text-gray-600">
              Discover similar patents to help with your research and
              application process
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Search Type Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Choose Search Method
              </h2>
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center">
                  <input
                    id="basic-search"
                    name="searchType"
                    type="radio"
                    value="basic"
                    checked={searchType === "basic"}
                    onChange={() => setSearchType("basic")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="basic-search" className="ml-3 block">
                    <div className="text-sm font-medium text-gray-900">
                      Basic Search
                    </div>
                    <div className="text-sm text-gray-500">
                      Search by patent number
                    </div>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="advanced-search"
                    name="searchType"
                    type="radio"
                    value="advanced"
                    checked={searchType === "advanced"}
                    onChange={() => setSearchType("advanced")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="advanced-search" className="ml-3 block">
                    <div className="text-sm font-medium text-gray-900">
                      Advanced Search
                    </div>
                    <div className="text-sm text-gray-500">
                      Search by multiple criteria
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* BASIC SEARCH */}
            {searchType === "basic" && (
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Basic Search
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="patentNumber"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Patent Number
                      </label>
                      <div className="w-full">
                        <InputText
                          name="patentNumber"
                          value={patentNumber}
                          onChange={(value) =>
                            setPatentNumber(String(value || ""))
                          }
                          placeholder="e.g., US1234567B1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADVANCED SEARCH */}
            {searchType === "advanced" && (
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    Advanced Search
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keyword
                      </label>
                      <div className="w-full">
                        <InputText
                          name="keyword"
                          value={adv.keyword}
                          onChange={(value) =>
                            setAdv((s) => ({
                              ...s,
                              keyword: String(value || ""),
                            }))
                          }
                          placeholder="e.g., machine learning"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title of Invention
                      </label>
                      <div className="w-full">
                        <InputText
                          name="title"
                          value={adv.title}
                          onChange={(value) =>
                            setAdv((s) => ({
                              ...s,
                              title: String(value || ""),
                            }))
                          }
                          placeholder="Enter invention title"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Applicant / Inventor
                      </label>
                      <div className="w-full">
                        <InputText
                          name="applicantInventor"
                          value={adv.applicantInventor}
                          onChange={(value) =>
                            setAdv((s) => ({
                              ...s,
                              applicantInventor: String(value || ""),
                            }))
                          }
                          placeholder="Company or person name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <div className="w-full">
                        <Select
                          name="country"
                          value={adv.country}
                          onChange={(value) => {
                            const selectedValue =
                              value &&
                              typeof value === "object" &&
                              "value" in value
                                ? value.value
                                : value;
                            setAdv((s) => ({
                              ...s,
                              country: String(selectedValue || ""),
                            }));
                          }}
                          data={[
                            { label: "Select country", value: "" },
                            ...(countries.length > 0
                              ? countries.map((country) => ({
                                  label: country.countryName,
                                  value: country.countryCode,
                                }))
                              : [
                                  { label: "United States", value: "US" },
                                  { label: "Turkey", value: "TR" },
                                  { label: "European Union", value: "EU" },
                                  { label: "Germany", value: "DE" },
                                  { label: "United Kingdom", value: "GB" },
                                ]),
                          ]}
                          disabled={countriesLoading}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patent Classification
                      </label>
                      <div className="w-full">
                        <Select
                          name="classification"
                          value={adv.classification}
                          onChange={(value) => {
                            const selectedValue =
                              value &&
                              typeof value === "object" &&
                              "value" in value
                                ? value.value
                                : value;
                            setAdv((s) => ({
                              ...s,
                              classification: String(selectedValue || ""),
                            }));
                          }}
                          data={[
                            { label: "Select classification", value: "" },
                            ...(patentClassifications.length > 0
                              ? patentClassifications.map((classification) => ({
                                  label: classification.name,
                                  value:
                                    classification.patentClassificationId.toString(),
                                }))
                              : [
                                  {
                                    label:
                                      "G06F — Electric Digital Data Processing",
                                    value: "G06F",
                                  },
                                  {
                                    label:
                                      "H04L — Transmission of Digital Information",
                                    value: "H04L",
                                  },
                                  {
                                    label:
                                      "G06N — Computer Systems Based on Specific Computational Models",
                                    value: "G06N",
                                  },
                                ]),
                          ]}
                          disabled={classificationsLoading}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Publication Date Range
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="w-full">
                          <InputDate
                            name="startDate"
                            value={
                              adv.startDate
                                ? new Date(adv.startDate)
                                : undefined
                            }
                            onChange={(value) =>
                              setAdv((s) => ({
                                ...s,
                                startDate:
                                  value instanceof Date
                                    ? value.toISOString().split("T")[0]
                                    : "",
                              }))
                            }
                            placeholder="Start date"
                          />
                        </div>
                        <div className="w-full">
                          <InputDate
                            name="endDate"
                            value={
                              adv.endDate ? new Date(adv.endDate) : undefined
                            }
                            onChange={(value) =>
                              setAdv((s) => ({
                                ...s,
                                endDate:
                                  value instanceof Date
                                    ? value.toISOString().split("T")[0]
                                    : "",
                              }))
                            }
                            placeholder="End date"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Common Search Actions */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSearch}
                  disabled={
                    isLoading ||
                    (searchType === "basic" && !patentNumber.trim()) ||
                    (searchType === "advanced" && advancedDisabled)
                  }
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner
                        size="sm"
                        color="white"
                        className="mr-2"
                      />
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Search Patents
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="bg-blue-50 rounded-lg p-8 text-center">
                <LoadingSpinner
                  size="lg"
                  color="blue"
                  text="Searching for similar patents..."
                />
              </div>
            )}

            {/* Search Results */}
            {searchResults && !isLoading && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {searchResults.totalRecords > 0 ? (
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {searchResults.totalRecords > 0
                          ? "Search Results"
                          : "No Results Found"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {searchResults.totalRecords > 0 ? (
                          <>
                            Found {searchResults.totalRecords} result
                            {searchResults.totalRecords > 1 ? "s" : ""}
                            {searchResults.totalPages > 1 && (
                              <span>
                                {" "}
                                • Page {searchResults.currentPage} of{" "}
                                {searchResults.totalPages}
                              </span>
                            )}
                          </>
                        ) : (
                          searchResults.message ||
                          "No patents match your search criteria. Try adjusting your search parameters."
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        searchResults.totalRecords > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {searchResults.totalRecords} Results
                    </span>
                  </div>
                </div>

                {/* Custom Table with Server-side Pagination */}
                <CustomTable
                  columns={[
                    {
                      key: "id",
                      title: "#",
                      width: "60px",
                      render: (value, record, index) =>
                        (searchResults.currentPage - 1) *
                          searchResults.pageSize +
                        index +
                        1,
                    },
                    {
                      key: "patentNumber",
                      title: "Patent Number",
                      render: (value: unknown) => (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                          {String(value || "—")}
                        </div>
                      ),
                    },
                    {
                      key: "publicationDate",
                      title: "Publication Date",
                    },
                    {
                      key: "applicationDate",
                      title: "Application Date",
                    },
                    {
                      key: "title",
                      title: "Title",
                      render: (value: unknown) => (
                        <div
                          className="font-medium text-gray-900 truncate max-w-xs"
                          title={String(value || "")}
                        >
                          {String(value || "")}
                        </div>
                      ),
                    },
                    {
                      key: "applicant",
                      title: "Applicant / Inventor",
                      render: (value: unknown, record: unknown) => (
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 text-xs">
                            {String(value || "")}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {String(
                              (record as { inventor?: string })?.inventor || ""
                            )}
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "country",
                      title: "Country",
                      render: (value: unknown) => (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border">
                          {String(value || "")}
                        </span>
                      ),
                    },
                    {
                      key: "id",
                      title: "Action",
                      width: "80px",
                      align: "center" as const,
                      render: (
                        value: unknown,
                        record: { patentNumber?: string }
                      ) => (
                        <button
                          onClick={() =>
                            router.push(`/patent-detail/${record.patentNumber}`)
                          }
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                          title="View Patent Details"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      ),
                    },
                  ]}
                  data={searchResults.patents}
                  loading={isLoading}
                  pagination={{
                    currentPage: searchResults.currentPage,
                    totalPages: searchResults.totalPages,
                    totalRecords: searchResults.totalRecords,
                    pageSize: searchResults.pageSize,
                  }}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
