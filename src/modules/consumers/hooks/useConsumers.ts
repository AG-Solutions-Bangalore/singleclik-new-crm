import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { CONSUMERS_API, authHeaders } from "../api/consumers";
import type { ConsumerRow } from "../types/consumers";

export function useConsumerList() {
  return useQuery({
    queryKey: ["consumers", "list"],
    queryFn: async (): Promise<ConsumerRow[]> => {
      const response = await axios.get(CONSUMERS_API.userList, {
        headers: authHeaders(),
      });
      return (response.data?.user ?? []) as ConsumerRow[];
    },
  });
}

export function useHoldConsumerList() {
  return useQuery({
    queryKey: ["consumers", "hold"],
    queryFn: async (): Promise<ConsumerRow[]> => {
      const response = await axios.get(CONSUMERS_API.holdUserList, {
        headers: authHeaders(),
      });
      return (response.data?.user ?? []) as ConsumerRow[];
    },
  });
}

export function useDeletedConsumerList() {
  return useQuery({
    queryKey: ["consumers", "deleted"],
    queryFn: async (): Promise<ConsumerRow[]> => {
      const response = await axios.get(CONSUMERS_API.deletedUserList, {
        headers: authHeaders(),
      });
      return (response.data?.user ?? []) as ConsumerRow[];
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios({
        url: CONSUMERS_API.updateUserStatus(id),
        method: "PUT",
        headers: authHeaders(),
      });
      return { res, id };
    },
    onSuccess: ({ res, id }) => {
      if (res.data.code == "200") {
        const prev = queryClient.getQueryData<ConsumerRow[]>(["consumers", "list"]) ?? [];
        const target = prev.find((user) => user.id === id);
        if (target) {
          const newStatus = target.status === "Active" ? "Inactive" : "Active";
          if (newStatus === "Active") {
            toast.success("User Activated Successfully");
          } else {
            toast.success("User Inactivated Successfully");
          }
          queryClient.setQueryData<ConsumerRow[]>(["consumers", "list"], (old) =>
            (old ?? []).map((user) =>
              user.id === id ? { ...user, status: newStatus } : user,
            ),
          );
        }
      } else {
        toast.error("Errro occur while Inactive the profile");
      }
      queryClient.invalidateQueries({ queryKey: ["consumers", "list"] });
    },
    onError: (error) => {
      console.error("Error fetching user activate data", error);
      toast.error("Error fetching user activate data");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios({
        url: CONSUMERS_API.deleteUser(id),
        method: "PUT",
        headers: authHeaders(),
      });
      return { res, id };
    },
    onSuccess: ({ res, id }) => {
      if (res.data.code == "200") {
        toast.success("User Deleted  succesfully");
        queryClient.setQueryData<ConsumerRow[]>(["consumers", "list"], (old) =>
          (old ?? []).filter((user) => user.id !== id && user.status === user.status),
        );
      } else {
        toast.error("Errro occur while delete the user profile");
      }
      queryClient.invalidateQueries({ queryKey: ["consumers", "list"] });
    },
    onError: (error) => {
      console.error("Error user delete data", error);
      toast.error("Error user delete data");
    },
  });
}

export function useActivateHoldUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios({
        url: CONSUMERS_API.activateHoldUser(id),
        method: "PUT",
        headers: authHeaders(),
      });
      return res;
    },
    onSuccess: (res) => {
      if (res.data.code == "200") {
        toast.success("User Activate succesfully");
      } else {
        toast.error("Errro occur while activate the profile");
      }
      queryClient.invalidateQueries({ queryKey: ["consumers", "hold"] });
    },
    onError: (error) => {
      console.error("Error fetching user hold activate data", error);
      toast.error("Error fetching user hold activate data");
    },
  });
}
