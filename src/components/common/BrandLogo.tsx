import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function BrandMark({ invert = false, className }: { invert?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold tracking-tight shadow-sm transition-transform",
        invert
          ? "bg-[#FAF8F5] text-[#18181B] ring-1 ring-white/20"
          : "bg-[#18181B] text-[#F0E6D8] ring-1 ring-black/10 dark:bg-[#F0E6D8] dark:text-[#18181B]",
        className
      )}
    >
      <span className="relative flex items-center gap-0.5">
        <span>S</span>
        <span className="text-[#8B5E3C] dark:text-[#C89968]">C</span>
      </span>
      <span
        className={cn(
          "absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2",
          invert
            ? "border-[#18181B] bg-[#8B5E3C]"
            : "border-white bg-[#10B981] dark:border-[#18181B]"
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
              isDark ? "text-[#FAF8F5]" : "text-[#1C1917] dark:text-[#FAF8F5]"
            )}
          >
            Single<span className="text-[#8B5E3C] dark:text-[#C89968]">Clik</span>
          </span>
          <span
            className={cn(
              "mt-1 text-[9px] font-semibold tracking-[0.14em] uppercase",
              isDark ? "text-[#A1A1AA]" : "text-[#78716C] dark:text-[#A1A1AA]"
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
