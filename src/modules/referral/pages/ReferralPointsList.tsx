import Layout from "@/components/layout/Layout";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { useReferralPointList } from "../hooks/useReferral";
import type { ReferralPoint } from "../types/referral";

const ReferralPointsList = () => {
  const { data: pointsList = [], isLoading, error } = useReferralPointList();

  const totalPointsAwarded = pointsList.reduce(
    (acc, item) => acc + (Number(item.refferal_point) || 0),
    0,
  );

  const columns: DataTableColumn<ReferralPoint>[] = [
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
      key: "reffer_user",
      header: "Referred By (Referrer)",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">
            {row.reffer_user?.name || `User #${row.refferal_from_id}`}
          </span>
          <span className="text-xs text-on-surface-variant">
            ID: {row.refferal_from_id}
          </span>
        </div>
      ),
      exportValue: (row) =>
        row.reffer_user?.name || String(row.refferal_from_id),
    },
    {
      key: "referred_user",
      header: "New Member (Referred)",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">
            {row.referred_user?.name || `User #${row.referred_to_id}`}
          </span>
          <span className="text-xs text-on-surface-variant">
            ID: {row.referred_to_id}
          </span>
        </div>
      ),
      exportValue: (row) =>
        row.referred_user?.name || String(row.referred_to_id),
    },
    {
      key: "refferal_point",
      header: "Points Awarded",
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
          +{Number(row.refferal_point || 0).toLocaleString()} pts
        </span>
      ),
      exportValue: (row) => String(row.refferal_point),
    },
    {
      key: "refferal_point_date",
      header: "Award Date",
      render: (row) => (
        <span className="text-sm text-on-surface-variant">
          {row.refferal_point_date}
        </span>
      ),
      exportValue: (row) => row.refferal_point_date,
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Referral Points Ledger"
          description={
            isLoading
              ? "Loading referral points history…"
              : `${pointsList.length} referral events recorded · Total ${totalPointsAwarded.toLocaleString()} points earned across the network`
          }
        />

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load referral points. Please check network connection.
          </div>
        )}

        {isLoading ? (
          <div className="rounded-xl border border-outline bg-surface-container-lowest shadow-md">
            <Spinner className="py-16" />
          </div>
        ) : (
          <DataTable
            title={`Referral Points Events · ${pointsList.length} entries`}
            description="Complete log of points credited when members refer new businesses and consumers."
            data={pointsList}
            columns={columns}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search by referrer, referred user, or date…"
            emptyMessage="No referral points transactions found."
          />
        )}
      </div>
    </Layout>
  );
};

export default ReferralPointsList;
