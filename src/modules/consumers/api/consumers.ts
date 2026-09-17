import { BASE_URL } from "@/lib/constants";

export const CONSUMERS_API = {
  userList: `${BASE_URL}/api/panel-fetch-user-list`,
  holdUserList: `${BASE_URL}/api/panel-fetch-hold-users-list`,
  deletedUserList: `${BASE_URL}/api/panel-fetch-deleted-users-list`,
  updateUserStatus: (id: number | string) => `${BASE_URL}/api/panel-update-user-status/${id}`,
  deleteUser: (id: number | string) => `${BASE_URL}/api/panel-delete-users/${id}`,
  activateHoldUser: (id: number | string) => `${BASE_URL}/api/panel-update-hold-users-type/${id}`,
} as const;

export function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}
