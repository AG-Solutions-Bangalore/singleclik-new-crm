import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { MdOutlineDelete } from "react-icons/md";
import Layout from "@/components/layout/Layout";
import ToggleSwitch from "@/components/layout/ToggleSwitch";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { useAppContext } from "@/context/app-context";
import { MEMBERS_API } from "../api/members";
import type { MemberCategory, MemberSubCategory } from "../types/member";
import AddCategoryMember from "../components/AddCategoryMember";
import AddSubCategoryMember from "../components/AddSubCategoryMember";

const CategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<MemberCategory[]>([]);
  const [subCategory, setSubCategory] = useState<MemberSubCategory[]>([]);
  const { isPanelUp } = useAppContext();
  const [loading, setLoading] = useState(false);

  //
  const [openModal, setOpenModal] = useState(false);
  const [openSubModal, setOpenSubModal] = useState(false);
  const handleOpenCat = () => setOpenModal(!openModal);
  const handleOpenSubCat = () => setOpenSubModal(!openSubModal);
  //

  const fetchData = async () => {
    try {
      const response = await axios.get(MEMBERS_API.byId(id ?? ""), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.user) {
        setCategory(response.data?.categories);
        console.table("category view", response.data.categories);
        setSubCategory(response.data?.subcategories);
        console.table("sub category view", response.data.subcategories);
      } else {
        toast.error("No Category data found");
        console.error("no Category data found");

        navigate(`/member-edit/${id}`);
      }
    } catch (error) {
      console.error("Error fetching Category data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // update the status of category
  const handleUpdate = async (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios({
        url: MEMBERS_API.updateCategoryStatus(id),
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        setCategory((prevUserListData) => {
          return prevUserListData.map((user) => {
            if (user.id === id) {
              const newStatus =
                user.u_catg_status === "Active" ? "Inactive" : "Active";

              if (newStatus === "Active") {
                toast.success("Category Activated Successfully");
              } else {
                toast.success("Category Inactivated Successfully");
              }

              return { ...user, u_catg_status: newStatus };
            }
            return user;
          });
        });
        fetchData();
      } else {
        toast.error("Errro occur while Inactive the Category");
      }
    } catch (error) {
      console.error("Error fetching Category activate data", error);
      toast.error("Error fetching Category activate data");
    } finally {
      setLoading(false);
    }
  };

  // status update for the sub categroy
  const handleSubUpdate = async (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios({
        url: MEMBERS_API.updateSubCategoryStatus(id),
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        setSubCategory((prevUserListData) => {
          return prevUserListData.map((user) => {
            if (user.id === id) {
              const newStatus =
                user.u_subcatg_status === "Active" ? "Inactive" : "Active";

              if (newStatus === "Active") {
                toast.success("SubCategory Activated Successfully");
              } else {
                toast.success("SubCategory Inactivated Successfully");
              }

              return { ...user, u_subcatg_status: newStatus };
            }
            return user;
          });
        });
      } else {
        toast.error("Errro occur while Inactive the SubCategory");
      }
    } catch (error) {
      console.error("Error fetching SubCategory activate data", error);
      toast.error("Error fetching SubCategory activate data");
    } finally {
      setLoading(false);
    }
  };

  // delete function for Category
  const handleDelete = async (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios({
        url: MEMBERS_API.deleteCategory(id),
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        toast.success("Category Deleted  succesfully");
        setCategory((prevUserListData) =>
          prevUserListData.filter((user) => user.id !== id)
        );
        fetchData();
      } else {
        toast.error("Errro occur while delete the  Category");
      }
    } catch (error) {
      console.error("Error Category delete data", error);
      toast.error("Error Category delete data");
    } finally {
      setLoading(false);
    }
  };

  // delete function for subcategory
  const handleSubDelete = async (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios({
        url: MEMBERS_API.deleteSubCategory(id),
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        toast.success("SubCategory Deleted  succesfully");
        setSubCategory((prevUserListData) =>
          prevUserListData.filter((user) => user.id !== id)
        );
        fetchData();
      } else {
        toast.error("Errro occur while delete the  SubCategory");
      }
    } catch (error) {
      console.error("Error SubCategory delete data", error);
      toast.error("Error SubCategory delete data");
    } finally {
      setLoading(false);
    }
  };

  const columns: DataTableColumn<MemberCategory>[] = [
    {
      key: "slNo",
      header: "SL No",
      sortable: false,
      searchable: false,
      render: (_row, i) => i + 1,
    },
    { key: "category", header: "Category name" },
    { key: "u_catg_status", header: "Status", sortable: false },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <ToggleSwitch
            isActive={row.u_catg_status === "Active"}
            onToggle={(e) => handleUpdate(e, row.id)}
          />
          <button
            type="button"
            onClick={(e) => handleDelete(e, row.id)}
            title="Delete Category"
            className="cursor-pointer text-error transition-colors hover:opacity-80"
          >
            <MdOutlineDelete className="size-5" />
          </button>
        </div>
      ),
    },
  ];

  const columnsSub: DataTableColumn<MemberSubCategory>[] = [
    {
      key: "slNo",
      header: "SL No",
      sortable: false,
      searchable: false,
      render: (_row, i) => i + 1,
    },
    { key: "subcategory", header: "SubCategory name" },
    { key: "u_subcatg_status", header: "Status", sortable: false },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <ToggleSwitch
            isActive={row.u_subcatg_status === "Active"}
            onToggle={(e) => handleSubUpdate(e, row.id)}
          />
          <button
            type="button"
            onClick={(e) => handleSubDelete(e, row.id)}
            title="Delete SubCategory"
            className="cursor-pointer text-error transition-colors hover:opacity-80"
          >
            <MdOutlineDelete className="size-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Member Categories"
          description="Manage categories and sub-categories assigned to this member."
          backTo={`/member-edit/${id}`}
        />
        <div className="flex flex-col gap-4 xl:flex-row">
          <div className="w-full">
            <DataTable
              title="Category List"
              data={category ? category : []}
              columns={columns}
              loading={loading}
              actions={
                <Button size="sm" onClick={handleOpenCat}>
                  <Plus />
                  Category
                </Button>
              }
              rowKey={(row) => row.id}
              disableDownload
              disablePrint
            />
          </div>
          <div className="w-full">
            <DataTable
              title="SubCategory List"
              data={subCategory ? subCategory : []}
              columns={columnsSub}
              loading={loading}
              actions={
                <Button size="sm" onClick={handleOpenSubCat}>
                  <Plus />
                  SubCategory
                </Button>
              }
              rowKey={(row) => row.id}
              disableDownload
              disablePrint
            />
          </div>
        </div>
        <AddCategoryMember
          open={openModal}
          handleOpenCategory={handleOpenCat}
          id={id}
          fetchData={fetchData}
        />
        <AddSubCategoryMember
          open={openSubModal}
          handleOpenSubCategory={handleOpenSubCat}
          id={id}
          fetchData={fetchData}
        />
      </div>
    </Layout>
  );
};

export default CategoryView;
