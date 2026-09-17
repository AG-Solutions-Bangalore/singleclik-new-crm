export interface ConsumerRow {
  id: number;
  name?: string | null;
  company_name?: string | null;
  mobile?: string | null;
  photo?: string | null;
  profile_type?: string | number | null;
  status?: string | null;
}

export function profileTypeLabel(value: ConsumerRow["profile_type"]): string {
  const normalized = String(value ?? "");
  if (normalized === "0") return "Business";
  if (normalized === "1") return "Service";
  if (normalized === "0,1") return "Business/Service";
  return "Unknown";
}
