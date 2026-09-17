import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiEditLine } from "react-icons/ri";
import { Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { storageImage } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { CATEGORIES_API, categoryTypeLabel } from "@/modules/categories/api/categories";
import type { CategoryRow } from "@/modules/categories/types/categories";

const CategoryList = () => {
  const [categoryListData, setCategoryListData] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryListData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(CATEGORIES_API.list, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategoryListData(response.data?.categories ?? []);
      } catch (error) {
        console.error("Error fetching category list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryListData();
  }, []);

  const columns: DataTableColumn<CategoryRow>[] = [
    {
      key: "slNo",
      header: "SL No",
      sortable: false,
      searchable: false,
      hideable: false,
      render: (_row, index) => index + 1,
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
          className="h-10 w-10 rounded-md border border-outline object-cover"
        />
      ),
      exportValue: (row) => row.category_image ?? "",
    },
    {
      key: "category",
      header: "Category",
    },
    {
      key: "category_type",
      header: "Category Type",
      render: (row) => categoryTypeLabel(row.category_type),
      exportValue: (row) => categoryTypeLabel(row.category_type),
    },
    {
      key: "category_status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.category_status === "Active" ? "success" : "muted"}>
          {row.category_status}
        </Badge>
      ),
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
          onClick={() => navigate(`/category-edit/${row.id}`)}
          aria-label="Edit category"
          title="Edit Category Info"
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
        title="Category List"
        description="Manage business and service categories."
        actions={
          <Button asChild size="sm">
            <Link to="/add-category">
              <Plus /> Add Category
            </Link>
          </Button>
        }
      />
      <div className="mt-4">
        <DataTable
          title="Category List"
          description="All categories with type and status."
          data={categoryListData}
          columns={columns}
          loading={loading}
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
