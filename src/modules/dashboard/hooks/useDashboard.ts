import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DASHBOARD_URL } from "@/modules/dashboard/api/dashboard.api";
import type { CategoryStat } from "@/modules/dashboard/types/dashboard.types";

async function fetchDashboardStats(): Promise<CategoryStat[]> {
  const token = localStorage.getItem("token");
  const response = await axios.get(DASHBOARD_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return (response.data?.total_categories ?? []) as CategoryStat[];
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
  });
}
