import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ImagePlus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { FormActions } from "@/components/common/FormActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateReferralProduct } from "../hooks/useReferral";

const ReferralProductAdd = () => {
  const navigate = useNavigate();
  const createMutation = useCreateReferralProduct();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    refferal_products_for: "1,2", // default both
    refferal_products: "",
    refferal_products_description: "",
    refferal_products_points: "",
    refferal_product_validity: "",
  });

  const onInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleTargetDropdownChange = (val: string) => {
    setForm((prev) => ({ ...prev, refferal_products_for: val }));
  };

  const handleCheckboxToggle = (type: "1" | "2", checked: boolean) => {
    const current = form.refferal_products_for.split(",").filter(Boolean);
    let next: string[];
    if (checked) {
      next = Array.from(new Set([...current, type])).sort();
    } else {
      next = current.filter((item) => item !== type);
    }

    if (next.length === 0) {
      toast.error("Please select at least one target audience (Business or Consumer)");
      return;
    }

    setForm((prev) => ({
      ...prev,
      refferal_products_for: next.join(","),
    }));
  };

  const isBusinessChecked = form.refferal_products_for.includes("1");
  const isConsumerChecked = form.refferal_products_for.includes("2");

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.refferal_products_for) {
      toast.error("Please select who this referral product is for (Business, Consumer or Both)");
      return;
    }

    if (!form.refferal_products.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    if (!form.refferal_products_points) {
      toast.error("Please enter referral points required");
      return;
    }

    createMutation.mutate(
      {
        refferal_products_for: form.refferal_products_for,
        refferal_products: form.refferal_products,
        refferal_products_description: form.refferal_products_description,
        refferal_products_points: form.refferal_products_points,
        refferal_product_validity: form.refferal_product_validity,
        selectedFile,
      },
      {
        onSuccess: (res) => {
          if (res.data?.code === 200 || res.status === 200) {
            navigate("/referral-products");
          }
        },
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Create Referral Product"
          description="Add a new reward product available for points redemption."
          backTo="/referral-products"
        />

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Configure referral reward parameters, audience access, points, and imagery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="createReferralProductForm" autoComplete="off" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Referral Product Audience (1, 2, or both) */}
                <div className="space-y-3 md:col-span-2 rounded-xl border border-outline/50 bg-surface-container-low/50 p-4">
                  <div>
                    <Label htmlFor="refferal_products_for" className="text-sm font-semibold">
                      Applicable For (Audience) <span className="text-error">*</span>
                    </Label>
                    <p className="text-xs text-on-surface-variant">
                      Choose whether this reward is for Businesses (1), Consumers (2), or Both.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                    <div className="min-w-0 flex-1">
                      <Select
                        value={form.refferal_products_for}
                        onValueChange={handleTargetDropdownChange}
                      >
                        <SelectTrigger id="refferal_products_for" className="bg-surface">
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1,2">Both (Business & Consumer) [1,2]</SelectItem>
                          <SelectItem value="1">Business Only [1]</SelectItem>
                          <SelectItem value="2">Consumer Only [2]</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex shrink-0 items-center gap-6 pt-1 lg:pt-0">
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                        <Checkbox
                          checked={isBusinessChecked}
                          onCheckedChange={(checked) =>
                            handleCheckboxToggle("1", !!checked)
                          }
                        />
                        <span>Business (1)</span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                        <Checkbox
                          checked={isConsumerChecked}
                          onCheckedChange={(checked) =>
                            handleCheckboxToggle("2", !!checked)
                          }
                        />
                        <span>Consumer (2)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="refferal_products">
                    Product Title <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="refferal_products"
                    name="refferal_products"
                    type="text"
                    placeholder="e.g. 90 days Promotion or Fastrack Watch"
                    value={form.refferal_products}
                    onChange={onInputChange}
                    required
                  />
                </div>

                {/* Referral Points */}
                <div className="space-y-2">
                  <Label htmlFor="refferal_products_points">
                    Points Required <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="refferal_products_points"
                    name="refferal_products_points"
                    type="number"
                    min="1"
                    placeholder="e.g. 20000"
                    value={form.refferal_products_points}
                    onChange={onInputChange}
                    required
                  />
                </div>

                {/* Product Validity (days) */}
                <div className="space-y-2">
                  <Label htmlFor="refferal_product_validity">
                    Reward Validity (in Days)
                  </Label>
                  <Input
                    id="refferal_product_validity"
                    name="refferal_product_validity"
                    type="number"
                    min="1"
                    placeholder="e.g. 30, 60, 90 (optional)"
                    value={form.refferal_product_validity}
                    onChange={onInputChange}
                  />
                  <p className="text-xs text-on-surface-variant">
                    Leave blank if this reward does not have an expiration limit.
                  </p>
                </div>

                {/* Product Image */}
                <div className="space-y-2">
                  <Label htmlFor="refferal_products_image">Product Image</Label>
                  <label
                    htmlFor="refferal_products_image"
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-outline bg-surface-container-low px-4 py-3 transition-colors hover:border-primary hover:bg-surface"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="size-10 rounded-lg object-cover border border-outline"
                      />
                    ) : (
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                        <ImagePlus className="size-4" aria-hidden />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-label-md font-medium text-on-surface">
                        {selectedFile ? selectedFile.name : "Choose an image"}
                      </span>
                      <span className="block text-body-md text-on-surface-variant">
                        PNG, JPG, or WEBP
                      </span>
                    </span>
                  </label>
                  <Input
                    id="refferal_products_image"
                    type="file"
                    accept="image/*"
                    name="refferal_products_image"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="refferal_products_description">
                    Description
                  </Label>
                  <Textarea
                    id="refferal_products_description"
                    name="refferal_products_description"
                    rows={3}
                    placeholder="Describe the product or promotional terms..."
                    value={form.refferal_products_description}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              <FormActions
                isPending={createMutation.isPending}
                pendingLabel="Creating..."
                submitLabel="Create Product"
                backTo="/referral-products"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReferralProductAdd;
