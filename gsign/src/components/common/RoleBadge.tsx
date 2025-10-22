"use client";

import { USER_ROLE_NAMES } from '@/libs/constants';

interface RoleBadgeProps {
  roleId: number | undefined;
  showLabel?: boolean;
  className?: string;
}

/**
 * Role badge component for displaying user roles
 */
export const RoleBadge = ({ roleId, showLabel = true, className = "" }: RoleBadgeProps) => {
  const getRoleDisplayName = (roleId: number | undefined): string => {
    if (!roleId) return 'Unknown';
    return USER_ROLE_NAMES[roleId as keyof typeof USER_ROLE_NAMES] || 'Unknown';
  };

  const getRoleColor = (roleId: number | undefined): string => {
    switch (roleId) {
      case 1: // USER
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 2: // ADMIN
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const roleName = getRoleDisplayName(roleId);
  const roleColor = getRoleColor(roleId);

  return (
    <div className={`inline-flex items-center ${className}`}>
      {showLabel && <span className="text-xs text-gray-600 mr-2">Role:</span>}
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${roleColor}`}>
        {roleName}
      </span>
    </div>
  );
};
