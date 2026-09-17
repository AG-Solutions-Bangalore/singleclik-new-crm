import { BASE_URL } from "@/lib/constants";

export const CATEGORIES_API = {
  list: `${BASE_URL}/api/panel-fetch-categories-list`,
  create: `${BASE_URL}/api/panel-create-categories`,
  dropdown: `${BASE_URL}/api/panel-fetch-categories`,
  byId: (id: string | number) => `${BASE_URL}/api/panel-fetch-categories-by-id/${id}`,
  update: (id: string | number) => `${BASE_URL}/api/panel-update-categories/${id}?_method=PUT`,
  subList: `${BASE_URL}/api/panel-fetch-sub-categories-list`,
  subCreate: `${BASE_URL}/api/panel-create-sub-categories`,
  subById: (id: string | number) => `${BASE_URL}/api/panel-fetch-sub-categories-by-id/${id}`,
  subUpdate: (id: string | number) => `${BASE_URL}/api/panel-update-sub-categories/${id}`,
} as const;

export function categoryTypeLabel(value: string | number | null | undefined): string {
  const v = String(value ?? "");
  if (v === "0") return "Business";
  if (v === "1") return "Service";
  if (v === "0,1") return "Business/Service";
  return "Unknown";
}
