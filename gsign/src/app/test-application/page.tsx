"use client";

import { useState } from "react";
import { useApplicationSummary } from "@/hooks/useApplicationSummary";
import { transformApplicationSummaryToFormData } from "@/libs/dataTransformation";

export default function TestApplicationPage() {
  const [applicationNo, setApplicationNo] = useState("");
  const [formData, setFormData] = useState<Record<string, unknown> | null>(
    null
  );
  const { fetchApplicationSummary, loading, error } = useApplicationSummary();

  const handleLoadApplication = async () => {
    if (!applicationNo.trim()) {
      alert("Please enter an application number");
      return;
    }

    try {
      const summary = await fetchApplicationSummary(applicationNo);

      if (summary) {
        const transformedData = transformApplicationSummaryToFormData(
          summary as unknown as Record<string, unknown>
        );
        setFormData(transformedData);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test Application Summary Loading
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Load Application Summary
          </h2>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={applicationNo}
              onChange={(e) => setApplicationNo(e.target.value)}
              placeholder="Enter application number (e.g., PT250000006676)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLoadApplication}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Load"}
            </button>
          </div>

          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">
              Error: {error}
            </div>
          )}

          <div className="text-sm text-gray-600 mt-2">
            <p>
              <strong>API Endpoint:</strong>{" "}
              /api/applications/get-application-summary/{applicationNo}
            </p>
            <p>
              <strong>Method:</strong> POST
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {loading ? "Loading..." : error ? "Error" : "Ready"}
            </p>
          </div>
        </div>

        {formData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Transformed Form Data
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Step 1 - Applicant Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Name:</strong> {String(formData.firstName || "")}{" "}
                    {String(formData.middleName || "")}{" "}
                    {String(formData.lastName || "")}
                  </div>
                  <div>
                    <strong>Email:</strong> {String(formData.email || "")}
                  </div>
                  <div>
                    <strong>Country Code:</strong>{" "}
                    {String(formData.countryCode || "")}
                  </div>
                  <div>
                    <strong>Phone Number:</strong>{" "}
                    {String(formData.phoneNumber || "")}
                  </div>
                  <div>
                    <strong>Gender ID:</strong>{" "}
                    {String(formData.genderId || "")}
                  </div>
                  <div>
                    <strong>Birth Date:</strong>{" "}
                    {formData.birthDate instanceof Date
                      ? formData.birthDate.toDateString()
                      : String(formData.birthDate || "")}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Step 2 - Application Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Title:</strong>{" "}
                    {String(formData.titleOfInvention || "")}
                  </div>
                  <div>
                    <strong>Summary:</strong>{" "}
                    {String(formData.inventionSummary || "")}
                  </div>
                  <div>
                    <strong>Application Type ID:</strong>{" "}
                    {String(formData.applicationTypeId || "")}
                  </div>
                  <div>
                    <strong>Geographical Origin:</strong>{" "}
                    {formData.geographicalOrigin ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong>Government Funded:</strong>{" "}
                    {formData.governmentFunded ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-2">
                Raw Form Data (JSON)
              </h3>
              <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto max-h-96">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
