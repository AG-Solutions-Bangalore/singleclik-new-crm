import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth-storage";
import type {
  ReferralClaimPoint,
  ReferralPoint,
  ReferralProduct,
} from "../types/referral";

export const REFERRAL_API = {
  productList: `${BASE_URL}/api/fetch-refferal-product-list`,
  productCreate: `${BASE_URL}/api/panel-create-refferal-product`,
  productById: (id: string | number) =>
    `${BASE_URL}/api/panel-fetch-refferal-product-by-id/${id}`,
  productUpdate: (id: string | number) =>
    `${BASE_URL}/api/panel-update-refferal-product/${id}?_method=PUT`,
  productUpdateStatus: (id: string | number) =>
    `${BASE_URL}/api/panel-update-refferal-product-status/${id}`,
  pointList: `${BASE_URL}/api/fetch-refferal-point-list`,
  claimList: `${BASE_URL}/api/fetch-refferal-claim-point-list`,
  claimUpdateStatus: (id: string | number) =>
    `${BASE_URL}/api/panel-update-refferal-claim-point-status/${id}`,
} as const;

export function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function fetchReferralProductList(): Promise<{
  data: ReferralProduct[];
  image_url: string;
}> {
  const response = await axios.get(REFERRAL_API.productList, {
    headers: authHeaders(),
  });
  return {
    data: (response.data?.data || []) as ReferralProduct[],
    image_url:
      response.data?.image_url ||
      "https://singleclik.com/api/storage/app/public/refferalproducts_images/",
  };
}

export async function fetchReferralProductById(
  id: string | number,
): Promise<{ data: ReferralProduct; image_url: string }> {
  const response = await axios.get(REFERRAL_API.productById(id), {
    headers: authHeaders(),
  });
  return {
    data: response.data?.data as ReferralProduct,
    image_url:
      response.data?.image_url ||
      "https://singleclik.com/api/storage/app/public/refferalproducts_images/",
  };
}

export function createReferralProduct(formData: FormData) {
  return axios.post(REFERRAL_API.productCreate, formData, {
    headers: authHeaders(),
  });
}

export function updateReferralProduct(
  id: string | number,
  formData: FormData,
) {
  return axios.post(REFERRAL_API.productUpdate(id), formData, {
    headers: authHeaders(),
  });
}

export function updateReferralProductStatus(
  id: string | number,
  status: string,
) {
  return axios.put(
    REFERRAL_API.productUpdateStatus(id),
    { refferal_products_status: status },
    { headers: authHeaders() },
  );
}

export async function fetchReferralPointList(): Promise<ReferralPoint[]> {
  const response = await axios.get(REFERRAL_API.pointList, {
    headers: authHeaders(),
  });
  return (response.data?.data || []) as ReferralPoint[];
}

export async function fetchReferralClaimPointList(): Promise<ReferralClaimPoint[]> {
  const response = await axios.get(REFERRAL_API.claimList, {
    headers: authHeaders(),
  });
  return (response.data?.data || []) as ReferralClaimPoint[];
}

export function updateReferralClaimPointStatus(
  id: string | number,
  status: string,
) {
  return axios.put(
    REFERRAL_API.claimUpdateStatus(id),
    { refferal_claim_point_status: status },
    { headers: authHeaders() },
  );
}
