import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <Card className={cn("flex flex-col items-center gap-2 py-12 text-center", className)}>
      <Icon className="size-8 text-on-surface-variant" aria-hidden />
      <p className="text-body-md font-medium text-on-surface">{title}</p>
      {description ? <p className="text-body-md text-on-surface-variant">{description}</p> : null}
    </Card>
  );
}

export { EmptyState };
