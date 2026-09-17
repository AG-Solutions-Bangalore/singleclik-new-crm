import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarImage } from "@/components/common/AvatarImage";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { TableSkeleton } from "@/components/ui/table-skeleton";
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
      render: (_row, i) => <span className="text-on-surface-variant tabular-nums">{i + 1}</span>,
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
          alt={row.notification_heading ?? "Notification"}
          size="sm"
          className="rounded-lg ring-1 ring-outline transition-shadow hover:shadow-md"
        />
      ),
      exportValue: (row) => row.notification_images ?? "",
    },
    {
      key: "notification_heading",
      header: "Heading",
      sortable: false,
      render: (row) => (
        <span className="font-medium whitespace-nowrap text-on-surface">
          {row.notification_heading}
        </span>
      ),
    },
    {
      key: "notification_des",
      header: "Description",
      sortable: false,
      render: (row) => (
        <span className="block max-w-md truncate text-body-md text-on-surface-variant" title={row.notification_des ?? ""}>
          {row.notification_des}
        </span>
      ),
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
        <div className="inline-flex items-center rounded-lg border border-outline/70 bg-surface p-0.5 shadow-sm">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(`/edit-notification/${row.id}`)}
            title="Edit Notification"
            aria-label="Edit Notification"
            className="rounded-md hover:bg-primary-container hover:text-on-primary-container"
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  const total = notiListData?.length ?? 0;

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Notifications"
          description={
            notiListData == null
              ? "Loading push notifications…"
              : `${total} ${total === 1 ? "notification" : "notifications"} · broadcasts sent to users`
          }
          actions={
            <Button asChild size="sm">
              <Link to="/add-notification">
                <Plus /> Create
              </Link>
            </Button>
          }
        />
        {loading && notiListData == null ? (
          <TableSkeleton />
        ) : (
          <DataTable
            title={`All notifications · ${total} total`}
            description="Headings, content and delivery status."
            data={notiListData ?? []}
            columns={columns}
            loading={loading}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search by heading…"
            emptyMessage="No notifications found."
          />
        )}
      </div>
    </Layout>
  );
};

export default NotificationList;
