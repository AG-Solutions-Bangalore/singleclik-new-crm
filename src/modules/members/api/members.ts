import { BASE_URL } from "@/lib/constants";

const panel = (path: string): string => `${BASE_URL}${path}`;

export const MEMBERS_API = {
  list: panel("/api/panel-fetch-member-list"),
  byId: (id: string | number) => panel(`/api/panel-fetch-member-by-id/${id}`),
  hold: (id: string | number) => panel(`/api/panel-convert-business-consumer/${id}`),
  update: (id: string | number) => panel(`/api/panel-update-member/${id}?_method=PUT`),
  categories: panel("/api/panel-fetch-categories"),
  subCategoriesByValue: (catgId: string | number) =>
    panel(`/api/panel-fetch-sub-categories-by-value/${catgId || ""}`),
  updateCategoryStatus: (id: string | number) =>
    panel(`/api/panel-update-user-categories-status/${id}`),
  updateSubCategoryStatus: (id: string | number) =>
    panel(`/api/panel-update-user-sub-categories-status/${id}`),
  deleteCategory: (id: string | number) => panel(`/api/panel-delete-user-categories/${id}`),
  deleteSubCategory: (id: string | number) =>
    panel(`/api/panel-delete-user-sub-categories/${id}`),
  createCategory: panel("/api/panel-create-user-categories"),
  createSubCategory: panel("/api/panel-create-user-sub-categories"),
  userCategoriesById: (id: string | number) =>
    panel(`/api/panel-fetch-user-categories-by-id/${id}`),
  registerSubCategoriesByValue: (catgId: string | number) =>
    panel(`/api/panel-fetch-register-sub-categories-by-value/${catgId || ""}`),
} as const;
