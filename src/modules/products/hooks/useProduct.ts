import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, fetchProductById, fetchProductList, updateProduct } from "../api/product";

export function useProductList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["products", "list"],
    queryFn: fetchProductList,
    enabled: options?.enabled,
  });
}

export function useProductDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}

export interface CreateProductInput {
  product_name: string;
  selectedFile: File | null;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => {
      const data = new FormData();
      data.append("product_name", input.product_name);
      data.append("product_images", input.selectedFile as unknown as Blob);
      return createProduct(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export interface UpdateProductInput {
  id: string | undefined;
  product_name: string;
  product_status: string;
  selectedFile: File | null;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProductInput) => {
      const formData = new FormData();
      formData.append("product_name", input.product_name);
      formData.append("product_status", input.product_status);
      formData.append("product_images", input.selectedFile as unknown as Blob);
      return updateProduct(input.id, formData);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
