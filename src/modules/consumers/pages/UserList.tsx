import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Switch } from "@/components/ui/switch";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarImage } from "@/components/common/AvatarImage";
import { useAppContext } from "@/context/app-context";
import type { ConsumerRow } from "../types/consumers";
import { profileTypeLabel } from "../types/consumers";
import { useConsumerList, useDeleteUser, useUpdateUserStatus } from "../hooks/useConsumers";

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
      sortable: false,
      searchable: false,
      render: (_row, i) => i + 1,
    },
    {
      key: "photo",
      header: "Image",
      sortable: false,
      searchable: false,
      render: (row) => (
        <AvatarImage folder="user_images" file={row.photo} alt="Member" size="sm" />
      ),
      exportValue: (row) => row.photo ?? "",
    },
    {
      key: "name",
      header: "Full name",
    },
    {
      key: "company_name",
      header: "Company",
    },
    {
      key: "mobile",
      header: "Mobile",
    },
    {
      key: "profile_type",
      header: "Profile",
      render: (row) => profileTypeLabel(row.profile_type),
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
        <div className="flex items-center gap-2">
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
          >
            <Trash2 className="text-error" />
          </Button>
        </div>
      ),
    },
  ];

  const total = userListData?.length ?? 0;

  return (
    <Layout>
      <div className="mt-5">
        {loading && userListData == null ? (
          <TableSkeleton />
        ) : (
          <DataTable
            title="User List"
            description={total > 0 ? `Manage all registered users · ${total} total` : "Manage all registered users"}
            data={userListData ?? []}
            columns={columns}
            loading={loading}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search users…"
            emptyMessage="No users found."
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
