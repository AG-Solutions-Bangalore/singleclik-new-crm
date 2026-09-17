import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { MdOutlineDelete } from "react-icons/md";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/context/app-context";
import { useCategoryView } from "../hooks/useMemberDetail";
import {
  useDeleteCategory,
  useDeleteSubCategory,
  useUpdateCategoryStatus,
  useUpdateSubCategoryStatus,
} from "../hooks/useMemberMutations";
import type { MemberCategory, MemberSubCategory } from "../types/member";
import AddCategoryMember from "../components/AddCategoryMember";
import AddSubCategoryMember from "../components/AddSubCategoryMember";

const CategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<MemberCategory[]>([]);
  const [subCategory, setSubCategory] = useState<MemberSubCategory[]>([]);
  const { isPanelUp } = useAppContext();

  //
  const [openModal, setOpenModal] = useState(false);
  const [openSubModal, setOpenSubModal] = useState(false);
  const handleOpenCat = () => setOpenModal(!openModal);
  const handleOpenSubCat = () => setOpenSubModal(!openSubModal);
  //

  const {
    data: categoryViewData,
    isLoading,
    error: categoryViewError,
  } = useCategoryView(id);

  const updateCategoryMutation = useUpdateCategoryStatus(id, (toggledId) => {
    setCategory((prevUserListData) => {
      return prevUserListData.map((user) => {
        if (user.id === toggledId) {
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
  });

  const updateSubCategoryMutation = useUpdateSubCategoryStatus(id, (toggledId) => {
    setSubCategory((prevUserListData) => {
      return prevUserListData.map((user) => {
        if (user.id === toggledId) {
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
  });

  const deleteCategoryMutation = useDeleteCategory(id, (deletedId) => {
    toast.success("Category Deleted  succesfully");
    setCategory((prevUserListData) =>
      prevUserListData.filter((user) => user.id !== deletedId)
    );
  });

  const deleteSubCategoryMutation = useDeleteSubCategory(id, (deletedId) => {
    toast.success("SubCategory Deleted  succesfully");
    setSubCategory((prevUserListData) =>
      prevUserListData.filter((user) => user.id !== deletedId)
    );
  });

  const loading =
    isLoading ||
    updateCategoryMutation.isPending ||
    updateSubCategoryMutation.isPending ||
    deleteCategoryMutation.isPending ||
    deleteSubCategoryMutation.isPending;

  useEffect(() => {
    if (categoryViewData === undefined) return;
    if (categoryViewData?.user) {
      setCategory(categoryViewData?.categories);
      console.table("category view", categoryViewData.categories);
      setSubCategory(categoryViewData?.subcategories);
      console.table("sub category view", categoryViewData.subcategories);
    } else {
      toast.error("No Category data found");
      console.error("no Category data found");

      navigate(`/member-edit/${id}`);
    }
  }, [categoryViewData, id, navigate]);

  useEffect(() => {
    if (categoryViewError) {
      console.error("Error fetching Category data:", categoryViewError);
    }
  }, [categoryViewError]);

  // update the status of category
  const handleUpdate = (rowId: number) => {
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    updateCategoryMutation.mutate(rowId);
  };

  // status update for the sub categroy
  const handleSubUpdate = (rowId: number) => {
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    updateSubCategoryMutation.mutate(rowId);
  };

  // delete function for Category
  const handleDelete = (e: SyntheticEvent, rowId: number) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    deleteCategoryMutation.mutate(rowId);
  };

  // delete function for subcategory
  const handleSubDelete = (e: SyntheticEvent, rowId: number) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    deleteSubCategoryMutation.mutate(rowId);
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
        <div className="flex items-center gap-1">
          <Switch
            checked={row.u_catg_status === "Active"}
            onCheckedChange={() => handleUpdate(row.id)}
            aria-label={row.u_catg_status === "Active" ? "Deactivate category" : "Activate category"}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleDelete(e, row.id)}
            title="Delete Category"
            aria-label="Delete Category"
            className="text-error hover:text-error"
          >
            <MdOutlineDelete className="size-5" />
          </Button>
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
        <div className="flex items-center gap-1">
          <Switch
            checked={row.u_subcatg_status === "Active"}
            onCheckedChange={() => handleSubUpdate(row.id)}
            aria-label={row.u_subcatg_status === "Active" ? "Deactivate sub-category" : "Activate sub-category"}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleSubDelete(e, row.id)}
            title="Delete SubCategory"
            aria-label="Delete SubCategory"
            className="text-error hover:text-error"
          >
            <MdOutlineDelete className="size-5" />
          </Button>
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
        />
        <AddSubCategoryMember
          open={openSubModal}
          handleOpenSubCategory={handleOpenSubCat}
          id={id}
        />
      </div>
    </Layout>
  );
};

export default CategoryView;
