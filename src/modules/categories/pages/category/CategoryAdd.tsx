import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
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
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getToken } from "@/lib/auth-storage";
import { CATEGORIES_API } from "@/modules/categories/api/categories";
import { useCreateCategory } from "@/modules/categories/hooks/useCategories";
import type { CategoryFormState } from "@/modules/categories/types/categories";

const profile_type = [
  { value: "0", label: "Business" },
  { value: "1", label: "Service" },
  { value: "0,1", label: "Business/Service" },
];

const CategoryAdd = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<CategoryFormState>({
    category: "",
    category_type: "",
    category_image: "",
    category_sort: "",
  });

  const [subCategories, setSubCategories] = useState<string[]>([""]);

  // We suppress default toast from useCreateCategory so we can show a unified summary toast
  const createCategory = useCreateCategory({ showToast: false });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategories((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Add new subcategory row
  const addSubCategory = () => {
    setSubCategories((prev) => [...prev, ""]);
  };

  // Update subcategory value
  const updateSubCategory = (index: number, value: string) => {
    setSubCategories((prev) =>
      prev.map((item, i) => (i === index ? value : item)),
    );
  };

  // Remove subcategory row
  const removeSubCategory = (index: number) => {
    setSubCategories((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.length === 0 ? [""] : filtered;
    });
  };

  // Submit category and subcategories
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categories.category.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    if (!categories.category_type) {
      toast.error("Please select a category type");
      return;
    }
    if (!categories.category_sort) {
      toast.error("Please enter category sort order");
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Create category
      const createRes = await createCategory.mutateAsync({
        form: categories,
        file: selectedFile,
      });

      // Step 2: Get valid, non-empty subcategories
      const validSubCategories = subCategories
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      // Step 3: Create subcategories if any were entered
      if (validSubCategories.length > 0) {
        // Resolve newly created category ID
        let categoryId =
          createRes?.category?.id ??
          createRes?.data?.id ??
          createRes?.id ??
          createRes?.category_id;

        // If ID isn't directly in response, fetch dropdown to resolve ID by category name
        if (!categoryId) {
          try {
            const dropdownRes = await axios.get(CATEGORIES_API.dropdown, {
              headers: { Authorization: `Bearer ${getToken()}` },
            });
            const list = dropdownRes.data?.categories ?? [];
            const matched = list.find(
              (c: any) =>
                String(c.category || "").trim().toLowerCase() ===
                categories.category.trim().toLowerCase(),
            );
            if (matched?.id) {
              categoryId = matched.id;
            }
          } catch (err) {
            console.error("Could not fetch categories list to resolve ID:", err);
          }
        }

        const targetCatId = categoryId ? String(categoryId) : categories.category;

        // Create each subcategory linked to the category
        for (const subcategory of validSubCategories) {
          try {
            await axios({
              url: CATEGORIES_API.subCreate,
              method: "POST",
              data: {
                category: targetCatId,
                subcategory,
              },
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            });
          } catch (subErr) {
            console.error(`Error creating subcategory "${subcategory}":`, subErr);
          }
        }
      }

      // Invalidate queries so lists update immediately
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      toast.success(
        validSubCategories.length > 0
          ? `Category and ${validSubCategories.length} subcategory${validSubCategories.length > 1 ? "ies" : ""} created successfully!`
          : "Category created successfully!"
      );

      // Reset form
      setCategories({
        category: "",
        category_type: "",
        category_image: "",
        category_sort: "",
      });
      setSelectedFile(null);
      setSubCategories([""]);

      // Redirect to categories list
      navigate("/category");
    } catch (error: any) {
      console.error("Error creating category or subcategories:", error);
      toast.error(error?.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPending = isSubmitting || createCategory.isPending;

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Create Category"
          description="Add a new business or service category."
          backTo="/category"
        />

        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
            <CardDescription>
              Fill in the category name, type, image and sort order.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="addIndiv"
              autoComplete="off"
              onSubmit={onSubmit}
            >
              {/* Category Details */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Category Name */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category Name <span className="text-error">*</span>
                  </Label>

                  <Input
                    id="category"
                    type="text"
                    name="category"
                    onChange={onInputChange}
                    value={categories.category}
                    placeholder="e.g. Restaurants"
                    required
                    disabled={isPending}
                  />
                </div>

                {/* Category Type */}
                <div className="space-y-2">
                  <Label htmlFor="category_type">
                    Category Type <span className="text-error">*</span>
                  </Label>

                  <Select
                    name="category_type"
                    value={categories.category_type}
                    onValueChange={(value) =>
                      setCategories((prev) => ({
                        ...prev,
                        category_type: value,
                      }))
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger id="category_type">
                      <SelectValue placeholder="Select Category Type" />
                    </SelectTrigger>

                    <SelectContent>
                      {profile_type.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Image */}
                <div className="space-y-2">
                  <Label htmlFor="category_image">
                    Category Image
                  </Label>

                  <label
                    htmlFor="category_image"
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-outline bg-surface-container-low px-4 py-3 transition-colors hover:border-primary hover:bg-surface"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                      <ImagePlus className="size-4" aria-hidden />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-label-md font-medium text-on-surface">
                        {selectedFile
                          ? selectedFile.name
                          : "Choose an image"}
                      </span>

                      <span className="block text-body-md text-on-surface-variant">
                        PNG or JPG, square works best
                      </span>
                    </span>
                  </label>

                  <Input
                    id="category_image"
                    type="file"
                    accept="image/*"
                    name="category_image"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] ?? null)
                    }
                    className="hidden"
                    disabled={isPending}
                  />
                </div>

                {/* Category Sort */}
                <div className="space-y-2">
                  <Label htmlFor="category_sort">
                    Category Sort <span className="text-error">*</span>
                  </Label>

                  <Input
                    id="category_sort"
                    type="number"
                    min="0"
                    name="category_sort"
                    onChange={onInputChange}
                    value={categories.category_sort}
                    placeholder="e.g. 1"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              {/* SubCategory List */}
              <div className="mt-6 border-t border-outline pt-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-on-surface">
                      SubCategory List
                    </h3>

                    <p className="text-sm text-on-surface-variant">
                      Add optional subcategories under this category.
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={addSubCategory}
                    disabled={isPending}
                    className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all"
                  >
                    <Plus className="mr-1.5 size-4" />
                    Add Sub Category
                  </Button>
                </div>

                <div className="space-y-3">
                  {subCategories.map((subCategory, index) => (
                    <div
                      key={index}
                      className="flex items-end gap-3 rounded-lg border border-outline p-3"
                    >
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`subcategory-${index}`}>
                          SubCategory Name
                        </Label>

                        <Input
                          id={`subcategory-${index}`}
                          type="text"
                          value={subCategory}
                          onChange={(e) =>
                            updateSubCategory(index, e.target.value)
                          }
                          placeholder="Enter subcategory name (optional)"
                          disabled={isPending}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSubCategory(index)}
                        disabled={subCategories.length === 1 && !subCategory}
                        aria-label="Remove subcategory"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <FormActions
                isPending={isPending}
                pendingLabel="Submitting..."
                submitLabel="Submit"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CategoryAdd;
