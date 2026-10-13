import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createReferralProduct,
  fetchReferralClaimPointList,
  fetchReferralPointList,
  fetchReferralProductById,
  fetchReferralProductList,
  updateReferralClaimPointStatus,
  updateReferralProduct,
  updateReferralProductStatus,
} from "../api/referral.api";

export function useReferralProductList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["referral", "products"],
    queryFn: fetchReferralProductList,
    enabled: options?.enabled,
  });
}

export function useReferralProductDetail(id: string | number | undefined) {
  return useQuery({
    queryKey: ["referral", "products", "detail", String(id)],
    queryFn: () => fetchReferralProductById(id!),
    enabled: !!id,
  });
}

export interface CreateReferralProductInput {
  refferal_products_for: string;
  refferal_products: string;
  refferal_products_description?: string;
  refferal_products_points: string | number;
  refferal_product_validity?: string | number;
  selectedFile?: File | null;
}

export function useCreateReferralProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReferralProductInput) => {
      const formData = new FormData();
      formData.append("refferal_products_for", input.refferal_products_for);
      formData.append("refferal_products", input.refferal_products);
      formData.append(
        "refferal_products_description",
        input.refferal_products_description || "",
      );
      formData.append(
        "refferal_products_points",
        String(input.refferal_products_points ?? ""),
      );
      if (
        input.refferal_product_validity !== undefined &&
        input.refferal_product_validity !== null &&
        input.refferal_product_validity !== ""
      ) {
        formData.append(
          "refferal_product_validity",
          String(input.refferal_product_validity),
        );
      }
      if (input.selectedFile) {
        formData.append("refferal_products_image", input.selectedFile);
      }
      return createReferralProduct(formData);
    },
    onSuccess: (res) => {
      if (res.data?.code === 200 || res.status === 200) {
        toast.success(res.data?.msg || "Referral product created successfully");
        void queryClient.invalidateQueries({ queryKey: ["referral", "products"] });
      } else {
        toast.error(res.data?.msg || "Failed to create referral product");
      }
    },
    onError: (err: unknown) => {
      console.error("Create referral product error:", err);
      toast.error("Failed to create referral product");
    },
  });
}

export interface UpdateReferralProductInput {
  id: string | number;
  refferal_products_for: string;
  refferal_products: string;
  refferal_products_description?: string;
  refferal_products_points: string | number;
  refferal_product_validity?: string | number;
  refferal_products_status: string;
  selectedFile?: File | null;
}

export function useUpdateReferralProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateReferralProductInput) => {
      const formData = new FormData();
      formData.append("refferal_products_for", input.refferal_products_for);
      formData.append("refferal_products", input.refferal_products);
      formData.append(
        "refferal_products_description",
        input.refferal_products_description || "",
      );
      formData.append(
        "refferal_products_points",
        String(input.refferal_products_points ?? ""),
      );
      if (
        input.refferal_product_validity !== undefined &&
        input.refferal_product_validity !== null &&
        input.refferal_product_validity !== ""
      ) {
        formData.append(
          "refferal_product_validity",
          String(input.refferal_product_validity),
        );
      }
      formData.append("refferal_products_status", input.refferal_products_status);
      if (input.selectedFile) {
        formData.append("refferal_products_image", input.selectedFile);
      }
      return updateReferralProduct(input.id, formData);
    },
    onSuccess: (res) => {
      if (res.data?.code === 200 || res.status === 200) {
        toast.success(res.data?.msg || "Referral product updated successfully");
        void queryClient.invalidateQueries({ queryKey: ["referral", "products"] });
      } else {
        toast.error(res.data?.msg || "Failed to update referral product");
      }
    },
    onError: (err: unknown) => {
      console.error("Update referral product error:", err);
      toast.error("Failed to update referral product");
    },
  });
}

export function useUpdateReferralProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string | number; status: string }) => {
      const res = await updateReferralProductStatus(id, status);
      return { res, id, status };
    },
    onSuccess: ({ res, status }) => {
      if (res.data?.code === 200 || res.status === 200) {
        toast.success(`Product status set to ${status}`);
        void queryClient.invalidateQueries({ queryKey: ["referral", "products"] });
      } else {
        toast.error(res.data?.msg || "Failed to update status");
      }
    },
    onError: (err: unknown) => {
      console.error("Update referral product status error:", err);
      toast.error("Failed to update product status");
    },
  });
}

export function useReferralPointList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["referral", "points"],
    queryFn: fetchReferralPointList,
    enabled: options?.enabled,
  });
}

export function useReferralClaimList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["referral", "claims"],
    queryFn: fetchReferralClaimPointList,
    enabled: options?.enabled,
  });
}

export function useUpdateReferralClaimStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string | number; status: string }) => {
      const res = await updateReferralClaimPointStatus(id, status);
      return { res, id, status };
    },
    onSuccess: ({ res, status }) => {
      if (res.data?.code === 200 || res.status === 200) {
        toast.success(`Claim status updated to ${status}`);
        void queryClient.invalidateQueries({ queryKey: ["referral", "claims"] });
      } else {
        toast.error(res.data?.msg || "Failed to update claim status");
      }
    },
    onError: (err: unknown) => {
      console.error("Update referral claim status error:", err);
      toast.error("Failed to update claim status");
    },
  });
}
