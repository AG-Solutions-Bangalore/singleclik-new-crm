import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "@/lib/auth-storage";
import { CATEGORIES_API } from "@/modules/categories/api/categories";
import type {
  CategoryEditFormState,
  CategoryFormState,
  CategoryRow,
  CategoryUser,
  SubCategoryRow,
} from "@/modules/categories/types/categories";

export interface CategoryDetailData {
  categories: CategoryEditFormState;
  user: CategoryUser[];
  categoriessub: SubCategoryRow[];
}

async function fetchCategoriesList(): Promise<CategoryRow[]> {
  const token = getToken();
  const response = await axios.get(CATEGORIES_API.list, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return (response.data?.categories ?? []) as CategoryRow[];
}

export function useCategoriesList() {
  return useQuery({
    queryKey: ["categories", "list"],
    queryFn: fetchCategoriesList,
  });
}

async function fetchCategoryDetail(id: string): Promise<CategoryDetailData> {
  const response = await axios.get(CATEGORIES_API.byId(id), {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data as CategoryDetailData;
}

export function useCategoryDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["categories", "detail", id],
    queryFn: () => fetchCategoryDetail(String(id ?? "")),
    enabled: !!id,
  });
}

async function fetchCategoriesDropdown(): Promise<CategoryRow[]> {
  const token = getToken();
  const response = await axios.get(CATEGORIES_API.dropdown, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return (response.data?.categories ?? []) as CategoryRow[];
}

export function useCategoriesDropdown() {
  return useQuery({
    queryKey: ["categories", "dropdown"],
    queryFn: fetchCategoriesDropdown,
  });
}

export interface CreateCategoryInput {
  form: CategoryFormState;
  file: File | null;
}

export function useCreateCategory(options?: { onCreated?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCategoryInput): Promise<any> => {
      const data = new FormData();
      data.append("category", input.form.category);
      data.append("category_type", input.form.category_type);
      data.append("category_sort", input.form.category_sort);
      if (input.file) {
        data.append("category_image", input.file);
      }

      const res = await axios({
        url: CATEGORIES_API.create,
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
        queryClient.invalidateQueries({ queryKey: ["categories", "list"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "dropdown"] });
        options?.onCreated?.();
      } else {
        toast.error("duplicate entry");
      }
    },
    onError: (error) => {
      console.error("Error creating category", error);
    },
  });
}

export interface UpdateCategoryInput {
  form: CategoryEditFormState;
  file: File | null;
}

export function useUpdateCategory(
  id: string | undefined,
  options?: { onUpdated?: () => void }
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateCategoryInput): Promise<any> => {
      const formData = new FormData();
      formData.append("category", input.form.category);
      formData.append("category_status", input.form.category_status);
      formData.append("category_type", input.form.category_type);
      formData.append("category_sort", input.form.category_sort);
      if (input.file) {
        formData.append("category_image", input.file);
      }

      const response = await axios.post(
        CATEGORIES_API.update(String(id ?? "")),
        formData,
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
        toast.success("Category updated successfully");
        queryClient.invalidateQueries({ queryKey: ["categories", "list"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "detail"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "dropdown"] });
        options?.onUpdated?.();
      } else {
        toast.error("Duplicate entry");
      }
    },
    onError: (error) => {
      console.error("Error updating category:", error);
    },
  });
}
