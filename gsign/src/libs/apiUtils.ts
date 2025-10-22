/**
 * Centralized API URL management for all environments
 * No proxy dependency - direct backend communication
 *
 * Environment variables:
 * - NEXT_PUBLIC_API_URL: Complete backend base URL (e.g., https://test-gsign.turkiye.gov.tr/gw)
 */

/**
 * Get the backend API base URL for the current environment
 * @returns Base API URL (e.g., 'http://localhost:8080/api' or 'https://test-gsign.turkiye.gov.tr/gw/api')
 */
export const getBackendApiUrl = (): string => {
  // Production/staging ortamında environment variable kullan
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;

  if (backendUrl) {
    // Eğer URL'de zaten /api ile bitiyorsa olduğu gibi döndür
    if (backendUrl.endsWith("/api")) {
      return backendUrl;
    }
    // Sonuna /api ekle
    return `${backendUrl}/api`;
  }

  // Development fallback
  return "http://localhost:8080/api";
};

/**
 * Build complete API URL for any endpoint
 * @param endpoint - API endpoint (e.g., '/applications/filter' or 'applications/filter')
 * @returns Complete API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getBackendApiUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Build complete API URL for any endpoint
 * @param endpoint - API endpoint (e.g., '/applications/filter', 'applications/filter')
 * @returns Complete backend API URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Eğer zaten tam URL ise (http/https ile başlıyorsa) olduğu gibi döndür
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  // Direkt endpoint kullan
  return buildApiUrl(endpoint);
};
