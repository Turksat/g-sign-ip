import { useCallback } from "react";
import { extractUserInfoFromToken, UserInfo } from "../libs/jwtUtils";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  redirectTo?: string;
}

export const useApi = () => {
  const getAuthToken = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return sessionStorage.getItem("authToken");
  }, []);

  const isAuthenticated = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return !!getAuthToken();
  }, [getAuthToken]);

  const getUserInfo = useCallback((): UserInfo | null => {
    if (typeof window === "undefined") {
      return null;
    }
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    return extractUserInfoFromToken(token);
  }, [getAuthToken]);

  const redirectToLogin = useCallback(() => {
    // Bu fonksiyon artık güvenli değil - kullanıcı component'lerde router.push("/login") kullanmalı
    // window.location.href kullanımı Open Redirect saldırılarına açık
    console.warn(
      "redirectToLogin is deprecated. Use router.push('/login') instead."
    );
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  const apiCall = useCallback(
    async <T>(
      url: string,
      options: RequestInit = {}
    ): Promise<ApiResponse<T>> => {
      const token = getAuthToken();

      if (!token) {
        redirectToLogin();
        throw new Error("No authentication token found");
      }

      const defaultHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      };

      try {
        const response = await fetch(url, {
          ...options,
          headers: defaultHeaders,
        });

        const result = await response.json();

        // JWT expired kontrolü
        if (response.status === 401) {
          if (result.redirectTo && typeof window !== "undefined") {
            // Güvenli olmayan redirect - component'lerde router.push kullanılmalı
            console.warn(
              "Direct redirect in useApi is deprecated. Use router.push() in components instead."
            );
            window.location.href = result.redirectTo;
            return result; // Redirect sonrası return
          } else {
            redirectToLogin();
            return result; // Redirect sonrası return
          }
        }

        if (!response.ok) {
          throw new Error(
            result.message || `HTTP error! status: ${response.status}`
          );
        }

        return result;
      } catch (error) {
        throw error;
      }
    },
    [getAuthToken, redirectToLogin]
  );

  const get = useCallback(
    <T>(url: string): Promise<ApiResponse<T>> => {
      return apiCall<T>(url, { method: "GET" });
    },
    [apiCall]
  );

  const post = useCallback(
    <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
      return apiCall<T>(url, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [apiCall]
  );

  const put = useCallback(
    <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
      return apiCall<T>(url, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [apiCall]
  );

  const del = useCallback(
    <T>(url: string): Promise<ApiResponse<T>> => {
      return apiCall<T>(url, { method: "DELETE" });
    },
    [apiCall]
  );

  return {
    getAuthToken,
    isAuthenticated,
    getUserInfo,
    redirectToLogin,
    apiCall,
    get,
    post,
    put,
    del,
  };
};
