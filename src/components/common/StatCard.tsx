import type { ComponentType } from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
}

function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${accent}`}>
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-label-sm font-medium text-on-surface-variant">{label}</p>
          <p className="text-headline-md font-semibold tracking-tight">{value}</p>
        </div>
      </div>
    </Card>
  );
}

export { StatCard };
