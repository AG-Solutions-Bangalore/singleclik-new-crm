import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { MdOutlineDelete } from "react-icons/md";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/common/StatusBadge";
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
  const [pendingDelete, setPendingDelete] = useState<
    { kind: "category" | "subcategory"; id: number } | null
  >(null);
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
    setPendingDelete({ kind: "category", id: rowId });
  };

  // delete function for subcategory
  const handleSubDelete = (e: SyntheticEvent, rowId: number) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    setPendingDelete({ kind: "subcategory", id: rowId });
  };

  const confirmDelete = () => {
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    if (pendingDelete?.kind === "category") {
      deleteCategoryMutation.mutate(pendingDelete.id);
    } else if (pendingDelete?.kind === "subcategory") {
      deleteSubCategoryMutation.mutate(pendingDelete.id);
    }
    setPendingDelete(null);
  };

  const columns: DataTableColumn<MemberCategory>[] = [
    {
      key: "slNo",
      header: "SL No",
      sortable: false,
      searchable: false,
      render: (_row, i) => <span className="text-on-surface-variant tabular-nums">{i + 1}</span>,
    },
    {
      key: "category",
      header: "Category name",
      render: (row) => <span className="font-medium text-on-surface">{row.category}</span>,
    },
    {
      key: "u_catg_status",
      header: "Status",
      sortable: false,
      render: (row) => <StatusBadge status={row.u_catg_status} inactiveVariant="destructive" />,
    },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      render: (row) => (
        <div className="inline-flex items-center gap-1 rounded-lg border border-outline/70 bg-surface px-1.5 py-1 shadow-sm">
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
            className="rounded-md text-error hover:bg-error-container hover:text-error"
          >
            <MdOutlineDelete className="size-4" />
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
      render: (_row, i) => <span className="text-on-surface-variant tabular-nums">{i + 1}</span>,
    },
    {
      key: "subcategory",
      header: "SubCategory name",
      render: (row) => <span className="font-medium text-on-surface">{row.subcategory}</span>,
    },
    {
      key: "u_subcatg_status",
      header: "Status",
      sortable: false,
      render: (row) => <StatusBadge status={row.u_subcatg_status} inactiveVariant="destructive" />,
    },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      render: (row) => (
        <div className="inline-flex items-center gap-1 rounded-lg border border-outline/70 bg-surface px-1.5 py-1 shadow-sm">
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
            className="rounded-md text-error hover:bg-error-container hover:text-error"
          >
            <MdOutlineDelete className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Member Categories"
          description={`Manage categories and sub-categories assigned to this member · ${category.length} ${category.length === 1 ? "category" : "categories"} · ${subCategory.length} sub-${subCategory.length === 1 ? "category" : "categories"}`}
          backTo={`/member-edit/${id}`}
        />
        <div className="flex flex-col gap-4 md:gap-5 xl:flex-row">
          <div className="w-full">
            <DataTable
              title="Categories"
              description="Toggle status or remove a category."
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
              searchPlaceholder="Search categories…"
              emptyMessage="No categories assigned."
            />
          </div>
          <div className="w-full">
            <DataTable
              title="Sub-categories"
              description="Toggle status or remove a sub-category."
              data={subCategory ? subCategory : []}
              columns={columnsSub}
              loading={loading}
              actions={
                <Button size="sm" onClick={handleOpenSubCat}>
                  <Plus />
                  Sub-category
                </Button>
              }
              rowKey={(row) => row.id}
              disableDownload
              disablePrint
              searchPlaceholder="Search sub-categories…"
              emptyMessage="No sub-categories assigned."
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
        <ConfirmDialog
          open={pendingDelete !== null}
          onOpenChange={(v) => !v && setPendingDelete(null)}
          title={pendingDelete?.kind === "subcategory" ? "Delete sub-category?" : "Delete category?"}
          description={
            pendingDelete?.kind === "subcategory"
              ? "This sub-category will be permanently removed from the member. This action cannot be undone."
              : "This category will be permanently removed from the member. This action cannot be undone."
          }
          confirmLabel="Delete"
          loading={
            pendingDelete?.kind === "subcategory"
              ? deleteSubCategoryMutation.isPending
              : deleteCategoryMutation.isPending
          }
          onConfirm={confirmDelete}
        />
      </div>
    </Layout>
  );
};

export default CategoryView;
