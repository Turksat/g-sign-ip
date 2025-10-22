import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { AdminDashboardStatsResponseDTO } from "@/types/ApiTypes";
import { getApiUrl } from "@/libs/apiUtils";

export type AdminDashboardStats = AdminDashboardStatsResponseDTO;

export const useAdminDashboardStats = () => {
  const { get } = useApi();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = getApiUrl("/applications/admin-dashboard-stats");
      const result = await get(url);

      if (result.success && result.data) {
        setStats(result.data as AdminDashboardStats);
      } else {
        setError(result.message || "Failed to fetch dashboard stats");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
