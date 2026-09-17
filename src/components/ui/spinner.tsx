import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="spinner" role="status" aria-label="Loading" className={cn("flex items-center justify-center", className)} {...props}>
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  );
}

export { Spinner };
