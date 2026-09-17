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
      render: (_row, index) => index + 1,
    },
    {
      key: "category",
      header: "Category",
    },
    {
      key: "subcategory",
      header: "Sub Category",
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/sub-category-edit/${row.id}`)}
          aria-label="Edit sub category"
          title="Edit Sub Category"
        >
          <RiEditLine />
        </Button>
      ),
      exportValue: () => "",
    },
  ];

  return (
    <Layout>
      <PageHeader
        title="Sub Category List"
        description="Manage sub categories under each category."
        actions={
          <Button asChild size="sm">
            <Link to="/add-subCategory">
              <Plus /> Add Sub Category
            </Link>
          </Button>
        }
      />
      <div className="mt-4">
        <DataTable
          title="Sub Category List"
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
