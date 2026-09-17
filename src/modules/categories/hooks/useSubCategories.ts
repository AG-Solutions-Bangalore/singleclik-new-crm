import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { getToken } from "@/lib/auth-storage";
import { CATEGORIES_API } from "@/modules/categories/api/categories";
import type {
  SubCategoryAddFormState,
  SubCategoryEditFormState,
  SubCategoryRow,
} from "@/modules/categories/types/categories";

async function fetchSubCategoriesList(): Promise<SubCategoryRow[]> {
  const token = getToken();
  const response = await axios.get(CATEGORIES_API.subList, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return (response.data?.subcategories ?? []) as SubCategoryRow[];
}

export function useSubCategoriesList() {
  return useQuery({
    queryKey: ["categories", "sub-list"],
    queryFn: fetchSubCategoriesList,
  });
}

async function fetchSubCategoryDetail(id: string): Promise<any> {
  const res = await axios({
    url: CATEGORIES_API.subById(id),
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data?.categoriessub;
}

export function useSubCategoryDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["categories", "sub-detail", id],
    queryFn: () => fetchSubCategoryDetail(String(id ?? "")),
    enabled: !!id,
  });
}

export function useCreateSubCategory(options?: { onCreated?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: SubCategoryAddFormState): Promise<any> => {
      const data = {
        category: form.category,
        subcategory: form.subcategory,
      };

      const res = await axios({
        url: CATEGORIES_API.subCreate,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return res.data;
    },
    onSuccess: (res) => {
      if (res?.code == "200") {
        toast.success("Sub Category succesfull");
        queryClient.invalidateQueries({ queryKey: ["categories", "sub-list"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "detail"] });
        options?.onCreated?.();
      } else {
        toast.error("duplicate entry");
      }
    },
    onError: (error) => {
      console.error("Error creating sub category", error);
    },
  });
}

export function useUpdateSubCategory(
  id: string | undefined,
  options?: { onUpdated?: () => void }
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: SubCategoryEditFormState): Promise<any> => {
      const data = {
        category_id: form.category_id,
        subcategory: form.subcategory,
        subcategory_status: form.subcategory_status,
      };

      const res = await axios({
        url: CATEGORIES_API.subUpdate(String(id ?? "")),
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return res.data;
    },
    onSuccess: (res) => {
      if (res?.code == "200") {
        toast.success("update succesfull");
        queryClient.invalidateQueries({ queryKey: ["categories", "sub-list"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "sub-detail"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "detail"] });
        options?.onUpdated?.();
      } else {
        toast.error("duplicate entry");
      }
    },
    onError: (error) => {
      console.error("Error updating sub category", error);
    },
  });
}

export interface UpdateSubCategoryRowInput {
  rowId: string | number;
  data: {
    category_id: string | number | undefined;
    subcategory: string;
    subcategory_status: string;
  };
}

export function useUpdateSubCategoryRow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateSubCategoryRowInput): Promise<any> => {
      const data = {
        category_id: input.data.category_id,
        subcategory: input.data.subcategory,
        subcategory_status: input.data.subcategory_status,
      };

      const res = await axios({
        url: CATEGORIES_API.subUpdate(input.rowId),
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return res.data;
    },
    onSuccess: (res) => {
      if (res?.code == "200") {
        toast.success("Sub Category Updated");
        queryClient.invalidateQueries({ queryKey: ["categories", "sub-list"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "detail"] });
      } else {
        toast.error("duplicate entry");
      }
    },
    onError: (error) => {
      console.error("Error updating sub category", error);
    },
  });
}
