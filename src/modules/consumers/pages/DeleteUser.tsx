import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarImage } from "@/components/common/AvatarImage";
import { Spinner } from "@/components/ui/spinner";
import { useAppContext } from "@/context/app-context";
import type { ConsumerRow } from "../types/consumers";
import { profileTypeLabel } from "../types/consumers";
import { useDeletedConsumerList } from "../hooks/useConsumers";

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
      sortable: false,
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
  ];

  return (
    <Layout>
      <div className="mt-5">
        {loading && deleteData == null ? (
          <Spinner className="py-16" />
        ) : (
          <DataTable
            title="Delete User List"
            description="Deleted user records"
            data={deleteData ?? []}
            columns={columns}
            loading={loading}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search deleted users…"
            emptyMessage="No deleted users found."
          />
        )}
      </div>
    </Layout>
  );
};

export default DeleteUser;
