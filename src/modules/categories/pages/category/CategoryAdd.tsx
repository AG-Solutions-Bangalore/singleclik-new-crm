import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdSend } from "react-icons/md";
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
import { CATEGORIES_API } from "@/modules/categories/api/categories";
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategories({
      ...categories,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    try {
      const data = new FormData();
      data.append("category", categories.category);
      data.append("category_type", categories.category_type);
      data.append("category_sort", categories.category_sort);
      if (selectedFile) {
        data.append("category_image", selectedFile);
      }

      const res = await axios({
        url: CATEGORIES_API.create,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.code == "200") {
        toast.success("Sub Category succesfull");

        setCategories({
          category: "",
          category_type: "",
          category_image: "",
          category_sort: "",
        });
        navigate("/category");
      } else {
        toast.error("duplicate entry");
      }
    } catch (error) {
      console.error("Error creating category", error);
    } finally {
      setIsButtonDisabled(false);
    }
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

            <div className="mt-6 flex justify-center">
              <Button type="submit" disabled={isButtonDisabled}>
                <MdSend />
                <span>{isButtonDisabled ? "Submiting...." : "Submit"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CategoryAdd;
