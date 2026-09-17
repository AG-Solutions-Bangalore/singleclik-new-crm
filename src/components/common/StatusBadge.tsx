import { Badge } from "@/components/ui/badge";
import type { badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type InactiveVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

interface StatusBadgeProps {
  status: string | null | undefined;
  activeValue?: string;
  inactiveVariant?: InactiveVariant;
  className?: string;
}

function StatusBadge({ status, activeValue = "Active", inactiveVariant = "muted", className }: StatusBadgeProps) {
  const isActive = status === activeValue;
  return (
    <Badge variant={isActive ? "success" : inactiveVariant} className={cn(className)}>
      {status ?? "Unknown"}
    </Badge>
  );
}

export { StatusBadge };
