import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backTo?: string;
  backLabel?: string;
}

function PageHeader({ title, description, actions, backTo, backLabel = "Back", className, ...props }: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-outline bg-surface-container-lowest p-4 shadow-md sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {backTo ? (
          <Link
            to={backTo}
            aria-label={backLabel}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-outline bg-surface text-on-surface transition-colors outline-none hover:bg-surface-container-low focus-visible:outline-[3px] focus-visible:outline-primary-container"
          >
            <ArrowLeft className="size-4" />
          </Link>
        ) : null}
        <div>
          <h1 className="text-headline-md font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-0.5 text-body-md text-on-surface-variant">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export { PageHeader };
