import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md border-[1.5px] border-outline-variant bg-surface-container-lowest shadow-sm transition-all outline-none hover:border-primary hover:shadow-md focus-visible:border-primary focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-on-primary data-[state=checked]:shadow-sm data-[state=unchecked]:bg-surface-container-lowest",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-transform data-[state=unchecked]:scale-0"
      >
        <Check className="size-3.5" strokeWidth={3.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
