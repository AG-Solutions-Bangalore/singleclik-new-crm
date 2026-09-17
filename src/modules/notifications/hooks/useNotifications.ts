import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { NOTIFICATIONS_API, authHeaders } from "../api/notifications";
import type { NotificationForm, NotificationRow } from "../types/notifications";

export function useNotificationList() {
  return useQuery({
    queryKey: ["notifications", "list"],
    queryFn: async (): Promise<NotificationRow[]> => {
      const response = await axios.get(NOTIFICATIONS_API.list, {
        headers: authHeaders(),
      });
      return (response.data?.notification ?? []) as NotificationRow[];
    },
  });
}

export function useNotificationDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["notifications", "detail", id],
    queryFn: async (): Promise<NotificationForm> => {
      const response = await axios.get(NOTIFICATIONS_API.byId(id ?? ""), {
        headers: authHeaders(),
      });
      return response.data.notification as NotificationForm;
    },
    enabled: !!id,
  });
}

export interface CreateNotificationVariables {
  notification_heading: string;
  notification_des: string;
  selectedFile: File | null;
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: CreateNotificationVariables) => {
      const data = new FormData();
      data.append("notification_heading", vars.notification_heading);
      data.append("notification_des", vars.notification_des);
      data.append("notification_images", vars.selectedFile ?? "null");
      const res = await axios({
        url: NOTIFICATIONS_API.create,
        method: "POST",
        data,
        headers: authHeaders(),
      });
      return res;
    },
    onSuccess: (res) => {
      if (res.data.code == "200") {
        toast.success("Notification Create  succesfull");
      } else {
        toast.error("duplicate entry");
      }
      queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
    },
  });
}

export interface UpdateNotificationVariables {
  id: string;
  notification_heading: string;
  notification_des: string;
  notification_status: string;
  selectedFile: File | null;
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: UpdateNotificationVariables) => {
      const data = new FormData();
      data.append("notification_heading", vars.notification_heading);
      data.append("notification_des", vars.notification_des);
      data.append("notification_images", vars.selectedFile ?? "null");
      data.append("notification_status", vars.notification_status);
      const response = await axios.post(NOTIFICATIONS_API.update(vars.id), data, {
        headers: authHeaders(),
      });
      return { response, id: vars.id };
    },
    onSuccess: ({ response, id }) => {
      if (response.data.code == "200") {
        toast.success("Notification updated successfully");
      } else {
        toast.error("Duplicate entry");
      }
      queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "detail", id] });
    },
  });
}
