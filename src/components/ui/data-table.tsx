import * as React from "react";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

function DataTable<T>({
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
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [hidden, setHidden] = React.useState<Set<string>>(
    () => new Set(columns.filter((c) => c.defaultVisible === false).map((c) => c.key))
  );

  const visibleColumns = React.useMemo(() => columns.filter((c) => !hidden.has(c.key)), [columns, hidden]);
  const toggleableColumns = React.useMemo(() => columns.filter((c) => c.hideable !== false), [columns]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = data;
    if (q) {
      const searchable = columns.filter((c) => c.searchable !== false);
      rows = data.filter((row) => searchable.some((c) => cellText(row, c).toLowerCase().includes(q)));
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col) {
        rows = [...rows].sort((a, b) =>
          cellText(a, col).localeCompare(cellText(b, col), undefined, { numeric: true, sensitivity: "base" }) *
          (sortDir === "asc" ? 1 : -1)
        );
      }
    }
    return rows;
  }, [data, query, sortKey, sortDir, columns]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  React.useEffect(() => {
    setPage(0);
  }, [query, pageSize, data.length]);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir("asc");
    }
  };

  const toggleColumn = (key: string, visible: boolean) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (visible) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const downloadCsv = () => {
    const header = visibleColumns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(",");
    const lines = filtered.map((row) =>
      visibleColumns.map((c) => `"${cellText(row, c).replace(/"/g, '""')}"`).join(",")
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
    const head = visibleColumns.map((c) => `<th>${c.header}</th>`).join("");
    const body = filtered
      .map(
        (row) =>
          `<tr>${visibleColumns.map((c) => `<td>${cellText(row, c)}</td>`).join("")}</tr>`
      )
      .join("");
    win.document.write(
      `<!doctype html><html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111}h1{font-size:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:6px 10px;font-size:13px;text-align:left}th{background:#eee}</style></head><body><h1>${title}</h1><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`
    );
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div data-slot="data-table" className="overflow-hidden rounded-lg border border-outline bg-surface-container-lowest shadow-md">
      <div className="flex flex-col gap-3 border-b border-outline p-4 sm:flex-row sm:items-center sm:justify-between">
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
                {toggleableColumns.map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.key}
                    checked={!hidden.has(c.key)}
                    onCheckedChange={(v) => toggleColumn(c.key, v === true)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {c.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      {!disableSearch ? (
        <div className="border-b border-outline p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-on-surface-variant" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} className="pl-9" aria-label="Search table" />
          </div>
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
            {visibleColumns.map((col) => {
              const sortable = col.sortable !== false;
              const active = sortKey === col.key;
              return (
                <TableHead key={col.key} className={cn(col.align === "center" && "text-center", col.align === "right" && "text-right")}>
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex cursor-pointer items-center gap-1 font-medium text-on-surface-variant transition-colors outline-none hover:text-on-surface focus-visible:rounded-sm focus-visible:outline-[2px] focus-visible:outline-primary"
                    >
                      {col.header}
                      {active ? (
                        sortDir === "asc" ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />
                      ) : (
                        <ArrowUpDown className="size-3.5 opacity-50" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={visibleColumns.length}>
                <Spinner className="py-8" />
              </TableCell>
            </TableRow>
          ) : pageRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={visibleColumns.length} className="py-10 text-center text-on-surface-variant">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            pageRows.map((row, i) => {
              const globalIndex = safePage * pageSize + i;
              return (
                <TableRow key={rowKey(row, globalIndex)}>
                  {visibleColumns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(col.align === "center" && "text-center", col.align === "right" && "text-right", col.className)}
                    >
                      {col.render ? col.render(row, globalIndex) : String(rawValue(row, col.key) ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t border-outline p-4 text-body-md text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {filtered.length === 0 ? 0 : safePage * pageSize + 1}–{Math.min(filtered.length, safePage * pageSize + pageSize)} of{" "}
          {filtered.length} record{filtered.length === 1 ? "" : "s"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2">
            Rows
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
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
            <Button variant="ghost" size="icon-sm" onClick={() => setPage(0)} disabled={safePage === 0} aria-label="First page">
              <ChevronsLeft />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={safePage === 0} aria-label="Previous page">
              <ChevronLeft />
            </Button>
            <span className="px-2 text-[14px]">
              {safePage + 1} / {pageCount}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePage >= pageCount - 1}
              aria-label="Next page"
            >
              <ChevronRight />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setPage(pageCount - 1)} disabled={safePage >= pageCount - 1} aria-label="Last page">
              <ChevronsRight />
            </Button>
          </div>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={false}
              onCheckedChange={() => undefined}
              className="hidden"
              aria-hidden
              tabIndex={-1}
            />
            <span className="sr-only">placeholder</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export { DataTable };
