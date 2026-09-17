import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { FormActions } from "@/components/common/FormActions";
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
import { useCreateCategory } from "@/modules/categories/hooks/useCategories";
import type { CategoryFormState } from "@/modules/categories/types/categories";

const profile_type = [
  { value: "0", label: "Business" },
  { value: "1", label: "Service" },
  { value: "0,1", label: "Business/Service" },
];

const CategoryAdd = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<CategoryFormState>({
    category: "",
    category_type: "",
    category_image: "",
    category_sort: "",
  });
  const navigate = useNavigate();
  const createCategory = useCreateCategory({
    onCreated: () => {
      setCategories({
        category: "",
        category_type: "",
        category_image: "",
        category_sort: "",
      });
      navigate("/category");
    },
  });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategories({
      ...categories,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCategory.mutate({ form: categories, file: selectedFile });
  };

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
            <CardDescription>Fill in the category name, type, image and sort order.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category_type">
                    Category Type <span className="text-error">*</span>
                  </Label>
                  <Select
                    name="category_type"
                    value={categories.category_type}
                    onValueChange={(value) =>
                      setCategories({ ...categories, category_type: value })
                    }
                    required
                  >
                    <SelectTrigger id="category_type">
                      <SelectValue placeholder="Select Category Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {profile_type.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category_image">Category Image</Label>
                  <label
                    htmlFor="category_image"
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-outline bg-surface-container-low px-4 py-3 transition-colors hover:border-primary hover:bg-surface"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                      <ImagePlus className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-label-md font-medium text-on-surface">
                        {selectedFile ? selectedFile.name : "Choose an image"}
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
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    className="hidden"
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
                    value={categories.category_sort}
                    placeholder="e.g. 1"
                    required
                  />
                </div>
              </div>

              <FormActions
                isPending={createCategory.isPending}
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

export default CategoryAdd;
