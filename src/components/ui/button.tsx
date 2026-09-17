import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-label-md font-medium transition-all duration-200 outline-none focus-visible:outline-[3px] focus-visible:outline-primary-container disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active",
        secondary: "bg-primary-container text-primary hover:bg-primary-fixed-dim",
        ghost: "bg-transparent text-on-surface font-normal hover:bg-surface-container-low",
        outline: "border border-outline bg-surface text-on-surface hover:bg-surface-container-low",
        destructive: "bg-error text-on-error hover:brightness-95 active:brightness-90",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
      },
      size: {
        sm: "h-8 px-3 text-[14px]",
        default: "min-h-9 px-[15px] py-1.5",
        lg: "min-h-11 px-5",
        icon: "size-9 shrink-0",
        "icon-sm": "size-7 shrink-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
