import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarImage } from "@/components/common/AvatarImage";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useAppContext } from "@/context/app-context";
import type { ConsumerRow } from "../types/consumers";
import { profileTypeLabel } from "../types/consumers";
import { useActivateHoldUser, useHoldConsumerList } from "../hooks/useConsumers";

const profileBadgeVariant = (
  value: ConsumerRow["profile_type"]
): "primary" | "secondary" | "accent" | "muted" => {
  const normalized = String(value ?? "");
  if (normalized === "0") return "primary";
  if (normalized === "1") return "secondary";
  if (normalized === "0,1") return "accent";
  return "muted";
};

const HoldUser = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const { data: holdUserData, isLoading, error } = useHoldConsumerList();
  const activateMutation = useActivateHoldUser();
  const loading = isLoading || activateMutation.isPending;

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching hold user list data", error);
    }
  }, [error]);

  const handleActivate = (e: React.SyntheticEvent, id: number) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    activateMutation.mutate(id);
  };

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
          className="ring-1 ring-outline transition-shadow hover:shadow-md"
        />
      ),
      exportValue: (row) => row.photo ?? "",
    },
    {
      key: "name",
      header: "Full Name",
      sortable: false,
      searchable: false,
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
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      render: (row) => (
        <div className="inline-flex items-center rounded-lg border border-outline/70 bg-surface p-0.5 shadow-sm">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleActivate(e, row.id)}
            title="Activate the user"
            aria-label="Activate the user"
            className="rounded-md hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
          >
            <UserCheck className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  const total = holdUserData?.length ?? 0;

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Hold Users"
          description={
            holdUserData == null
              ? "Loading users currently on hold…"
              : `${total} ${total === 1 ? "user" : "users"} waiting to be reactivated`
          }
          actions={
            total > 0 ? (
              <Badge variant="secondary" className="tabular-nums">
                {total} on hold
              </Badge>
            ) : undefined
          }
        />
        {loading && holdUserData == null ? (
          <TableSkeleton />
        ) : (
          <DataTable
            title={`Hold list · ${total} total`}
            description="Review paused accounts and reactivate them with one click."
            data={holdUserData ?? []}
            columns={columns}
            loading={loading}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search by name, company or mobile…"
            emptyMessage="No hold users found."
          />
        )}
      </div>
    </Layout>
  );
};

export default HoldUser;
