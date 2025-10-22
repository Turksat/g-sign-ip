import React from 'react';

export interface ActionButtonProps {
  action: string;
  label: string;
  variant: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info';
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  variant,
  icon,
  onClick,
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300';
      case 'secondary':
        return 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300';
      case 'danger':
        return 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300';
      case 'warning':
        return 'text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300';
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300';
      case 'info':
        return 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium border rounded-md transition-colors duration-200 flex items-center justify-center ${getVariantClasses()} ${className}`}
    >
      <span className="w-3 h-3 mr-1">
        {icon}
      </span>
      {label}
    </button>
  );
};

export default ActionButton;
