import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { NO_IMAGE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
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
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  useReferralProductDetail,
  useUpdateReferralProduct,
} from "../hooks/useReferral";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const ReferralProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: detailData, isLoading, error } = useReferralProductDetail(id);
  const updateMutation = useUpdateReferralProduct();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    refferal_products_for: "1,2",
    refferal_products: "",
    refferal_products_description: "",
    refferal_products_points: "",
    refferal_product_validity: "",
    refferal_products_status: "Active",
    refferal_products_image: "",
  });

  const imageUrlBase =
    detailData?.image_url ||
    "https://singleclik.com/api/storage/app/public/refferalproducts_images/";

  useEffect(() => {
    if (detailData?.data) {
      const p = detailData.data;
      setForm({
        refferal_products_for: p.refferal_products_for ?? "1,2",
        refferal_products: p.refferal_products ?? "",
        refferal_products_description: p.refferal_products_description ?? "",
        refferal_products_points: String(p.refferal_products_points ?? ""),
        refferal_product_validity:
          p.refferal_product_validity !== null &&
          p.refferal_product_validity !== undefined
            ? String(p.refferal_product_validity)
            : "",
        refferal_products_status: p.refferal_products_status ?? "Active",
        refferal_products_image: p.refferal_products_image ?? "",
      });
    }
  }, [detailData]);

  const onInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
      setLocalPreview(URL.createObjectURL(file));
    } else {
      setLocalPreview(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!id) return;

    if (!form.refferal_products_for) {
      toast.error("Please specify audience (Business, Consumer, or Both)");
      return;
    }

    if (!form.refferal_products.trim()) {
      toast.error("Please enter product title");
      return;
    }

    if (!form.refferal_products_points) {
      toast.error("Please enter required referral points");
      return;
    }

    updateMutation.mutate(
      {
        id,
        refferal_products_for: form.refferal_products_for,
        refferal_products: form.refferal_products,
        refferal_products_description: form.refferal_products_description,
        refferal_products_points: form.refferal_products_points,
        refferal_product_validity: form.refferal_product_validity,
        refferal_products_status: form.refferal_products_status,
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

  const currentDisplayImage = localPreview
    ? localPreview
    : form.refferal_products_image
      ? `${imageUrlBase}${form.refferal_products_image}`
      : NO_IMAGE;

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Edit Referral Product"
          description="Update reward item properties, target audience, points, validity and status."
          backTo="/referral-products"
        />

        {isLoading ? (
          <div className="rounded-xl border border-outline bg-surface-container-lowest p-16 shadow-md">
            <Spinner className="py-16" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            Failed to load referral product details.
          </div>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Edit Referral Reward</CardTitle>
                  <CardDescription>
                    Update parameters and toggle active availability.
                  </CardDescription>
                </div>
                <StatusBadge status={form.refferal_products_status} />
              </div>
            </CardHeader>
            <CardContent>
              {/* Product Image Section */}
              <div className="mb-6 flex flex-col items-center gap-2">
                <div className="relative">
                  <img
                    src={currentDisplayImage}
                    alt={form.refferal_products || "Referral Product"}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = NO_IMAGE;
                    }}
                    className="size-24 rounded-2xl border border-outline object-cover shadow-sm"
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
                    name="refferal_products_image"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </div>
                {selectedFile ? (
                  <p className="max-w-xs truncate text-xs text-primary font-medium">
                    New file selected: {selectedFile.name}
                  </p>
                ) : (
                  <p className="text-xs text-on-surface-variant">
                    Click pencil to upload a new image
                  </p>
                )}
              </div>

              <form id="editReferralProductForm" autoComplete="off" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Target Audience (1, 2, or both) */}
                  <div className="space-y-3 md:col-span-2 rounded-xl border border-outline/50 bg-surface-container-low/50 p-4">
                    <div>
                      <Label htmlFor="refferal_products_for" className="text-sm font-semibold">
                        Applicable For (Audience) <span className="text-error">*</span>
                      </Label>
                      <p className="text-xs text-on-surface-variant">
                        Select whether this reward is for Businesses (1), Consumers (2), or Both.
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

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="refferal_products">
                      Product Title <span className="text-error">*</span>
                    </Label>
                    <Input
                      id="refferal_products"
                      name="refferal_products"
                      type="text"
                      value={form.refferal_products}
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="refferal_products_status">
                      Status <span className="text-error">*</span>
                    </Label>
                    <Select
                      value={form.refferal_products_status}
                      onValueChange={(val) =>
                        setForm((prev) => ({ ...prev, refferal_products_status: val }))
                      }
                      required
                    >
                      <SelectTrigger id="refferal_products_status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Points */}
                  <div className="space-y-2">
                    <Label htmlFor="refferal_products_points">
                      Points Required <span className="text-error">*</span>
                    </Label>
                    <Input
                      id="refferal_products_points"
                      name="refferal_products_points"
                      type="number"
                      min="1"
                      value={form.refferal_products_points}
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  {/* Validity */}
                  <div className="space-y-2">
                    <Label htmlFor="refferal_product_validity">
                      Validity Period (in Days)
                    </Label>
                    <Input
                      id="refferal_product_validity"
                      name="refferal_product_validity"
                      type="number"
                      min="1"
                      placeholder="e.g. 30, 60, 90"
                      value={form.refferal_product_validity}
                      onChange={onInputChange}
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
                      value={form.refferal_products_description}
                      onChange={onInputChange}
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/referral-products")}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    <Send className="size-4" />
                    <span>
                      {updateMutation.isPending ? "Updating..." : "Update Product"}
                    </span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ReferralProductEdit;
