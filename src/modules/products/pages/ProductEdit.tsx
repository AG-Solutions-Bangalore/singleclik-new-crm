import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Pencil, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { storageImage } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  const imageUrl = storageImage("product_images", product.product_images);

  return (
    <Layout>
      <div className="space-y-4">
        <PageHeader title="Product Edit" description="Update product details" backTo="/product" />
        <Card>
          <CardContent>
            <div className="relative m-auto mb-6 flex w-44 flex-col items-center">
              <img
                src={imageUrl}
                alt="Product"
                className="mb-2 h-32 w-32 rounded-full border-2 border-outline object-cover"
              />
              <div className="absolute right-0 bottom-0 -translate-x-6 -translate-y-1/4 transform">
                <div
                  className="cursor-pointer rounded-full border border-outline bg-surface-container-low p-[3px] hover:bg-surface-container"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Pencil className="h-6 w-6 text-on-surface" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  name="product_images"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
              {selectedFile && <p className="text-sm text-on-surface-variant">{selectedFile.name}</p>}
            </div>

            <form id="categoryForm" autoComplete="off" onSubmit={handleSubmit} className="mt-2">
              <div className="mb-4 space-y-1.5">
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  type="text"
                  name="product_name"
                  onChange={onInputChange}
                  value={product.product_name}
                  required
                />
              </div>
              <div className="mb-4 space-y-1.5">
                <Label htmlFor="product_status">
                  Product Status <span className="text-red-700">*</span>
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

              <div className="flex justify-start gap-3">
                <Button type="submit" variant="primary" disabled={updateMutation.isPending}>
                  <Send />
                  <span>{updateMutation.isPending ? "Updating..." : "Update"}</span>
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/product")}>
                  Back
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
