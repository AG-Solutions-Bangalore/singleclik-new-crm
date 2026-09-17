import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { MEMBERS_API } from "../api/members";
import type { MemberRow } from "../types/member";

async function fetchMembersList(): Promise<MemberRow[] | null> {
  const token = localStorage.getItem("token");
  const response = await axios.get(MEMBERS_API.list, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data?.user ?? null;
}

export function useMembersList() {
  return useQuery({
    queryKey: ["members", "list"],
    queryFn: fetchMembersList,
  });
}

export function useHoldMember(onHeld?: (id: number) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("token");
      const res = await axios({
        url: MEMBERS_API.hold(id),
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (data, id) => {
      if (data?.code == "200") {
        toast.success("Member Hold  succesfully");
        onHeld?.(id);
      } else {
        toast.error("Member Cannot be Hold");
      }
      queryClient.invalidateQueries({ queryKey: ["members", "list"] });
    },
    onError: (error) => {
      console.error("Error Meber hol data", error);
      toast.error("Error member hold data");
    },
  });
}
