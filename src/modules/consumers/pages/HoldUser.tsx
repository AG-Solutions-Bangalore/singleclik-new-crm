import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAppContext } from "@/context/app-context";
import { storageImage } from "@/lib/constants";
import type { ConsumerRow } from "../types/consumers";
import { profileTypeLabel } from "../types/consumers";
import { useActivateHoldUser, useHoldConsumerList } from "../hooks/useConsumers";

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
      header: "Full Name",
      sortable: false,
      searchable: false,
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
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleActivate(e, row.id)}
            title="Activate the user"
            aria-label="Activate the user"
          >
            <UserCheck />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mt-5">
        {loading && holdUserData == null ? (
          <Spinner className="py-16" />
        ) : (
          <DataTable
            title="Hold User List"
            description="Users currently on hold"
            data={holdUserData ?? []}
            columns={columns}
            loading={loading}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search hold users…"
            emptyMessage="No hold users found."
          />
        )}
      </div>
    </Layout>
  );
};

export default HoldUser;
