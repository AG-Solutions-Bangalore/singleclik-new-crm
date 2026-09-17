import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEditLine } from "react-icons/ri";
import { Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { useSubCategoriesList } from "@/modules/categories/hooks/useSubCategories";
import type { SubCategoryRow } from "@/modules/categories/types/categories";

const SubCategoryList = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const { data: subCategoryListData = [], isLoading, error } = useSubCategoriesList();

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching Sub category list data", error);
    }
  }, [error]);

  const columns: DataTableColumn<SubCategoryRow>[] = [
    {
      key: "slNo",
      header: "SL No",
      sortable: false,
      searchable: false,
      hideable: false,
      render: (_row, index) => (
        <span className="text-on-surface-variant tabular-nums">{index + 1}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => <span className="text-on-surface">{row.category}</span>,
    },
    {
      key: "subcategory",
      header: "Sub Category",
      render: (row) => <span className="font-medium text-on-surface">{row.subcategory}</span>,
    },
    {
      key: "subcategory_status",
      header: "Status",
      render: (row) => <StatusBadge status={row.subcategory_status} />,
    },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      hideable: false,
      render: (row) => (
        <div className="inline-flex items-center rounded-lg border border-outline/70 bg-surface p-0.5 shadow-sm">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(`/sub-category-edit/${row.id}`)}
            aria-label="Edit sub category"
            title="Edit Sub Category"
            className="rounded-md hover:bg-primary-container hover:text-on-primary-container"
          >
            <RiEditLine className="size-4" />
          </Button>
        </div>
      ),
      exportValue: () => "",
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Sub-categories"
          description={
            isLoading
              ? "Loading sub-categories…"
              : `${subCategoryListData.length} sub-${subCategoryListData.length === 1 ? "category" : "categories"} · grouped under parent categories`
          }
          actions={
            <Button asChild size="sm">
              <Link to="/add-subCategory">
                <Plus /> Add Sub Category
              </Link>
            </Button>
          }
        />
        <DataTable
          title={`All sub-categories · ${subCategoryListData.length} total`}
          description="All sub categories with parent category and status."
          data={subCategoryListData}
          columns={columns}
          loading={isLoading}
          rowKey={(row) => row.id}
          initialPageSize={5}
          searchPlaceholder="Search sub categories…"
          disableDownload
          disablePrint
          emptyMessage="No sub categories found."
        />
      </div>
    </Layout>
  );
};

export default SubCategoryList;
