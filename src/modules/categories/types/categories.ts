export interface CategoryRow {
  id: number;
  category: string;
  category_type: string;
  category_status: string;
  category_image?: string | null;
  category_sort?: string | number;
}

export interface CategoryFormState {
  category: string;
  category_type: string;
  category_image: string;
  category_sort: string;
}

export interface CategoryEditFormState extends CategoryFormState {
  category_status: string;
}

export interface CategoryUser {
  id?: number;
  name: string;
  photo?: string | null;
}

export interface SubCategoryRow {
  id: number;
  category?: string;
  category_id?: string | number;
  subcategory: string;
  subcategory_status: string;
}

export interface SubCategoryAddFormState {
  category: string;
  subcategory: string;
}

export interface SubCategoryEditFormState {
  category_id: string;
  subcategory: string;
  subcategory_status: string;
}
