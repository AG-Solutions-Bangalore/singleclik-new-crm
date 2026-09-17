import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ToggleSwitch from "@/components/layout/ToggleSwitch";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAppContext } from "@/context/app-context";
import { storageImage } from "@/lib/constants";
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

  const handleUpdate = (e: React.SyntheticEvent, id: number) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    updateMutation.mutate(id);
  };

  const handleDelete = (e: React.SyntheticEvent, id: number) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    deleteMutation.mutate(id);
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
        <img
          src={storageImage("user_images", row.photo)}
          alt="Member"
          className="h-10 w-10 rounded-full object-cover"
        />
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
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "destructive"}>{row.status}</Badge>
      ),
      exportValue: (row) => row.status ?? "",
    },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <ToggleSwitch
            isActive={row.status === "Active"}
            onToggle={(e) => handleUpdate(e, row.id)}
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

  return (
    <Layout>
      <div className="mt-5">
        {loading && userListData == null ? (
          <Spinner className="py-16" />
        ) : (
          <DataTable
            title="User List"
            description="Manage all registered users"
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
      </div>
    </Layout>
  );
};

export default UserList;
