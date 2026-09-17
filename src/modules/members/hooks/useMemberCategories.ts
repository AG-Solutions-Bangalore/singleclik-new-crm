import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "@/lib/auth-storage";
import { MEMBERS_API } from "../api/members";
import type { CategoryOption, SubCategoryOption } from "../types/member";

export function useMemberCategories() {
  return useQuery({
    queryKey: ["members", "categories"],
    queryFn: async (): Promise<CategoryOption[]> => {
      const response = await axios.get(MEMBERS_API.categories, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data.categories;
    },
  });
}

export function useUserCategories(memberId: string | undefined) {
  return useQuery({
    queryKey: ["members", "user-categories", memberId],
    queryFn: async (): Promise<CategoryOption[]> => {
      const response = await axios.get(MEMBERS_API.userCategoriesById(memberId ?? ""), {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data?.categories;
    },
    enabled: !!memberId,
  });
}

export function useSubCategoriesByValue(catgId: string | number) {
  return useQuery({
    queryKey: ["members", "subcategories", String(catgId)],
    queryFn: async (): Promise<SubCategoryOption[]> => {
      const response = await axios.get(MEMBERS_API.subCategoriesByValue(catgId || ""), {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data.categoriessub;
    },
    enabled: !!catgId,
  });
}

export function useRegisterSubCategoriesByValue(catgId: string) {
  return useQuery({
    queryKey: ["members", "register-subcategories", catgId],
    queryFn: async (): Promise<SubCategoryOption[]> => {
      const response = await axios.get(
        MEMBERS_API.registerSubCategoriesByValue(catgId || ""),
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data.categoriessub || [];
    },
    enabled: !!catgId,
  });
}
