import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "@/lib/auth-storage";
import { MEMBERS_API } from "../api/members";
import type { MemberForm } from "../types/member";

function invalidateCategoryView(queryClient: QueryClient, memberId: string | undefined) {
  queryClient.invalidateQueries({ queryKey: ["members", "category-view", memberId] });
  queryClient.invalidateQueries({ queryKey: ["members", "detail", memberId] });
}

export interface UpdateMemberVariables {
  member: MemberForm;
  selectedSubCategoryValue: string;
  file: File | null;
}

export function useUpdateMember(id: string | undefined, onUpdated?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ member, selectedSubCategoryValue, file }: UpdateMemberVariables) => {
      const formData = new FormData();
      const record = member as unknown as Record<string, string | number | undefined>;
      Object.keys(record).forEach((key) => {
        if (key === "category") {
          formData.append("category", String(member.catg_id));
        } else if (key === "sub_category") {
          formData.append("sub_category", String(member.sub_category));
        } else if (key === "subcategory") {
          formData.append("subcategory", selectedSubCategoryValue);
        } else {
          formData.append(key, String(record[key]));
        }
      });

      if (file) formData.append("photo", file);
      const response = await axios.post(MEMBERS_API.update(id ?? ""), formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.code == "200") {
        toast.success("update succesfull");
        onUpdated?.();
      } else if (data?.code == "401") {
        toast.error("Mobile No Duplicate Entry");
      } else {
        toast.error("Email Id Duplicate Entry");
      }
      queryClient.invalidateQueries({ queryKey: ["members", "list"] });
      queryClient.invalidateQueries({ queryKey: ["members", "detail", id] });
    },
    onError: (error) => {
      console.error("Error updating member:", error);
      toast.error("Error updating member");
    },
  });
}

export function useUpdateCategoryStatus(
  memberId: string | undefined,
  onToggled?: (id: number) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rowId: number) => {
      const token = getToken();
      const res = await axios({
        url: MEMBERS_API.updateCategoryStatus(rowId),
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (data, rowId) => {
      if (data?.code == "200") {
        onToggled?.(rowId);
      } else {
        toast.error("Errro occur while Inactive the Category");
      }
      invalidateCategoryView(queryClient, memberId);
    },
    onError: (error) => {
      console.error("Error fetching Category activate data", error);
      toast.error("Error fetching Category activate data");
    },
  });
}

export function useUpdateSubCategoryStatus(
  memberId: string | undefined,
  onToggled?: (id: number) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rowId: number) => {
      const token = getToken();
      const res = await axios({
        url: MEMBERS_API.updateSubCategoryStatus(rowId),
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (data, rowId) => {
      if (data?.code == "200") {
        onToggled?.(rowId);
      } else {
        toast.error("Errro occur while Inactive the SubCategory");
      }
      invalidateCategoryView(queryClient, memberId);
    },
    onError: (error) => {
      console.error("Error fetching SubCategory activate data", error);
      toast.error("Error fetching SubCategory activate data");
    },
  });
}

export function useDeleteCategory(
  memberId: string | undefined,
  onDeleted?: (id: number) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rowId: number) => {
      const token = getToken();
      const res = await axios({
        url: MEMBERS_API.deleteCategory(rowId),
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (data, rowId) => {
      if (data?.code == "200") {
        onDeleted?.(rowId);
      } else {
        toast.error("Errro occur while delete the  Category");
      }
      invalidateCategoryView(queryClient, memberId);
    },
    onError: (error) => {
      console.error("Error Category delete data", error);
      toast.error("Error Category delete data");
    },
  });
}

export function useDeleteSubCategory(
  memberId: string | undefined,
  onDeleted?: (id: number) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rowId: number) => {
      const token = getToken();
      const res = await axios({
        url: MEMBERS_API.deleteSubCategory(rowId),
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (data, rowId) => {
      if (data?.code == "200") {
        onDeleted?.(rowId);
      } else {
        toast.error("Errro occur while delete the  SubCategory");
      }
      invalidateCategoryView(queryClient, memberId);
    },
    onError: (error) => {
      console.error("Error SubCategory delete data", error);
      toast.error("Error SubCategory delete data");
    },
  });
}

export interface AssignCategoryCallbacks {
  onCreated?: () => void;
  onFailure?: (message: string) => void;
}

export function useCreateCategoryMember(
  memberId: string | undefined,
  callbacks?: AssignCategoryCallbacks
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (catgId: string) => {
      const response = await axios.post(
        MEMBERS_API.createCategory,
        {
          u_id: memberId,
          u_catg_id: catgId,
          u_catg_other_sub_category: "",
          u_catg_other_category: "",
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.code == "200") {
        toast.success("Category Added Succesfully");
        callbacks?.onCreated?.();
      } else {
        callbacks?.onFailure?.(data?.message || "Failed to add sub-category");
      }
      invalidateCategoryView(queryClient, memberId);
    },
    onError: (error) => {
      console.error("Error submitting form:", error);
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      callbacks?.onFailure?.(message || "Failed to submit form");
    },
  });
}

export function useCreateSubCategoryMember(
  memberId: string | undefined,
  callbacks?: AssignCategoryCallbacks
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subCatgId: string) => {
      const response = await axios.post(
        MEMBERS_API.createSubCategory,
        {
          u_id: memberId,
          u_subcatg_id: subCatgId,
          u_subcatg_other_sub_category: "",
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.code == "200") {
        toast.success("SubCategory Added Succesfully");
        callbacks?.onCreated?.();
      } else {
        callbacks?.onFailure?.(data?.message || "Failed to add sub-category");
      }
      invalidateCategoryView(queryClient, memberId);
    },
    onError: (error) => {
      console.error("Error submitting form:", error);
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      callbacks?.onFailure?.(message || "Failed to submit form");
    },
  });
}
