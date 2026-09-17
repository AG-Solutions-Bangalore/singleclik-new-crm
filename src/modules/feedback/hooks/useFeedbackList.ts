import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FEEDBACK_LIST_URL } from "@/modules/feedback/api/feedback.api";
import type { FeedbackRow } from "@/modules/feedback/types/feedback.types";

async function fetchFeedbackList(): Promise<FeedbackRow[]> {
  const token = localStorage.getItem("token");
  const response = await axios.get(FEEDBACK_LIST_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return (response.data?.feedback ?? []) as FeedbackRow[];
}

export function useFeedbackList() {
  return useQuery({
    queryKey: ["feedback", "list"],
    queryFn: fetchFeedbackList,
  });
}
