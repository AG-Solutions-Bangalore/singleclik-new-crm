import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared date formatter: "2026-10-10" -> "10 Oct 2026".
 * Returns "—" for empty/invalid values.
 */
export function formatDisplayDate(val?: string | null): string {
  if (!val) return "—";
  const raw = String(val).trim();
  if (!raw) return "—";
  // Date-only strings parsed as UTC shift the day in -TZ; treat as local.
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00` : raw);
  if (Number.isNaN(d.getTime())) return raw;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}
