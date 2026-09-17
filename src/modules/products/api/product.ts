import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import type { ProductFormState, ProductRow } from "../types/product";

export const PRODUCT_LIST_URL = `${BASE_URL}/api/panel-fetch-product-list`;
export const PRODUCT_CREATE_URL = `${BASE_URL}/api/panel-create-product`;
export const productByIdUrl = (id: string | undefined) =>
  `${BASE_URL}/api/panel-fetch-member-product-by-id/${id}`;
export const productUpdateUrl = (id: string | undefined) =>
  `${BASE_URL}/api/panel-update-product/${id}?_method=PUT`;

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

export async function fetchProductList(): Promise<ProductRow[]> {
  const response = await axios.get(PRODUCT_LIST_URL, { headers: authHeaders() });
  return (response.data?.product || []) as ProductRow[];
}

export async function fetchProductById(id: string | undefined): Promise<ProductFormState> {
  const response = await axios.get(productByIdUrl(id), { headers: authHeaders() });
  return response.data.product as ProductFormState;
}

export function createProduct(data: FormData) {
  return axios({
    url: PRODUCT_CREATE_URL,
    method: "POST",
    data,
    headers: authHeaders(),
  });
}

export function updateProduct(id: string | undefined, data: FormData) {
  return axios.post(productUpdateUrl(id), data, { headers: authHeaders() });
}
