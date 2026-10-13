import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { NO_IMAGE } from "@/lib/constants";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useReferralProductList,
  useUpdateReferralProductStatus,
} from "../hooks/useReferral";
import {
  referralTargetLabel,
  type ReferralProduct,
} from "../types/referral";

const audienceFilterMeta = [
  { value: "all", label: "All audiences" },
  { value: "1", label: "Business Only [1]" },
  { value: "2", label: "Consumer Only [2]" },
  { value: "1,2", label: "Both [1,2]" },
];

function normalizeAudience(val?: string | null): string {
  const v = String(val ?? "").trim();
  if (v === "2,1") return "1,2";
  return v;
}

const ReferralProductList = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useReferralProductList();
  const statusMutation = useUpdateReferralProductStatus();
  const [audienceFilter, setAudienceFilter] = useState("all");

  const productList = data?.data ?? [];
  const imageUrlBase =
    data?.image_url ||
    "https://singleclik.com/api/storage/app/public/refferalproducts_images/";

  // Exact-match counts straight from backend values ("1", "2", "1,2").
  const audienceCounts = useMemo(() => {
    const counts: Record<string, number> = { all: productList.length, "1": 0, "2": 0, "1,2": 0 };
    for (const item of productList) {
      const key = normalizeAudience(item.refferal_products_for);
      if (key in counts) counts[key] += 1;
    }
    return counts;
  }, [productList]);

  const audienceFilterOptions = useMemo(
    () =>
      audienceFilterMeta.map((opt) => ({
        ...opt,
        label: `${opt.label} (${audienceCounts[opt.value] ?? 0})`,
      })),
    [audienceCounts],
  );

  // Exact match only: "1" shows only pure "1" rows, "2" only pure "2", "1,2" only Both.
  const filteredList = useMemo(() => {
    if (audienceFilter === "all") return productList;
    return productList.filter(
      (item) => normalizeAudience(item.refferal_products_for) === audienceFilter,
    );
  }, [productList, audienceFilter]);

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    statusMutation.mutate({ id, status: nextStatus });
  };

  const columns: DataTableColumn<ReferralProduct>[] = [
    {
      key: "slNo",
      header: "SL No",
      sortable: false,
      searchable: false,
      hideable: false,
      render: (_row, i) => (
        <span className="text-on-surface-variant tabular-nums">{i + 1}</span>
      ),
    },
    {
      key: "refferal_products_image",
      header: "Image",
      sortable: false,
      searchable: false,
      render: (row) => {
        const src = row.refferal_products_image
          ? `${imageUrlBase}${row.refferal_products_image}`
          : NO_IMAGE;
        return (
          <img
            src={src}
            alt={row.refferal_products || "Referral Product"}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = NO_IMAGE;
            }}
            className="h-11 w-11 rounded-lg border border-outline object-cover shadow-sm"
          />
        );
      },
      exportValue: (row) => row.refferal_products_image ?? "",
    },
    {
      key: "refferal_products",
      header: "Product Name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-on-surface">
            {row.refferal_products}
          </span>
          {row.refferal_products_description && (
            <span className="line-clamp-1 text-xs text-on-surface-variant">
              {row.refferal_products_description}
            </span>
          )}
        </div>
      ),
      exportValue: (row) => row.refferal_products,
    },
    {
      key: "refferal_products_for",
      header: "Applicable For",
      render: (row) => {
        const label = referralTargetLabel(row.refferal_products_for);
        const isBoth =
          row.refferal_products_for === "1,2" ||
          row.refferal_products_for === "2,1";
        return (
          <Badge variant={isBoth ? "primary" : "secondary"}>{label}</Badge>
        );
      },
      exportValue: (row) => referralTargetLabel(row.refferal_products_for),
    },
    {
      key: "refferal_products_points",
      header: "Points",
      render: (row) => (
        <span className="font-semibold text-primary">
          {Number(row.refferal_products_points || 0).toLocaleString()} pts
        </span>
      ),
      exportValue: (row) => String(row.refferal_products_points),
    },
    {
      key: "refferal_product_validity",
      header: "Validity",
      render: (row) => (
        <span className="text-sm text-on-surface-variant">
          {row.refferal_product_validity
            ? `${row.refferal_product_validity} Days`
            : "No expiry"}
        </span>
      ),
      exportValue: (row) =>
        row.refferal_product_validity
          ? `${row.refferal_product_validity} Days`
          : "No expiry",
    },
    {
      key: "refferal_products_status",
      header: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.refferal_products_status === "Active"}
            disabled={statusMutation.isPending}
            onCheckedChange={() =>
              handleToggleStatus(row.id, row.refferal_products_status)
            }
            aria-label={`Toggle status for ${row.refferal_products}`}
          />
          <StatusBadge
            status={row.refferal_products_status}
            inactiveVariant="secondary"
          />
        </div>
      ),
      exportValue: (row) => row.refferal_products_status,
    },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      hideable: false,
      render: (row) => (
        <div className="inline-flex items-center rounded-lg border border-outline/70 bg-surface p-0.5 shadow-sm">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(`/edit-referral-product/${row.id}`)}
            title="Edit Referral Product"
            aria-label="Edit Referral Product"
            className="rounded-md hover:bg-primary-container hover:text-on-primary-container"
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      ),
      exportValue: () => "",
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Referral Management"
          description={
            isLoading
              ? "Loading referral products…"
              : `${filteredList.length} of ${productList.length} ${
                  productList.length === 1 ? "product" : "products"
                } available for referral reward claims`
          }
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Select value={audienceFilter} onValueChange={setAudienceFilter}>
                <SelectTrigger
                  aria-label="Filter by applicable audience"
                  className="h-9 w-64 bg-surface"
                >
                  <SelectValue placeholder="Filter: Applicable For" />
                </SelectTrigger>
                <SelectContent>
                  {audienceFilterOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button asChild size="sm">
                <Link to="/add-referral-product">
                  <Plus className="size-4" /> Add Referral Product
                </Link>
              </Button>
            </div>
          }
        />

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load referral products. Please check connection.
          </div>
        )}

        {isLoading ? (
          <div className="rounded-xl border border-outline bg-surface-container-lowest shadow-md">
            <Spinner className="py-16" />
          </div>
        ) : (
          <DataTable
            title={`Referral Products · ${filteredList.length} total`}
            description="Products available in the app for members to redeem referral points."
            data={filteredList}
            columns={columns}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search referral products…"
            emptyMessage={
              audienceFilter === "all"
                ? "No referral products found."
                : "No referral products found for this audience filter."
            }
          />
        )}
      </div>
    </Layout>
  );
};

export default ReferralProductList;
