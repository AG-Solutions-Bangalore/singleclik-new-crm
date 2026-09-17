import {
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";

// Shared TanStack Table v9 feature set for every data table in the app,
// following https://ui.shadcn.com/docs/components/base/data-table.
// Anything not registered here is tree-shaken out of the bundle.
export const features = tableFeatures({
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});

// Pass this as the first generic argument to `ColumnDef`, `Column`,
// `Table` and `Row` so each type knows which feature APIs are available.
export type DataTableFeatures = typeof features;
