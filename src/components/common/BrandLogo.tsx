import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function BrandMark({ invert = false, className }: { invert?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold shadow-sm",
        invert ? "bg-white text-primary" : "bg-primary text-white",
        className
      )}
    >
      SC
    </span>
  );
}

interface BrandLogoProps {
  tone?: "default" | "on-primary";
  to?: string;
  onNavigate?: () => void;
  className?: string;
}

function BrandLogo({ tone = "default", to = "/home", onNavigate, className }: BrandLogoProps) {
  const onPrimary = tone === "on-primary";
  return (
    <Link to={to} onClick={onNavigate} className={cn("flex items-center gap-2.5", className)}>
      <BrandMark invert={onPrimary} />
      <span className="leading-tight">
        <span className={cn("block text-body-md font-bold", onPrimary ? "text-white" : "text-on-surface")}>
          <span className="font-black">AG</span> Solution
        </span>
        <span className={cn("block text-label-sm", onPrimary ? "text-white/80" : "text-on-surface-variant")}>
          Single Click Solution
        </span>
      </span>
    </Link>
  );
}

export { BrandLogo, BrandMark };
