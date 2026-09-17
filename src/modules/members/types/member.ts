export interface MemberRow {
  id: number;
  name: string;
  company_name: string;
  mobile: string;
  email: string;
  profile_type: string | number;
  category: string;
  sub_category: string | number;
  subcategory: string;
  other_category: string;
  other_sub_category: string;
  whatsapp: string;
  website: string;
  about_us: string;
  catg_id: string | number;
  area: string;
  photo: string | null;
  referred_by_code: string;
  referral_code: string;
  status: string;
}

export interface MemberForm {
  name: string;
  company_name: string;
  mobile: string;
  email: string;
  profile_type: string | number;
  category: string;
  sub_category: string | number;
  subcategory: string;
  other_category: string;
  other_sub_category: string;
  whatsapp: string;
  website: string;
  about_us: string;
  catg_id: string | number;
  area: string;
  photo: string;
  referred_by_code: string;
  status: string;
}

export interface MemberCategory {
  id: number;
  category: string;
  u_catg_status: string;
}

export interface MemberSubCategory {
  id: number;
  subcategory: string;
  u_subcatg_status: string;
}

export interface CategoryOption {
  id: number;
  category: string;
}

export interface SubCategoryOption {
  id: number;
  subcategory: string;
}
