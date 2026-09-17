import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export type StatVariant = "amber" | "blue" | "mint" | "purple" | "default";

interface StatCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: string;
  hint?: string;
  variant?: StatVariant;
  badge?: string;
  className?: string;
}

const variantStyles: Record<
  StatVariant,
  {
    card: string;
    iconBox: string;
    badge: string;
  }
> = {
  amber: {
    card: "bg-amber-50/70 border-amber-200 hover:border-amber-300 dark:bg-amber-950/20 dark:border-amber-900/40",
    iconBox: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
  blue: {
    card: "bg-[#EFF6FF] border-[#DBEAFE] hover:border-[#BFDBFE] dark:bg-[#141F32] dark:border-[#1E3252]",
    iconBox: "bg-[#DBEAFE] text-[#1D4ED8] dark:bg-[#1E3252] dark:text-[#93C5FD]",
    badge: "bg-[#DBEAFE] text-[#1D4ED8] dark:bg-[#1E3252] dark:text-[#93C5FD]",
  },
  mint: {
    card: "bg-[#ECFDF5] border-[#D1FAE5] hover:border-[#A7F3D0] dark:bg-[#12261E] dark:border-[#1C3E30]",
    iconBox: "bg-[#D1FAE5] text-[#047857] dark:bg-[#1C3E30] dark:text-[#6EE7B7]",
    badge: "bg-[#D1FAE5] text-[#047857] dark:bg-[#1C3E30] dark:text-[#6EE7B7]",
  },
  purple: {
    card: "bg-[#F5F3FF] border-[#EDE9FE] hover:border-[#DDD6FE] dark:bg-[#1E1932] dark:border-[#322752]",
    iconBox: "bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#322752] dark:text-[#C4B5FD]",
    badge: "bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#322752] dark:text-[#C4B5FD]",
  },
  default: {
    card: "bg-surface-container-lowest border-outline hover:border-primary/40",
    iconBox: "bg-surface-container-low text-on-surface",
    badge: "bg-surface-container text-on-surface-variant",
  },
};

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  hint,
  variant = "default",
  badge,
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "group relative flex items-center justify-between gap-3.5 rounded-2xl border p-4.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        styles.card,
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
            accent || styles.iconBox
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-label-sm font-medium text-on-surface-variant">
            {label}
          </p>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-on-surface tabular-nums sm:text-3xl">
              {value}
            </span>
            {badge && (
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold tracking-tight tabular-nums",
                  styles.badge
                )}
              >
                {badge}
              </span>
            )}
          </div>
          {hint ? (
            <p className="mt-0.5 truncate text-[12px] text-on-surface-variant/90 font-normal">
              {hint}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { StatCard };
