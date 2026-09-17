import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "@/lib/auth-storage";
import { MEMBERS_API } from "../api/members";

async function fetchMemberById(id: string) {
  const response = await axios.get(MEMBERS_API.byId(id), {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
}

export function useMemberDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["members", "detail", id],
    queryFn: () => fetchMemberById(id ?? ""),
    enabled: !!id,
  });
}

export function useCategoryView(memberId: string | undefined) {
  return useQuery({
    queryKey: ["members", "category-view", memberId],
    queryFn: () => fetchMemberById(memberId ?? ""),
    enabled: !!memberId,
  });
}
