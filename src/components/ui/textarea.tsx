import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-h-20 rounded-default border border-outline bg-surface-container-low px-3 py-2 text-body-md text-on-surface shadow-xs transition-colors outline-none placeholder:text-on-surface-variant hover:border-outline-variant focus:border-primary focus:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
