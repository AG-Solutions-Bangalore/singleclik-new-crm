export interface ProductRow {
  id: number;
  product_images?: string | null;
  product_name?: string;
  product_status?: string;
}

export interface ProductFormState {
  product_images: string;
  product_name: string;
  product_status: string;
}
