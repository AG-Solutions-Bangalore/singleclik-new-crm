import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Pencil, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { AvatarImage } from "@/components/common/AvatarImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductDetail, useUpdateProduct } from "@/modules/products/hooks/useProduct";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const ProductEdit = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [product, setProduct] = useState({
    product_name: "",
    product_images: "",
    product_status: "",
  });
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: productData, error } = useProductDetail(id);
  const updateMutation = useUpdateProduct();

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const onStatusChange = (value: string) => {
    setProduct((prev) => ({
      ...prev,
      product_status: value,
    }));
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  useEffect(() => {
    if (productData) {
      setProduct(productData);
    }
  }, [productData]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching ADv Slider:", error);
    }
  }, [error]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    updateMutation.mutate(
      {
        id,
        product_name: product.product_name,
        product_status: product.product_status,
        selectedFile,
      },
      {
        onSuccess: (response) => {
          if (response.data.code == "200") {
            toast.success("Product updated successfully");
            navigate("/product");
          } else {
            toast.error("Duplicate entry");
          }
        },
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader title="Edit Product" description="Update the product photo, name and status." backTo="/product" />
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Preview the photo, then update the fields below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col items-center gap-2">
              <div className="relative">
                <AvatarImage
                  folder="product_images"
                  file={product.product_images}
                  alt={product.product_name || "Product"}
                  size="xl"
                  className="rounded-2xl border"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change product image"
                  className="absolute -right-2 -bottom-2 cursor-pointer rounded-full border border-outline bg-surface p-1.5 shadow-md transition-colors hover:bg-surface-container-low"
                >
                  <Pencil className="size-4 text-on-surface" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  name="product_images"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
              {selectedFile && (
                <p className="max-w-56 truncate text-body-md text-on-surface-variant">
                  {selectedFile.name}
                </p>
              )}
            </div>

            <form id="categoryForm" autoComplete="off" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product_name">
                    Product Name <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="product_name"
                    type="text"
                    name="product_name"
                    onChange={onInputChange}
                    value={product.product_name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product_status">
                    Status <span className="text-error">*</span>
                  </Label>
                  <Select value={product.product_status} onValueChange={onStatusChange} required>
                    <SelectTrigger id="product_status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={() => navigate("/product")}>
                  Back
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  <Send />
                  <span>{updateMutation.isPending ? "Updating..." : "Update"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProductEdit;
