import * as React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backTo?: string;
  backLabel?: string;
  className?: string;
}

function PageHeader({ title, description, actions, backTo, backLabel = "Back", className }: PageHeaderProps) {
  return (
    <motion.div
      data-slot="page-header"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex flex-col gap-3 px-1 pt-1 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {backTo ? (
          <Link
            to={backTo}
            aria-label={backLabel}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-outline bg-surface text-on-surface shadow-sm transition-colors outline-none hover:bg-surface-container-low focus-visible:outline-[3px] focus-visible:outline-primary-container"
          >
            <ArrowLeft className="size-4" />
          </Link>
        ) : null}
        <div className="min-w-0">
          <h1 className="text-headline-md font-semibold tracking-tight text-on-surface">{title}</h1>
          {description ? <p className="mt-1 max-w-2xl text-body-md text-on-surface-variant">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </motion.div>
  );
}

export { PageHeader };
