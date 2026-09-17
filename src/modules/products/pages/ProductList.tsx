import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { storageImage } from "@/lib/constants";
import { StatusBadge } from "@/components/common/StatusBadge";
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
      render: (_row, i) => <span className="text-on-surface-variant tabular-nums">{i + 1}</span>,
    },
    {
      key: "product_images",
      header: "Product Image",
      sortable: false,
      searchable: false,
      render: (row) => (
        <img
          src={storageImage("product_images", row.product_images)}
          alt={row.product_name || "Product"}
          loading="lazy"
          className="h-10 w-10 rounded-lg border border-outline object-cover shadow-sm"
        />
      ),
      exportValue: (row) => row.product_images,
    },
    {
      key: "product_name",
      header: "Product Name",
      render: (row) => <span className="font-medium text-on-surface">{row.product_name}</span>,
      exportValue: (row) => row.product_name,
    },
    {
      key: "product_status",
      header: "Status",
      sortable: false,
      render: (row) => <StatusBadge status={row.product_status} inactiveVariant="secondary" />,
      exportValue: (row) => row.product_status,
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
            onClick={() => navigate(`/edit-product/${row.id}`)}
            title="Edit Product"
            aria-label="Edit Product"
            className="rounded-md hover:bg-primary-container hover:text-on-primary-container"
          >
            <Pencil className="size-4" />
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
          title="Products"
          description={
            isLoading
              ? "Loading products…"
              : `${productListData?.length ?? 0} ${(productListData?.length ?? 0) === 1 ? "product" : "products"} · names, images and availability`
          }
          actions={
            <Button asChild size="sm">
              <Link to="/add-product">
                <Plus /> Add Product
              </Link>
            </Button>
          }
        />
        {isLoading ? (
          <div className="rounded-xl border border-outline bg-surface-container-lowest shadow-md">
            <Spinner className="py-16" />
          </div>
        ) : (
          <DataTable
            title={`All products · ${productListData?.length ?? 0} total`}
            description="Catalog entries shown to customers."
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
