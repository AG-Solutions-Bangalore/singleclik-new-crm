import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useCategoriesDropdown } from "@/modules/categories/hooks/useCategories";
import {
  useSubCategoryDetail,
  useUpdateSubCategory,
} from "@/modules/categories/hooks/useSubCategories";
import type { SubCategoryEditFormState } from "@/modules/categories/types/categories";

const status = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const SubCategoryEdit = () => {
  const [categoriesSub, setCategoriesSub] = useState<SubCategoryEditFormState>({
    category_id: "",
    subcategory: "",
    subcategory_status: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: subDetail } = useSubCategoryDetail(id);
  const { data: categories = [] } = useCategoriesDropdown();
  const updateSubCategory = useUpdateSubCategory(id, {
    onUpdated: () => {
      navigate("/");
    },
  });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoriesSub({
      ...categoriesSub,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (subDetail) {
      const payload = subDetail;
      setCategoriesSub({
        category_id: String(payload?.category_id ?? ""),
        subcategory: payload?.subcategory ?? "",
        subcategory_status: payload?.subcategory_status ?? "",
      });
    }
  }, [subDetail]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateSubCategory.mutate(categoriesSub);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader title="Edit Sub Category" description="Update the sub category details." backTo="/" />
        <Card>
          <CardHeader>
            <CardTitle>Sub Category Details</CardTitle>
            <CardDescription>Change the parent category, name or status.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category_id">
                    Category Name <span className="text-error">*</span>
                  </Label>
                  <Select
                    name="category_id"
                    value={categoriesSub.category_id}
                    onValueChange={(value) =>
                      setCategoriesSub({ ...categoriesSub, category_id: value })
                    }
                    required
                  >
                    <SelectTrigger id="category_id">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((data) => (
                        <SelectItem key={data.id} value={String(data.id)}>
                          {data.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">
                    Sub Category Name <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="subcategory"
                    name="subcategory"
                    type="text"
                    onChange={onInputChange}
                    value={categoriesSub.subcategory}
                    placeholder="Sub Category Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory_status">
                    Category Status <span className="text-error">*</span>
                  </Label>
                  <Select
                    name="subcategory_status"
                    value={categoriesSub.subcategory_status}
                    onValueChange={(value) =>
                      setCategoriesSub({ ...categoriesSub, subcategory_status: value })
                    }
                    required
                  >
                    <SelectTrigger id="subcategory_status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {status.map((data) => (
                        <SelectItem key={data.label} value={data.value}>
                          {data.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <FormActions
                isPending={updateSubCategory.isPending}
                pendingLabel="Updating..."
                submitLabel="Update"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SubCategoryEdit;
