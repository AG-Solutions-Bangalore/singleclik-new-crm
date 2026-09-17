import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdSend } from "react-icons/md";
import Layout from "@/components/layout/Layout";
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
import { StatusBadge } from "@/components/common/StatusBadge";
import { storageImage } from "@/lib/constants";
import SubCategoryEditList from "@/modules/categories/components/SubCategoryEditList";
import {
  useCategoryDetail,
  useUpdateCategory,
} from "@/modules/categories/hooks/useCategories";
import type {
  CategoryEditFormState,
  CategoryUser,
} from "@/modules/categories/types/categories";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const profileOptions = [
  { value: "0", label: "Business" },
  { value: "1", label: "Service" },
  { value: "0,1", label: "Business/Service" },
];

const CategoryEdit = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryEditFormState>({
    category: "",
    category_status: "",
    category_type: "",
    category_image: "",
    category_sort: "",
  });
  const [categoryUser, setCategoryUser] = useState<CategoryUser[]>([]);
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { data: categoryDetail, error: categoryError } = useCategoryDetail(id);
  const updateCategory = useUpdateCategory(id, {
    onUpdated: () => {
      navigate("/category");
    },
  });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (categoryDetail) {
      setCategoryData(categoryDetail.categories);
      setCategoryUser(categoryDetail.user ?? []);
    }
  }, [categoryDetail]);

  useEffect(() => {
    if (categoryError) {
      console.error("Error fetching category edit:", categoryError);
    }
  }, [categoryError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateCategory.mutate({ form: categoryData, file: selectedFile });
  };

  const imageUrl = storageImage("categories_images", categoryData.category_image);

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Edit Category"
          description="Update category details, image and status."
          backTo="/category"
        />
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
            <CardDescription>Image, sort order and visibility status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5 lg:flex-row">
              <div className="flex shrink-0 flex-col items-center gap-2">
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Category"
                    className="size-24 rounded-2xl border border-outline object-cover shadow-sm"
                  />
                  <button
                    type="button"
                    className="absolute -right-2 -bottom-2 cursor-pointer rounded-full border border-outline bg-surface p-1.5 shadow-md transition-colors hover:bg-surface-container-low"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change category image"
                  >
                    <MdEdit title="Edit Pic" className="size-4 text-on-surface" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    name="category_image"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </div>
                {selectedFile ? (
                  <p className="max-w-36 truncate text-body-md text-on-surface-variant">
                    {selectedFile.name}
                  </p>
                ) : (
                  <StatusBadge status={categoryData.category_status} />
                )}
              </div>

              <form
                id="categoryForm"
                autoComplete="off"
                onSubmit={handleSubmit}
                className="min-w-0 flex-1"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      type="text"
                      name="category"
                      onChange={onInputChange}
                      value={categoryData.category}
                      disabled
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category_type">Category Type</Label>
                    <Input
                      id="category_type"
                      type="text"
                      name="category_type"
                      disabled
                      onChange={onInputChange}
                      value={
                        profileOptions.find(
                          (type) => type.value === categoryData.category_type
                        )?.label || "Category Type"
                      }
                      required
                    />
                  </div>
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
                      value={categoryData.category_sort}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category_status">
                      Category Status <span className="text-error">*</span>
                    </Label>
                    <Select
                      name="category_status"
                      value={categoryData.category_status}
                      onValueChange={(value) =>
                        setCategoryData({ ...categoryData, category_status: value })
                      }
                      required
                    >
                      <SelectTrigger id="category_status">
                        <SelectValue placeholder="Select Status" />
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

                <div className="mt-5 flex justify-end">
                  <Button type="submit" disabled={updateCategory.isPending}>
                    <MdSend />
                    <span>{updateCategory.isPending ? "Updating..." : "Update"}</span>
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 md:gap-5 lg:flex-row">
          <Card className="w-full overflow-hidden p-0 lg:max-w-md">
            <CardHeader className="px-4 pt-4 pb-3">
              <CardTitle>Users in this Category</CardTitle>
              <CardDescription>
                {categoryUser.length} {categoryUser.length === 1 ? "member" : "members"} assigned.
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[380px] overflow-y-auto px-2 pb-3">
              {categoryUser.length === 0 ? (
                <p className="py-8 text-center text-body-md text-on-surface-variant italic">
                  No users available
                </p>
              ) : (
                <ul className="flex flex-col">
                  {categoryUser.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-container-low"
                    >
                      <img
                        src={storageImage("user_images", item.photo)}
                        alt={item.name}
                        loading="lazy"
                        className="size-10 shrink-0 rounded-full border border-outline object-cover"
                      />
                      <p className="truncate text-body-md font-medium text-on-surface">
                        {item.name}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <div className="min-w-0 flex-1">
            <SubCategoryEditList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryEdit;
