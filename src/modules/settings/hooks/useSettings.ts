import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { PANEL_SEND_REMINDER_URL, authHeaders } from "../api/settings";

function responseMessage(data: Record<string, unknown>, fallback: string): string {
  if (typeof data.message === "string" && data.message) return data.message;
  if (typeof data.msg === "string" && data.msg) return data.msg;
  return fallback;
}

export function useSendReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => axios.get(PANEL_SEND_REMINDER_URL, { headers: authHeaders() }),
    onSuccess: (res) => {
      const data = (res.data ?? {}) as Record<string, unknown>;
      const failed =
        data.success === false ||
        data.status === "error" ||
        (data.code !== undefined && data.code != 200 && data.code !== "success");
      if (failed) {
        toast.error(responseMessage(data, "Failed to send reminder."));
        return;
      }
      toast.success(responseMessage(data, "Reminder sent successfully."));
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      console.error("Error sending reminder", error);
      toast.error("Failed to send reminder. Please try again.");
    },
  });
}
