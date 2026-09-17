import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
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
import { CONSUMERS_API, authHeaders } from "../api/consumers";
import type { ConsumerRow } from "../types/consumers";
import { profileTypeLabel } from "../types/consumers";

const UserList = () => {
  const [userListData, setUserListData] = useState<ConsumerRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const response = await axios.get(CONSUMERS_API.userList, {
          headers: authHeaders(),
        });

        setUserListData(response.data?.user);
      } catch (error) {
        console.error("Error fetching user list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserListData();
  }, []);

  const handleUpdate = async (e: React.SyntheticEvent, id: number) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const res = await axios({
        url: CONSUMERS_API.updateUserStatus(id),
        method: "PUT",
        headers: authHeaders(),
      });
      if (res.data.code == "200") {
        setUserListData((prevUserListData) => {
          return (prevUserListData ?? []).map((user) => {
            if (user.id === id) {
              const newStatus = user.status === "Active" ? "Inactive" : "Active";

              if (newStatus === "Active") {
                toast.success("User Activated Successfully");
              } else {
                toast.success("User Inactivated Successfully");
              }

              return { ...user, status: newStatus };
            }
            return user;
          });
        });
      } else {
        toast.error("Errro occur while Inactive the profile");
      }
    } catch (error) {
      console.error("Error fetching user activate data", error);
      toast.error("Error fetching user activate data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.SyntheticEvent, id: number) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const res = await axios({
        url: CONSUMERS_API.deleteUser(id),
        method: "PUT",
        headers: authHeaders(),
      });
      if (res.data.code == "200") {
        toast.success("User Deleted  succesfully");
        setUserListData((prevUserListData) =>
          (prevUserListData ?? []).filter((user) => user.id !== id && user.status === user.status)
        );
      } else {
        toast.error("Errro occur while delete the user profile");
      }
    } catch (error) {
      console.error("Error user delete data", error);
      toast.error("Error user delete data");
    } finally {
      setLoading(false);
    }
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
        {loading && userListData === null ? (
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
