import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import type {
  CategoryRow,
  SubCategoryEditFormState,
} from "@/modules/categories/types/categories";

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
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoriesSub({
      ...categoriesSub,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    axios({
      url: CATEGORIES_API.subById(String(id ?? "")),
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      const payload = res.data?.categoriessub;
      setCategoriesSub({
        category_id: String(payload?.category_id ?? ""),
        subcategory: payload?.subcategory ?? "",
        subcategory_status: payload?.subcategory_status ?? "",
      });
    });
  }, [id]);

  useEffect(() => {
    axios({
      url: CATEGORIES_API.dropdown,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setCategories(res.data.categories ?? []);
    });
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsButtonDisabled(true);

    try {
      const data = {
        category_id: categoriesSub.category_id,
        subcategory: categoriesSub.subcategory,
        subcategory_status: categoriesSub.subcategory_status,
      };

      const res = await axios({
        url: CATEGORIES_API.subUpdate(String(id ?? "")),
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.code == "200") {
        toast.success("update succesfull");
        navigate("/");
      } else {
        toast.error("duplicate entry");
      }
    } catch (error) {
      console.error("Error updating sub category", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <PageHeader title="Edit Sub Category" description="Update the sub category details." backTo="/" />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Sub Category Details</CardTitle>
          <CardDescription>Change the parent category, name or status.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-5">
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

            <div className="mt-6 flex justify-center">
              <Button type="submit" disabled={isButtonDisabled}>
                <MdSend />
                <span>{isButtonDisabled ? "Updating..." : "Update"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SubCategoryEdit;
