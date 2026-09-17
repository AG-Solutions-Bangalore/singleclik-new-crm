import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ImagePlus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { FormActions } from "@/components/common/FormActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { useCreateProduct } from "@/modules/products/hooks/useProduct";

const ProductAdd = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [product, setProduct] = useState({
    product_name: "",
    product_images: "",
  });
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { product_name: product.product_name, selectedFile },
      {
        onSuccess: (res) => {
          if (res.data.code == "200") {
            toast.success("Product Create  succesfull");

            setProduct({
              product_name: "",
              product_images: "",
            });
            navigate("/product");
          } else {
            toast.error("duplicate entry");
          }
        },
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader title="Create Product" description="Add a new product to the catalog." backTo="/product" />
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Name the product and upload its photo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
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
                    placeholder="e.g. Premium Gift Hamper"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product_images">Product Image</Label>
                  <label
                    htmlFor="product_images"
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-outline bg-surface-container-low px-4 py-3 transition-colors hover:border-primary hover:bg-surface"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                      <ImagePlus className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-label-md font-medium text-on-surface">
                        {selectedFile ? selectedFile.name : "Choose an image"}
                      </span>
                      <span className="block text-body-md text-on-surface-variant">
                        PNG or JPG, square works best
                      </span>
                    </span>
                  </label>
                  <Input
                    id="product_images"
                    type="file"
                    accept="image/*"
                    name="product_images"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </div>
              </div>
              <FormActions
                isPending={createMutation.isPending}
                pendingLabel="Submiting...."
                submitLabel="Submit"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProductAdd;
