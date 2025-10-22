import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "blue" | "white" | "gray" | "green";
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "blue",
  text,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    blue: "text-blue-600",
    white: "text-white",
    gray: "text-gray-600",
    green: "text-green-600",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Modern spinning circle */}
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
      {text && (
        <p className={`mt-3 text-sm ${colorClasses[color]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Alternative modern loading animations
export const LoadingDots: React.FC<{ color?: string; className?: string }> = ({
  color = "blue",
  className = "",
}) => {
  const colorClasses = {
    blue: "bg-blue-600",
    white: "bg-white",
    gray: "bg-gray-600",
    green: "bg-green-600",
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div
        className={`w-2 h-2 ${colorClasses[color as keyof typeof colorClasses]} rounded-full animate-bounce`}
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className={`w-2 h-2 ${colorClasses[color as keyof typeof colorClasses]} rounded-full animate-bounce`}
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className={`w-2 h-2 ${colorClasses[color as keyof typeof colorClasses]} rounded-full animate-bounce`}
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );
};

// Pulse loading for cards/containers
export const LoadingPulse: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-lg h-32 w-full"></div>
    </div>
  );
};

export default LoadingSpinner;
