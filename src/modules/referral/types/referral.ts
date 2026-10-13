export interface ReferralProduct {
  id: number;
  refferal_products_for: string; // "1" (Business), "2" (Consumer), or "1,2" (Both)
  refferal_products: string;
  refferal_products_description?: string | null;
  refferal_products_points: string | number;
  refferal_product_validity?: number | string | null;
  refferal_products_image?: string | null;
  refferal_products_status: string;
  created_by?: string | null;
  created_at?: string | null;
  updated_by?: string | null;
  updated_at?: string | null;
}

export interface ReferralProductFormState {
  refferal_products_for: string;
  refferal_products: string;
  refferal_products_description: string;
  refferal_products_points: string;
  refferal_product_validity: string;
  refferal_products_image?: string | null;
  refferal_products_status: string;
}

export interface ReferralPoint {
  id: number;
  refferal_from_id: number;
  referred_to_id: number;
  refferal_point: string;
  refferal_point_date: string;
  reffer_user?: {
    id: number;
    name: string;
  } | null;
  referred_user?: {
    id: number;
    name: string;
  } | null;
}

export interface ReferralClaimPoint {
  id: number;
  user_id: number;
  refferal_claim_point: string;
  refferal_claim_created_date: string;
  refferal_claim_validity_date?: string | null;
  refferal_product_id: number;
  refferal_claim_point_status: string;
  user?: {
    id: number;
    name: string;
  } | null;
  claim_products?: {
    id: number;
    refferal_products: string;
  } | null;
}

export function referralTargetLabel(val?: string | null): string {
  const v = String(val ?? "").trim();
  if (v === "1") return "Business";
  if (v === "2") return "Consumer";
  if (v === "1,2" || v === "2,1") return "Both (Business & Consumer)";
  return v || "All";
}


