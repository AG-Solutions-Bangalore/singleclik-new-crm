import type { ComponentType } from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
  hint?: string;
}

function StatCard({ icon: Icon, label, value, accent, hint }: StatCardProps) {
  return (
    <Card className="p-5 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label-sm font-medium tracking-wide text-on-surface-variant uppercase">
            {label}
          </p>
          <p className="mt-1 text-[32px] leading-9 font-semibold tracking-tight text-on-surface tabular-nums">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 truncate text-body-md text-on-surface-variant">{hint}</p>
          ) : null}
        </div>
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-inset ring-outline/40 ${accent}`}
        >
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
    </Card>
  );
}

export { StatCard };
