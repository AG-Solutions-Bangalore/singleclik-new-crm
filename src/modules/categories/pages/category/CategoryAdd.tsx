import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <PageHeader
        title="Create Category"
        description="Add a new business or service category."
        backTo="/category"
      />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Fill in the category name, type, image and sort order.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  placeholder="Category Name"
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
                <Input
                  id="category_image"
                  type="file"
                  name="category_image"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
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
                  placeholder="Category Sort"
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
    </Layout>
  );
};

export default CategoryAdd;
