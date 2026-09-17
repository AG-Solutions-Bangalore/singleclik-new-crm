import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEditLine } from "react-icons/ri";
import { Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { storageImage } from "@/lib/constants";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { categoryTypeLabel } from "@/modules/categories/api/categories";
import { useCategoriesList } from "@/modules/categories/hooks/useCategories";
import type { CategoryRow } from "@/modules/categories/types/categories";

const CategoryList = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const { data: categoryListData = [], isLoading, error } = useCategoriesList();

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching category list data", error);
    }
  }, [error]);

  const columns: DataTableColumn<CategoryRow>[] = [
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
      key: "category_image",
      header: "Image",
      sortable: false,
      searchable: false,
      render: (row) => (
        <img
          src={storageImage("categories_images", row.category_image)}
          alt={row.category}
          loading="lazy"
          className="h-10 w-10 rounded-lg border border-outline object-cover shadow-sm"
        />
      ),
      exportValue: (row) => row.category_image ?? "",
    },
    {
      key: "category",
      header: "Category",
      render: (row) => <span className="font-medium text-on-surface">{row.category}</span>,
    },
    {
      key: "category_type",
      header: "Category Type",
      render: (row) => (
        <Badge
          variant={
            String(row.category_type) === "0"
              ? "primary"
              : String(row.category_type) === "1"
                ? "secondary"
                : String(row.category_type) === "0,1"
                  ? "accent"
                  : "muted"
          }
          className="whitespace-nowrap"
        >
          {categoryTypeLabel(row.category_type)}
        </Badge>
      ),
      exportValue: (row) => categoryTypeLabel(row.category_type),
    },
    {
      key: "category_status",
      header: "Status",
      render: (row) => <StatusBadge status={row.category_status} />,
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
            onClick={() => navigate(`/category-edit/${row.id}`)}
            aria-label="Edit category"
            title="Edit Category Info"
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
          title="Categories"
          description={
            isLoading
              ? "Loading categories…"
              : `${categoryListData.length} ${categoryListData.length === 1 ? "category" : "categories"} · manage types and status`
          }
          actions={
            <Button asChild size="sm">
              <Link to="/add-category">
                <Plus /> Add Category
              </Link>
            </Button>
          }
        />
        <DataTable
          title={`All categories · ${categoryListData.length} total`}
          description="All categories with type and status."
          data={categoryListData}
          columns={columns}
          loading={isLoading}
          rowKey={(row) => row.id}
          searchPlaceholder="Search categories…"
          disableDownload
          disablePrint
          emptyMessage="No categories found."
        />
      </div>
    </Layout>
  );
};

export default CategoryList;
