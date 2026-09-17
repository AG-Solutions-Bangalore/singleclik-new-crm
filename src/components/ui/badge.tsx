import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-label-sm font-medium whitespace-nowrap transition-colors outline-none",
  {
    variants: {
      variant: {
        secondary: "bg-secondary-container text-on-secondary-container",
        accent: "bg-tertiary-container text-on-tertiary-container",
        primary: "bg-primary-container text-on-primary-container",
        success: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
        destructive: "bg-error-container text-on-error-container",
        outline: "border border-outline text-on-surface",
        muted: "bg-surface-container-high text-on-surface",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
