import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-h-9 rounded-default border border-outline bg-surface-container-low px-3 py-2 text-body-md text-on-surface shadow-xs transition-colors outline-none placeholder:text-on-surface-variant hover:border-outline-variant focus:border-primary focus:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-label-sm file:font-medium file:text-on-surface file:mr-3",
        className
      )}
      {...props}
    />
  );
}

export { Input };
