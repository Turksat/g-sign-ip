import { Button } from '@edk/ui-react';
import React from 'react';

interface HeaderProps {
  description?: string;
  buttonText?: string;
  onNewApplicationClick?: () => void;
  className?: string;
}

const HeaderSection: React.FC<HeaderProps> = ({
  description = "On this screen, you can view information about your previously submitted non-provisional utility model patent applications, review their details, cancel them, or generate documents. If you would like to submit a new patent application, please click the \"New Patent Application\" button.",
  buttonText = "New Patent Application",
  onNewApplicationClick,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Patent Application Management
            </h3>
            <p className="text-gray-600 text-sm">
              Manage your patent applications and track their progress
            </p>
          </div>
        </div>
        
        <Button 
          variant='primary'
          label={`+ ${buttonText}`}
          onClick={onNewApplicationClick}
          className="px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
        />
      </div>
      
      {/* Description Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-gray-700 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;