import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
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
import { CATEGORIES_API } from "@/modules/categories/api/categories";
import { storageImage } from "@/lib/constants";
import SubCategoryEditList from "@/modules/categories/components/SubCategoryEditList";
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(CATEGORIES_API.byId(String(id ?? "")), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategoryData(response.data.categories);
        setCategoryUser(response.data.user ?? []);
      } catch (error) {
        console.error("Error fetching category edit:", error);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category", categoryData.category);
    formData.append("category_status", categoryData.category_status);
    formData.append("category_type", categoryData.category_type);
    formData.append("category_sort", categoryData.category_sort);
    if (selectedFile) {
      formData.append("category_image", selectedFile);
    }

    try {
      setIsButtonDisabled(true);
      const response = await axios.post(
        CATEGORIES_API.update(String(id ?? "")),
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.code == "200") {
        toast.success("Category updated successfully");
        navigate("/category");
      } else {
        toast.error("Duplicate entry");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const imageUrl = storageImage("categories_images", categoryData.category_image);

  return (
    <Layout>
      <PageHeader
        title="Edit Category"
        description="Update category details, image and status."
        backTo="/category"
      />
      <Card className="mt-4">
        <CardContent>
          <div className="flex flex-col items-center gap-4 lg:flex-row">
            <div className="relative flex w-44 flex-shrink-0 items-center justify-center">
              <img
                src={imageUrl}
                alt="Category"
                className="mb-2 h-20 w-20 rounded-full border-l-4 border-dashed border-primary"
              />
              <div className="absolute right-0 bottom-0 -translate-x-10 -translate-y-6 lg:right-0 lg:bottom-1/2 lg:-translate-x-10 lg:-translate-y-1">
                <button
                  type="button"
                  className="cursor-pointer rounded-full border border-outline bg-emerald-400 p-[3px] hover:bg-emerald-300"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change category image"
                >
                  <MdEdit title="Edit Pic" className="h-4 w-4 text-on-surface" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  name="category_image"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </div>
            </div>

            <form
              id="categoryForm"
              autoComplete="off"
              onSubmit={handleSubmit}
              className="flex-grow"
            >
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
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

              <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row">
                <div>
                  {selectedFile && (
                    <div className="mt-2">
                      <p className="text-sm text-error">{selectedFile.name}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 lg:flex-row">
                  <Button type="submit" size="sm" disabled={isButtonDisabled}>
                    <MdSend />
                    <span>{isButtonDisabled ? "Updating..." : "Update"}</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="mt-2 flex flex-col gap-2 lg:flex-row">
        <Card className="h-[420px] w-full overflow-hidden lg:max-w-md">
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>Users under this category.</CardDescription>
          </CardHeader>
          <CardContent className="h-full overflow-y-auto pb-16">
            {categoryUser.length === 0 ? (
              <p className="text-center text-body-md text-on-surface-variant italic">
                No users available
              </p>
            ) : (
              categoryUser.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 flex flex-row items-center gap-4 border-b border-dashed border-outline pb-2"
                >
                  <img
                    src={storageImage("user_images", item.photo)}
                    alt="User photo"
                    className="h-12 w-12 rounded-full border-r-2 border-primary shadow-sm"
                  />
                  <p className="text-sm font-semibold text-on-surface">{item.name}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <SubCategoryEditList />
      </div>
    </Layout>
  );
};

export default CategoryEdit;
