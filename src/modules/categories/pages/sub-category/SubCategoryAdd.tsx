import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSend } from "react-icons/md";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
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
import { Spinner } from "@/components/ui/spinner";
import { useCategoriesDropdown } from "@/modules/categories/hooks/useCategories";
import { useCreateSubCategory } from "@/modules/categories/hooks/useSubCategories";
import type { SubCategoryAddFormState } from "@/modules/categories/types/categories";

const SubCategoryAdd = () => {
  const [categoriesSub, setCategoriesSub] = useState<SubCategoryAddFormState>({
    category: "",
    subcategory: "",
  });

  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const { data: categories = [], isLoading, error } = useCategoriesDropdown();
  const createSubCategory = useCreateSubCategory({
    onCreated: () => {
      setCategoriesSub({
        category: "",
        subcategory: "",
      });
      navigate("/");
    },
  });

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching category data", error);
    }
  }, [error]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoriesSub({
      ...categoriesSub,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSubCategory.mutate(categoriesSub);
  };

  if (isLoading) {
    return (
      <Layout>
        <PageHeader
          title="Create Sub Category"
          description="Add a new sub category under a category."
          backTo="/sub-category"
        />
        <Spinner className="py-16" />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Create Sub Category"
        description="Add a new sub category under a category."
        backTo="/sub-category"
      />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Sub Category Details</CardTitle>
          <CardDescription>Choose the parent category and enter the sub category name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category Name <span className="text-error">*</span>
                </Label>
                <Select
                  name="category"
                  value={categoriesSub.category}
                  onValueChange={(value) =>
                    setCategoriesSub({ ...categoriesSub, category: value })
                  }
                  required
                >
                  <SelectTrigger id="category">
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
                  type="text"
                  name="subcategory"
                  onChange={onInputChange}
                  value={categoriesSub.subcategory}
                  placeholder="Sub Category Name"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button type="submit" disabled={createSubCategory.isPending}>
                <MdSend />
                <span>{createSubCategory.isPending ? "Submiting...." : "Submit"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SubCategoryAdd;
