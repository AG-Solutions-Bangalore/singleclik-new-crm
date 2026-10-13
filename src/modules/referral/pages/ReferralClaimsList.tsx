import { ChevronDown, CheckCircle, Clock, XCircle, PackageCheck } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import {
  useReferralClaimList,
  useUpdateReferralClaimStatus,
} from "../hooks/useReferral";
import { formatDisplayDate } from "@/lib/utils";
import type { ReferralClaimPoint } from "../types/referral";

function ClaimStatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  if (s === "approved") {
    return (
      <Badge variant="success" className="inline-flex items-center gap-1.5">
        <CheckCircle className="size-3" />
        Approved
      </Badge>
    );
  }
  if (s === "pending") {
    return (
      <Badge
        variant="secondary"
        className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
      >
        <Clock className="size-3" />
        Pending
      </Badge>
    );
  }
  if (s === "rejected") {
    return (
      <Badge variant="destructive" className="inline-flex items-center gap-1.5">
        <XCircle className="size-3" />
        Rejected
      </Badge>
    );
  }
  if (s === "completed") {
    return (
      <Badge variant="primary" className="inline-flex items-center gap-1.5">
        <PackageCheck className="size-3" />
        Completed
      </Badge>
    );
  }
  return <Badge variant="outline">{status}</Badge>;
}

const ReferralClaimsList = () => {
  const { data: claimsList = [], isLoading, error } = useReferralClaimList();
  const updateStatusMutation = useUpdateReferralClaimStatus();

  const handleStatusUpdate = (id: number, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const columns: DataTableColumn<ReferralClaimPoint>[] = [
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
      key: "user",
      header: "Claimant (User)",
      render: (row) => (
        <span className="font-semibold text-on-surface">
          {row.user?.name || `User #${row.user_id}`}
        </span>
      ),
      exportValue: (row) => row.user?.name || String(row.user_id),
    },
    {
      key: "claim_products",
      header: "Reward Product Claimed",
      render: (row) => (
        <span className="font-medium text-on-surface max-w-sm">
          {row.claim_products?.refferal_products ||
            `Product #${row.refferal_product_id}`}
        </span>
      ),
      exportValue: (row) =>
        row.claim_products?.refferal_products ||
        String(row.refferal_product_id),
    },
    {
      key: "refferal_claim_point",
      header: "Points Redeemed",
      render: (row) => (
        <span className="font-semibold text-primary">
          {Number(row.refferal_claim_point || 0).toLocaleString()} pts
        </span>
      ),
      exportValue: (row) => String(row.refferal_claim_point),
    },
    {
      key: "refferal_claim_created_date",
      header: "Claim Date",
      render: (row) => (
        <span className="text-sm whitespace-nowrap text-on-surface-variant">
          {formatDisplayDate(row.refferal_claim_created_date)}
        </span>
      ),
      exportValue: (row) => formatDisplayDate(row.refferal_claim_created_date),
    },
    {
      key: "refferal_claim_validity_date",
      header: "Valid Till",
      render: (row) => (
        <span className="text-sm whitespace-nowrap text-on-surface-variant">
          {formatDisplayDate(row.refferal_claim_validity_date)}
        </span>
      ),
      exportValue: (row) => formatDisplayDate(row.refferal_claim_validity_date),
    },
    {
      key: "refferal_claim_point_status",
      header: "Status",
      render: (row) => (
        <ClaimStatusBadge status={row.refferal_claim_point_status} />
      ),
      exportValue: (row) => row.refferal_claim_point_status,
    },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      hideable: false,
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={updateStatusMutation.isPending}
              className="h-8 gap-1 px-2.5 text-xs font-medium"
            >
              <span>Change Status</span>
              <ChevronDown className="size-3.5 text-on-surface-variant" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(row.id, "Approved")}
              className="text-emerald-600 focus:text-emerald-700 font-medium"
            >
              <CheckCircle className="size-4" />
              <span>Approve</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(row.id, "Pending")}
              className="text-amber-600 focus:text-amber-700 font-medium"
            >
              <Clock className="size-4" />
              <span>Pending</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(row.id, "Completed")}
              className="text-blue-600 focus:text-blue-700 font-medium"
            >
              <PackageCheck className="size-4" />
              <span>Complete</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(row.id, "Rejected")}
              variant="destructive"
              className="font-medium"
            >
              <XCircle className="size-4" />
              <span>Reject</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      exportValue: () => "",
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Referral Claim Requests"
          description={
            isLoading
              ? "Loading claim requests…"
              : `${claimsList.length} total reward redemption requests from users`
          }
        />

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load claim requests. Please check network connection.
          </div>
        )}

        {isLoading ? (
          <div className="rounded-xl border border-outline bg-surface-container-lowest shadow-md">
            <Spinner className="py-16" />
          </div>
        ) : (
          <DataTable
            title={`Claim Redemptions · ${claimsList.length} requests`}
            description="Manage and fulfill reward claims made by users with their referral points."
            data={claimsList}
            columns={columns}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search by claimant name or product name…"
            emptyMessage="No referral claim requests found."
          />
        )}
      </div>
    </Layout>
  );
};

export default ReferralClaimsList;
