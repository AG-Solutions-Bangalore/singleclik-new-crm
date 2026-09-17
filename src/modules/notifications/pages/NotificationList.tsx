import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarImage } from "@/components/common/AvatarImage";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAppContext } from "@/context/app-context";
import type { NotificationRow } from "../types/notifications";
import { useNotificationList } from "../hooks/useNotifications";

const NotificationList = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const { data: notiListData, isLoading: loading, error } = useNotificationList();

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching Notification list data", error);
    }
  }, [error]);

  const columns: DataTableColumn<NotificationRow>[] = [
    {
      key: "slNo",
      header: "SL No",
      sortable: false,
      searchable: false,
      render: (_row, i) => i + 1,
    },
    {
      key: "notification_images",
      header: "Image",
      sortable: false,
      searchable: false,
      render: (row) => (
        <AvatarImage
          folder="notification_images"
          file={row.notification_images}
          alt="Notification"
          size="sm"
        />
      ),
      exportValue: (row) => row.notification_images ?? "",
    },
    {
      key: "notification_heading",
      header: "Heading",
      sortable: false,
    },
    {
      key: "notification_des",
      header: "Description",
      sortable: false,
    },
    {
      key: "notification_status",
      header: "Status",
      sortable: false,
      render: (row) => (
        <StatusBadge status={row.notification_status} inactiveVariant="destructive" />
      ),
      exportValue: (row) => row.notification_status ?? "",
    },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(`/edit-notification/${row.id}`)}
            title="Edit Notification"
            aria-label="Edit Notification"
          >
            <Pencil />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mt-5">
        {loading && notiListData == null ? (
          <Spinner className="py-16" />
        ) : (
          <DataTable
            title="Notification List"
            description="Manage push notifications"
            data={notiListData ?? []}
            columns={columns}
            loading={loading}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search notifications…"
            emptyMessage="No notifications found."
            actions={
              <Button asChild variant="primary" size="sm">
                <Link to="/add-notification" title="Add Notification">
                  <Plus /> Create
                </Link>
              </Button>
            }
          />
        )}
      </div>
    </Layout>
  );
};

export default NotificationList;
