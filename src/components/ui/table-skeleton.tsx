import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  showSearch?: boolean;
  showToolbar?: boolean;
}

function TableSkeleton({ rows = 8, showSearch = true, showToolbar = true }: TableSkeletonProps) {
  return (
    <div
      data-slot="table-skeleton"
      aria-label="Loading table"
      role="status"
      className="overflow-hidden rounded-lg border border-outline bg-surface-container-lowest shadow-md"
    >
      <div className="flex flex-col gap-3 border-b border-outline p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-56" />
        </div>
        {showToolbar ? (
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>
        ) : null}
      </div>
      {showSearch ? (
        <div className="border-b border-outline p-3">
          <Skeleton className="h-9 max-w-sm" />
        </div>
      ) : null}
      <div className="flex flex-col gap-2.5 p-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
            <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-outline p-3">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-8 w-52" />
      </div>
    </div>
  );
}

export { TableSkeleton };
