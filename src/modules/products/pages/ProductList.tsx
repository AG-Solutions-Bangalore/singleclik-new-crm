import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { storageImage } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { useProductList } from "@/modules/products/hooks/useProduct";
import type { ProductRow } from "@/modules/products/types/product";

const ProductList = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();

  const { data: productListData, isLoading, error } = useProductList({
    enabled: !!isPanelUp,
  });

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching Product list data", error);
    }
  }, [error]);

  const columns: DataTableColumn<ProductRow>[] = [
    {
      key: "slNo",
      header: "SL No",
      sortable: false,
      searchable: false,
      hideable: false,
      render: (_row, i) => i + 1,
    },
    {
      key: "product_images",
      header: "Product Image",
      sortable: false,
      searchable: false,
      render: (row) => (
        <img
          src={storageImage("product_images", row.product_images)}
          alt="Product"
          className="h-10 w-10 rounded-md object-cover"
        />
      ),
      exportValue: (row) => row.product_images,
    },
    {
      key: "product_name",
      header: "Product Name",
      exportValue: (row) => row.product_name,
    },
    {
      key: "product_status",
      header: "Status",
      sortable: false,
      render: (row) =>
        row.product_status === "Active" ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="secondary">{row.product_status}</Badge>
        ),
      exportValue: (row) => row.product_status,
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
          size="icon-sm"
          onClick={() => navigate(`/edit-product/${row.id}`)}
          title="Edit Product"
          aria-label="Edit Product"
        >
          <Pencil />
        </Button>
      ),
      exportValue: () => "",
    },
  ];

  return (
    <Layout>
      <div className="space-y-4">
        <PageHeader
          title="Products List"
          description="Manage products"
          actions={
            <Button asChild variant="primary">
              <Link to="/add-product">
                <Plus /> Add Product
              </Link>
            </Button>
          }
        />
        {isLoading ? (
          <div className="rounded-lg border border-outline bg-surface-container-lowest shadow-md">
            <Spinner className="py-16" />
          </div>
        ) : (
          <DataTable
            title="Products List"
            data={productListData ? productListData : []}
            columns={columns}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search products…"
            emptyMessage="No products found."
          />
        )}
      </div>
    </Layout>
  );
};

export default ProductList;
