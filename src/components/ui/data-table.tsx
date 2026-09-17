import * as React from "react";
import { motion } from "framer-motion";
import {
  useTable,
  type ColumnDef,
  type ColumnVisibilityState,
  type PaginationState,
  type Row,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  Download,
  Printer,
  Search,
} from "lucide-react";
import { features, type DataTableFeatures } from "@/components/ui/data-table-features";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  hideable?: boolean;
  defaultVisible?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
  render?: (row: T, globalIndex: number) => React.ReactNode;
  exportValue?: (row: T) => string | number | null | undefined;
}

export interface DataTableProps<T> {
  title: string;
  description?: string;
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  actions?: React.ReactNode;
  rowKey: (row: T, index: number) => string | number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  searchPlaceholder?: string;
  disableSearch?: boolean;
  disableColumnToggle?: boolean;
  disableDownload?: boolean;
  disablePrint?: boolean;
  emptyMessage?: string;
}

function rawValue<T>(row: T, key: string): unknown {
  return (row as unknown as Record<string, unknown>)[key];
}

function cellText<T>(row: T, col: DataTableColumn<T>): string {
  if (col.exportValue) {
    return String(col.exportValue(row) ?? "");
  }
  const v = rawValue(row, col.key);
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return "";
  return String(v);
}

/**
 * Narrow badge / action / index columns look balanced centered.
 * Any column can opt out by setting an explicit `align`.
 */
const CENTERED_HEADERS = new Set(["sl no", "image", "product image", "status", "action"]);

function alignClass<T>(col: DataTableColumn<T> | undefined): string | undefined {
  const align =
    col?.align ?? (col && CENTERED_HEADERS.has(col.header.trim().toLowerCase()) ? "center" : undefined);
  return cn(align === "center" && "text-center", align === "right" && "text-right") || undefined;
}

/**
 * Reusable data table for every list in the app, powered by
 * TanStack Table (https://ui.shadcn.com/docs/components/base/data-table).
 * Data fetching stays in each page via React Query (`useQuery`);
 * this component only handles client-side search, sorting,
 * column visibility and pagination.
 */
function DataTable<TData extends RowData>({
  title,
  description,
  data,
  columns,
  loading = false,
  actions,
  rowKey,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  searchPlaceholder = "Search…",
  disableSearch = false,
  disableColumnToggle = false,
  disableDownload = false,
  disablePrint = false,
  emptyMessage = "No records found.",
}: DataTableProps<TData>) {
  const [query, setQuery] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>(() =>
    Object.fromEntries(columns.filter((c) => c.defaultVisible === false).map((c) => [c.key, false]))
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const columnById = React.useMemo(() => new Map(columns.map((c) => [c.key, c])), [columns]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    const searchable = columns.filter((c) => c.searchable !== false);
    return data.filter((row) => searchable.some((c) => cellText(row, c).toLowerCase().includes(q)));
  }, [data, query, columns]);

  const tanstackColumns = React.useMemo<ColumnDef<DataTableFeatures, TData>[]>(() => {
    return columns.map((col) => ({
      id: col.key,
      header:
        col.sortable === false
          ? col.header
          : ({ column }) => (
              <button
                type="button"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="inline-flex cursor-pointer items-center gap-1 font-medium text-on-surface-variant transition-colors outline-none hover:text-on-surface focus-visible:rounded-sm focus-visible:outline-[2px] focus-visible:outline-primary"
              >
                {col.header}
                {column.getIsSorted() === "asc" ? (
                  <ArrowUp className="size-3.5" />
                ) : column.getIsSorted() === "desc" ? (
                  <ArrowDown className="size-3.5" />
                ) : (
                  <ArrowUpDown className="size-3.5 opacity-50" />
                )}
              </button>
            ),
      enableSorting: col.sortable !== false,
      enableHiding: col.hideable !== false,
      sortFn: (rowA: Row<DataTableFeatures, TData>, rowB: Row<DataTableFeatures, TData>) =>
        cellText(rowA.original, col).localeCompare(cellText(rowB.original, col), undefined, {
          numeric: true,
          sensitivity: "base",
        }),
    }));
  }, [columns]);

  const table = useTable({
    features,
    data: filtered,
    columns: tanstackColumns,
    state: { sorting, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  React.useEffect(() => {
    setPagination((prev) => (prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }));
  }, [query, pagination.pageSize, filtered.length]);

  const toggleableColumns = table.getAllColumns().filter((c) => c.getCanHide());
  const visibleSourceColumns = table
    .getVisibleLeafColumns()
    .map((c) => columnById.get(c.id))
    .filter((c): c is DataTableColumn<TData> => c !== undefined);

  const downloadCsv = () => {
    const header = visibleSourceColumns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(",");
    const lines = filtered.map((row) =>
      visibleSourceColumns.map((c) => `"${cellText(row, c).replace(/"/g, '""')}"`).join(",")
    );
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printTable = () => {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    const head = visibleSourceColumns.map((c) => `<th>${c.header}</th>`).join("");
    const body = filtered
      .map(
        (row) =>
          `<tr>${visibleSourceColumns.map((c) => `<td>${cellText(row, c)}</td>`).join("")}</tr>`
      )
      .join("");
    win.document.write(
      `<!doctype html><html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111}h1{font-size:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:6px 10px;font-size:13px;text-align:left}th{background:#eee}</style></head><body><h1>${title}</h1><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`
    );
    win.document.close();
    win.focus();
    win.print();
  };

  const pageIndex = table.state.pagination.pageIndex;
  const pageSize = table.state.pagination.pageSize;
  const pageCount = Math.max(1, table.getPageCount());
  const pageRows = table.getRowModel().rows;

  return (
    <motion.div
      data-slot="data-table"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden rounded-lg border border-outline bg-surface-container-lowest shadow-md"
    >
      <div className="flex flex-col gap-3 border-b border-outline p-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-lg font-semibold leading-8">{title}</h2>
          {description ? <p className="mt-0.5 text-body-md text-on-surface-variant">{description}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {!disableDownload ? (
            <Button variant="outline" size="sm" onClick={downloadCsv} disabled={filtered.length === 0}>
              <Download /> CSV
            </Button>
          ) : null}
          {!disablePrint ? (
            <Button variant="outline" size="sm" onClick={printTable} disabled={filtered.length === 0}>
              <Printer /> Print
            </Button>
          ) : null}
          {!disableColumnToggle && toggleableColumns.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns3 /> Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {toggleableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(v) => column.toggleVisibility(v === true)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {columnById.get(column.id)?.header ?? column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      {!disableSearch ? (
        <div className="border-b border-outline p-3">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-on-surface-variant" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} className="pl-9" aria-label="Search table" />
          </div>
        </div>
      ) : null}

      <Table className="min-w-[760px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-surface-container-low hover:bg-surface-container-low">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className={alignClass(columnById.get(header.column.id))}>
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={visibleSourceColumns.length}>
                <Spinner className="py-8" />
              </TableCell>
            </TableRow>
          ) : pageRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={visibleSourceColumns.length} className="py-10 text-center text-on-surface-variant">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            pageRows.map((row, posInPage) => {
              const original = row.original;
              const globalIndex = pageIndex * pageSize + posInPage;
              return (
                <motion.tr
                  key={`${pageIndex}-${pageSize}-${rowKey(original, globalIndex)}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                    delay: Math.min(posInPage * 0.03, 0.3),
                  }}
                  className="border-b border-outline transition-colors last:border-0 hover:bg-surface-container-low"
                >
                  {row.getVisibleCells().map((cell) => {
                    const src = columnById.get(cell.column.id);
                    if (!src) return null;
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(alignClass(src), src.className)}
                      >
                        {src.render ? src.render(original, globalIndex) : String(rawValue(original, src.key) ?? "")}
                      </TableCell>
                    );
                  })}
                </motion.tr>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-outline p-3 text-body-md text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {filtered.length === 0 ? 0 : pageIndex * pageSize + 1}–{Math.min(filtered.length, pageIndex * pageSize + pageSize)} of{" "}
          {filtered.length} record{filtered.length === 1 ? "" : "s"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2">
            Rows
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="h-8 cursor-pointer rounded-default border border-outline bg-surface-container-low px-2 text-[14px] text-on-surface outline-none focus:border-primary"
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} aria-label="First page">
              <ChevronsLeft />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page">
              <ChevronLeft />
            </Button>
            <span className="px-2 text-[14px]">
              {pageIndex + 1} / {pageCount}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => table.setPageIndex(pageCount - 1)} disabled={!table.getCanNextPage()} aria-label="Last page">
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export { DataTable };
