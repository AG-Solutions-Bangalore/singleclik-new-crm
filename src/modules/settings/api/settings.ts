import { BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth-storage";

export const PANEL_SEND_REMINDER_URL = `${BASE_URL}/api/panel-send-reminder`;

export function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}
