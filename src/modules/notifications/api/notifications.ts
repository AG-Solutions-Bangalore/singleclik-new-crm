import { BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth-storage";

export const NOTIFICATIONS_API = {
  list: `${BASE_URL}/api/fetch-notification-list`,
  create: `${BASE_URL}/api/panel-create-notification`,
  byId: (id: number | string) => `${BASE_URL}/api/panel-fetch-notification-by-id/${id}`,
  update: (id: number | string) => `${BASE_URL}/api/panel-update-notification/${id}?_method=PUT`,
} as const;

export function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}
