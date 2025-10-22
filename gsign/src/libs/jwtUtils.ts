/**
 * JWT token'dan user bilgilerini çıkarmak için utility fonksiyonları
 */

import { USER_ROLES } from "./constants";

export interface UserInfo {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  userRoleId: number;
  phoneNumber: string;
  phoneNumberCountryCodeId: number;
  userId: number;
}

/**
 * JWT token'dan user bilgilerini çıkarır
 * @param token JWT token (Bearer prefix olmadan)
 * @returns UserInfo object veya null
 */
export const extractUserInfoFromToken = (token: string): UserInfo | null => {
  try {
    // JWT token'ı decode et
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);

    return {
      username: payload.sub || "",
      firstName: payload.firstName || "",
      middleName: payload.middleName || "",
      lastName: payload.lastName || "",
      email: payload.email || "",
      userRoleId: payload.userRoleId || 0,
      phoneNumber: payload.phoneNumber || "",
      phoneNumberCountryCodeId: payload.phoneNumberCountryCodeId || 0,
      userId: payload.userId || 0,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

/**
 * Authorization header'dan JWT token'ı çıkarır
 * @param authorizationHeader "Bearer {token}" formatında header
 * @returns JWT token string veya null
 */
export const extractTokenFromHeader = (
  authorizationHeader: string
): string | null => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.substring(7); // "Bearer " prefix'ini kaldır
};

/**
 * Authorization header'dan user bilgilerini çıkarır
 * @param authorizationHeader "Bearer {token}" formatında header
 * @returns UserInfo object veya null
 */
export const extractUserInfoFromHeader = (
  authorizationHeader: string
): UserInfo | null => {
  const token = extractTokenFromHeader(authorizationHeader);
  if (!token) {
    return null;
  }

  return extractUserInfoFromToken(token);
};

/**
 * JWT token'ın expire olup olmadığını kontrol eder
 * @param token JWT token
 * @returns boolean - true if expired, false if valid
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = extractUserInfoFromToken(token);
    if (!payload) return true;

    // JWT payload'da exp field'ı yoksa expired kabul et
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const fullPayload = JSON.parse(jsonPayload);
    const expirationTime = fullPayload.exp * 1000; // Convert to milliseconds

    return Date.now() >= expirationTime;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return true;
  }
};

/**
 * Role-based access control utility functions
 */

/**
 * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
 * @param userInfo UserInfo object
 * @param roleId Role ID to check
 * @returns boolean - true if user has the specified role
 */
export const hasRole = (userInfo: UserInfo | null, roleId: number): boolean => {
  return userInfo?.userRoleId === roleId;
};

/**
 * Kullanıcının admin olup olmadığını kontrol eder
 * @param userInfo UserInfo object
 * @returns boolean - true if user is admin
 */
export const isAdmin = (userInfo: UserInfo | null): boolean => {
  return hasRole(userInfo, USER_ROLES.ADMIN);
};

/**
 * Kullanıcının regular user olup olmadığını kontrol eder
 * @param userInfo UserInfo object
 * @returns boolean - true if user is regular user
 */
export const isRegularUser = (userInfo: UserInfo | null): boolean => {
  return hasRole(userInfo, USER_ROLES.USER);
};
