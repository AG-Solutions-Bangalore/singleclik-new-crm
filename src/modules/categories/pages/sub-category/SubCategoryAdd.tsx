import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
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
import { CATEGORIES_API } from "@/modules/categories/api/categories";
import type {
  CategoryRow,
  SubCategoryAddFormState,
} from "@/modules/categories/types/categories";

const SubCategoryAdd = () => {
  const [categoriesSub, setCategoriesSub] = useState<SubCategoryAddFormState>({
    category: "",
    subcategory: "",
  });

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useAppContext();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(CATEGORIES_API.dropdown, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories(response.data?.categories ?? []);
      } catch (error) {
        console.error("Error fetching category data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoriesSub({
      ...categoriesSub,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    try {
      const data = {
        category: categoriesSub.category,
        subcategory: categoriesSub.subcategory,
      };

      const res = await axios({
        url: CATEGORIES_API.subCreate,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.code == "200") {
        toast.success("Sub Category succesfull");

        setCategoriesSub({
          category: "",
          subcategory: "",
        });
        navigate("/");
      } else {
        toast.error("duplicate entry");
      }
    } catch (error) {
      console.error("Error creating sub category", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  if (loading) {
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

export default SubCategoryAdd;
