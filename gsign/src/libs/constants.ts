/**
 * Application constants
 */

/**
 * API Configuration
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * User Role IDs
 * Based on the database user_roles table
 */
export const USER_ROLES = {
  USER: 1,    // Regular user
  ADMIN: 2,   // Administrator
} as const;

/**
 * User Role Names
 * Based on the database user_roles table
 */
export const USER_ROLE_NAMES = {
  [USER_ROLES.USER]: 'USER',
  [USER_ROLES.ADMIN]: 'ADMIN',
} as const;

/**
 * Type for user role IDs
 */
export type UserRoleId = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Type for user role names
 */
export type UserRoleName = typeof USER_ROLE_NAMES[keyof typeof USER_ROLE_NAMES];

/**
 * Application Status IDs
 * Based on the database application_status table
 */
export const APPLICATION_STATUS = {
  COMPLETED: 1,
  PENDING_PAYMENT: 2,
  INCOMPLETE: 3,
  PATENT_GRANTED: 4,
  UNDER_REVIEW: 5,
  REJECTED: 6,
  CANCELLED: 7,
  AWAITING_REPLY: 8,
  SYSTEM_CANCELLED: 9,
} as const;

/**
 * Application Status Names
 * Based on the database application_status table
 */
export const APPLICATION_STATUS_NAMES = {
  [APPLICATION_STATUS.COMPLETED]: 'Completed',
  [APPLICATION_STATUS.PENDING_PAYMENT]: 'Pending Payment',
  [APPLICATION_STATUS.INCOMPLETE]: 'Incomplete',
  [APPLICATION_STATUS.PATENT_GRANTED]: 'Patent Granted',
  [APPLICATION_STATUS.UNDER_REVIEW]: 'Under Review',
  [APPLICATION_STATUS.REJECTED]: 'Rejected',
  [APPLICATION_STATUS.CANCELLED]: 'Cancelled',
  [APPLICATION_STATUS.AWAITING_REPLY]: 'Awaiting Reply',
  [APPLICATION_STATUS.SYSTEM_CANCELLED]: 'System Cancelled',
} as const;

/**
 * Type for application status IDs
 */
export type ApplicationStatusId = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];

/**
 * Type for application status names
 */
export type ApplicationStatusName = typeof APPLICATION_STATUS_NAMES[keyof typeof APPLICATION_STATUS_NAMES];

/**
 * Application Status Configuration
 * Includes color coding and icons for UI display
 */
export const APPLICATION_STATUS_CONFIG = {
  [APPLICATION_STATUS.COMPLETED]: {
    name: 'Completed',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: 'check-circle',
    description: 'Application completed successfully'
  },
  [APPLICATION_STATUS.PENDING_PAYMENT]: {
    name: 'Pending Payment',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: 'clock',
    description: 'Waiting for payment'
  },
  [APPLICATION_STATUS.INCOMPLETE]: {
    name: 'Incomplete',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: 'document',
    description: 'Application is incomplete'
  },
  [APPLICATION_STATUS.PATENT_GRANTED]: {
    name: 'Patent Granted',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: 'trophy',
    description: 'Patent has been granted'
  },
  [APPLICATION_STATUS.UNDER_REVIEW]: {
    name: 'Under Review',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    icon: 'eye',
    description: 'Application is under review'
  },
  [APPLICATION_STATUS.REJECTED]: {
    name: 'Rejected',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: 'x-circle',
    description: 'Application has been rejected'
  },
  [APPLICATION_STATUS.CANCELLED]: {
    name: 'Cancelled',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: 'ban',
    description: 'Application has been cancelled'
  },
  [APPLICATION_STATUS.AWAITING_REPLY]: {
    name: 'Awaiting Reply',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    icon: 'clock',
    description: 'Waiting for user reply'
  },
  [APPLICATION_STATUS.SYSTEM_CANCELLED]: {
    name: 'System Cancelled',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: 'x-circle',
    description: 'Application cancelled by system'
  },
} as const;
