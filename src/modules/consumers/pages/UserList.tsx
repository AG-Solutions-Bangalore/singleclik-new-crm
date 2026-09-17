import { useEffect, useMemo } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarImage } from "@/components/common/AvatarImage";
import { useAppContext } from "@/context/app-context";
import type { ConsumerRow } from "../types/consumers";
import { profileTypeLabel } from "../types/consumers";
import { useConsumerList, useDeleteUser, useUpdateUserStatus } from "../hooks/useConsumers";

const profileBadgeVariant = (
  value: ConsumerRow["profile_type"]
): "primary" | "secondary" | "accent" | "muted" => {
  const normalized = String(value ?? "");
  if (normalized === "0") return "primary";
  if (normalized === "1") return "secondary";
  if (normalized === "0,1") return "accent";
  return "muted";
};

const UserList = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const { data: userListData, isLoading, error } = useConsumerList();
  const updateMutation = useUpdateUserStatus();
  const deleteMutation = useDeleteUser();
  const loading = isLoading || updateMutation.isPending || deleteMutation.isPending;
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [pendingDeactivateId, setPendingDeactivateId] = useState<number | null>(null);

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching user list data", error);
    }
  }, [error]);

  const handleStatusToggle = (row: ConsumerRow, nextChecked: boolean) => {
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    // Activating is immediate; deactivating needs confirmation.
    if (!nextChecked && row.status === "Active") {
      setPendingDeactivateId(row.id);
      return;
    }
    updateMutation.mutate(row.id);
  };

  const confirmDeactivate = () => {
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    if (pendingDeactivateId !== null) {
      updateMutation.mutate(pendingDeactivateId);
    }
    setPendingDeactivateId(null);
  };

  const handleDelete = (e: React.SyntheticEvent, id: number) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    if (pendingDeleteId !== null) {
      deleteMutation.mutate(pendingDeleteId);
    }
    setPendingDeleteId(null);
  };

  const columns: DataTableColumn<ConsumerRow>[] = [
    {
      key: "slNo",
      header: "SL No",
      align: "center",
      sortable: false,
      searchable: false,
      render: (_row, i) => <span className="text-on-surface-variant tabular-nums">{i + 1}</span>,
    },
    {
      key: "photo",
      header: "Image",
      align: "center",
      sortable: false,
      searchable: false,
      render: (row) => (
        <AvatarImage
          folder="user_images"
          file={row.photo}
          alt={row.name ?? "Consumer"}
          size="sm"
          className="ring-1 ring-outline transition-shadow hover:shadow-md"
        />
      ),
      exportValue: (row) => row.photo ?? "",
    },
    {
      key: "name",
      header: "Full name",
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
      align: "center",
      sortable: false,
      render: (row) => <StatusBadge status={row.status} inactiveVariant="destructive" />,
      exportValue: (row) => row.status ?? "",
    },
    {
      key: "id",
      header: "Action",
      align: "center",
      sortable: false,
      searchable: false,
      render: (row) => (
        <div className="inline-flex items-center gap-1 rounded-lg border border-outline/70 bg-surface px-1.5 py-1 shadow-sm">
          <Switch
            checked={row.status === "Active"}
            onCheckedChange={(next) => handleStatusToggle(row, next)}
            aria-label={row.status === "Active" ? "Deactivate user" : "Activate user"}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleDelete(e, row.id)}
            title="Delete the user"
            aria-label="Delete the user"
            className="rounded-md hover:bg-error-container hover:text-error"
          >
            <Trash2 className="size-4 text-error" />
          </Button>
        </div>
      ),
    },
  ];

  const total = userListData?.length ?? 0;
  const { activeCount, inactiveCount } = useMemo(() => {
    const list = userListData ?? [];
    const active = list.filter((u) => u.status === "Active").length;
    return { activeCount: active, inactiveCount: list.length - active };
  }, [userListData]);

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Consumers"
          description={
            userListData == null
              ? "Loading registered consumers…"
              : `${total} ${total === 1 ? "consumer" : "consumers"} registered · ${activeCount} active · ${inactiveCount} inactive`
          }
          actions={
            userListData != null && total > 0 ? (
              <div className="flex items-center gap-2">
                <Badge variant="success" className="tabular-nums">
                  {activeCount} active
                </Badge>
                {inactiveCount > 0 ? (
                  <Badge variant="destructive" className="tabular-nums">
                    {inactiveCount} inactive
                  </Badge>
                ) : null}
              </div>
            ) : undefined
          }
        />
        {loading && userListData == null ? (
          <TableSkeleton />
        ) : (
          <DataTable
            title={`All consumers · ${total} total`}
            description="Toggle access instantly or remove a consumer. Deactivation asks for confirmation."
            data={userListData ?? []}
            columns={columns}
            loading={loading}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search by name, company or mobile…"
            emptyMessage="No consumers found."
          />
        )}
        <ConfirmDialog
          open={pendingDeleteId !== null}
          onOpenChange={(v) => !v && setPendingDeleteId(null)}
          title="Delete user?"
          description="This user will be moved to the deleted list. This action cannot be undone from here."
          confirmLabel="Delete"
          loading={deleteMutation.isPending}
          onConfirm={confirmDelete}
        />
        <ConfirmDialog
          open={pendingDeactivateId !== null}
          onOpenChange={(v) => !v && setPendingDeactivateId(null)}
          title="Deactivate user?"
          description="This user will become inactive and lose access until reactivated."
          confirmLabel="Deactivate"
          loading={updateMutation.isPending}
          onConfirm={confirmDeactivate}
        />
      </div>
    </Layout>
  );
};

export default UserList;
