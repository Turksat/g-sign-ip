"use client";

import { ReactNode } from 'react';
import { UserInfo } from '@/libs/jwtUtils';
import { USER_ROLES } from '@/libs/constants';

interface RoleBasedAccessProps {
  userInfo: UserInfo | null;
  requiredRoleId: number;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Role-based access control component
 * Only renders children if user has the required role
 */
export const RoleBasedAccess = ({ 
  userInfo, 
  requiredRoleId, 
  children, 
  fallback = null 
}: RoleBasedAccessProps) => {
  if (userInfo?.userRoleId === requiredRoleId) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

/**
 * Admin-only access component
 */
export const AdminOnly = ({ 
  userInfo, 
  children, 
  fallback 
}: Omit<RoleBasedAccessProps, 'requiredRoleId'>) => {
  return (
    <RoleBasedAccess userInfo={userInfo} requiredRoleId={USER_ROLES.ADMIN} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  );
};

/**
 * Regular user access component
 */
export const RegularUserOnly = ({ 
  userInfo, 
  children, 
  fallback 
}: Omit<RoleBasedAccessProps, 'requiredRoleId'>) => {
  return (
    <RoleBasedAccess userInfo={userInfo} requiredRoleId={USER_ROLES.USER} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  );
};

/**
 * Higher role access component (admin or higher)
 */
export const AdminOrHigher = ({ 
  userInfo, 
  children, 
  fallback 
}: Omit<RoleBasedAccessProps, 'requiredRoleId'>) => {
  if (userInfo?.userRoleId && userInfo.userRoleId >= USER_ROLES.ADMIN) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};
