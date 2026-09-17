import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAppContext } from "@/context/app-context";
import { storageImage } from "@/lib/constants";
import { NOTIFICATIONS_API, authHeaders } from "../api/notifications";
import type { NotificationRow } from "../types/notifications";

const NotificationList = () => {
  const [notiListData, setNotitListData] = useState<NotificationRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotiListData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const response = await axios.get(NOTIFICATIONS_API.list, {
          headers: authHeaders(),
        });

        setNotitListData(response.data?.notification);
      } catch (error) {
        console.error("Error fetching Notification list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotiListData();
  }, []);

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
        <img
          src={storageImage("notification_images", row.notification_images)}
          alt="Notification"
          className="h-10 w-10 rounded-full object-cover"
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
        <Badge variant={row.notification_status === "Active" ? "success" : "destructive"}>
          {row.notification_status}
        </Badge>
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
        {loading && notiListData === null ? (
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
