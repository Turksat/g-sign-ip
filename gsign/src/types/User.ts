export interface User {
  userId: number;
  phoneNumberCountryCodeId: number;
  userRoleId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface UserRole {
  id: number;
  name: string;
}

export const USER_ROLES: UserRole[] = [
  { id: 1, name: "USER" },
  { id: 2, name: "ADMIN" },
];

export interface UsersResponse {
  success: boolean;
  data: User[];
  message: string;
  code: string;
}
