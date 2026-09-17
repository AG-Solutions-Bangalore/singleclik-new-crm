import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarImage } from "@/components/common/AvatarImage";
import { PageHeader } from "@/components/ui/page-header";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useAppContext } from "@/context/app-context";
import type { ConsumerRow } from "../types/consumers";
import { profileTypeLabel } from "../types/consumers";
import { useDeletedConsumerList } from "../hooks/useConsumers";

const profileBadgeVariant = (
  value: ConsumerRow["profile_type"]
): "primary" | "secondary" | "accent" | "muted" => {
  const normalized = String(value ?? "");
  if (normalized === "0") return "primary";
  if (normalized === "1") return "secondary";
  if (normalized === "0,1") return "accent";
  return "muted";
};

const DeleteUser = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const { data: deleteData, isLoading: loading, error } = useDeletedConsumerList();

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching delete user list data", error);
    }
  }, [error]);

  const columns: DataTableColumn<ConsumerRow>[] = [
    {
      key: "slNo",
      header: "SL No",
      sortable: false,
      searchable: false,
      render: (_row, i) => <span className="text-on-surface-variant tabular-nums">{i + 1}</span>,
    },
    {
      key: "photo",
      header: "Image",
      sortable: false,
      searchable: false,
      render: (row) => (
        <AvatarImage
          folder="user_images"
          file={row.photo}
          alt={row.name ?? "Member"}
          size="sm"
          className="ring-1 ring-outline"
        />
      ),
      exportValue: (row) => row.photo ?? "",
    },
    {
      key: "name",
      header: "Full name",
      sortable: false,
      render: (row) => <span className="font-medium text-on-surface">{row.name}</span>,
    },
    {
      key: "company_name",
      header: "Company",
      render: (row) =>
        row.company_name ? (
          <span className="text-on-surface">{row.company_name}</span>
        ) : (
          <span className="text-on-surface-variant">—</span>
        ),
    },
    {
      key: "mobile",
      header: "Mobile",
      render: (row) => <span className="whitespace-nowrap tabular-nums">{row.mobile}</span>,
    },
    {
      key: "profile_type",
      header: "Profile",
      render: (row) => (
        <Badge variant={profileBadgeVariant(row.profile_type)} className="whitespace-nowrap">
          {profileTypeLabel(row.profile_type)}
        </Badge>
      ),
      exportValue: (row) => profileTypeLabel(row.profile_type),
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      render: (row) => <StatusBadge status={row.status} inactiveVariant="destructive" />,
      exportValue: (row) => row.status ?? "",
    },
  ];

  const total = deleteData?.length ?? 0;

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Deleted Users"
          description={
            deleteData == null
              ? "Loading deleted user records…"
              : `${total} deleted ${total === 1 ? "record" : "records"} kept for reference`
          }
          actions={
            total > 0 ? (
              <Badge variant="destructive" className="tabular-nums">
                {total} deleted
              </Badge>
            ) : undefined
          }
        />
        {loading && deleteData == null ? (
          <TableSkeleton />
        ) : (
          <DataTable
            title={`Deleted records · ${total} total`}
            description="Read-only archive of removed users."
            data={deleteData ?? []}
            columns={columns}
            loading={loading}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search by name, company or mobile…"
            emptyMessage="No deleted users found."
          />
        )}
      </div>
    </Layout>
  );
};

export default DeleteUser;
