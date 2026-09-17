import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function BrandMark({ invert = false, className }: { invert?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold tracking-tight shadow-sm transition-transform group-hover:scale-105",
        invert
          ? "bg-white text-blue-600 ring-1 ring-white/20"
          : "bg-blue-600 text-white shadow-blue-500/20 dark:bg-blue-600 dark:text-white",
        className
      )}
    >
      <span className="relative flex items-center gap-0.5">
        <span>S</span>
        <span className={invert ? "text-blue-700" : "text-blue-200"}>C</span>
      </span>
      <span
        className={cn(
          "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2",
          invert
            ? "border-blue-600 bg-emerald-400"
            : "border-white bg-emerald-500 dark:border-slate-900"
        )}
      />
    </span>
  );
}

interface BrandLogoProps {
  tone?: "default" | "on-primary" | "on-dark";
  to?: string;
  onNavigate?: () => void;
  className?: string;
  compact?: boolean;
}

function BrandLogo({
  tone = "default",
  to = "/home",
  onNavigate,
  className,
  compact = false,
}: BrandLogoProps) {
  const isDark = tone === "on-primary" || tone === "on-dark";

  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn("group flex items-center gap-3 transition-opacity hover:opacity-95", className)}
    >
      <BrandMark invert={isDark} />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[17px] font-bold tracking-tight",
              isDark ? "text-white" : "text-slate-900 dark:text-white"
            )}
          >
            Single<span className="text-blue-600 dark:text-blue-400">Clik</span>
          </span>
          <span
            className={cn(
              "mt-1 text-[9px] font-semibold tracking-[0.14em] uppercase",
              isDark ? "text-blue-200" : "text-slate-500 dark:text-slate-400"
            )}
          >
            Verified CRM · Privacy First
          </span>
        </span>
      )}
    </Link>
  );
}

export { BrandLogo, BrandMark };
