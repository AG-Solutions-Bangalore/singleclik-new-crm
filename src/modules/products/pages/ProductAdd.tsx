import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "@/components/layout/Layout";
import { FormActions } from "@/components/common/FormActions";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="space-y-4">
        <PageHeader title="Create Product" description="Add a new product" backTo="/product" />
        <Card>
          <CardContent>
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="product_images">Product Image</Label>
                  <Input
                    id="product_images"
                    type="file"
                    name="product_images"
                    onChange={onFileChange}
                  />
                </div>
                <div className="space-y-1.5">
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
