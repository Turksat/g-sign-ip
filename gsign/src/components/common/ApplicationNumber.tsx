import React from "react";

interface ApplicationNumberProps {
  applicationNo: string;
}

const ApplicationNumber: React.FC<ApplicationNumberProps> = ({ applicationNo }) => {
  return (
    <div className="text-center py-4 mb-6">
      <div className="inline-block bg-gray-50 border border-gray-200 rounded-lg px-6 py-3">
        <div className="text-sm text-gray-600 mb-1">Application Number</div>
        <div className="text-lg font-semibold text-gray-900">{applicationNo}</div>
      </div>
    </div>
  );
};

export default ApplicationNumber;
