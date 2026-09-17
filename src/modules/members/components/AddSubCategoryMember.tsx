import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MEMBERS_API } from "../api/members";
import type { CategoryOption, SubCategoryOption } from "../types/member";

interface AddSubCategoryMemberProps {
  open: boolean;
  handleOpenSubCategory: () => void;
  id: string | undefined;
  fetchData: () => void;
}

const AddSubCategoryMember = ({
  open,
  handleOpenSubCategory,
  id,
  fetchData,
}: AddSubCategoryMemberProps) => {
  const [profile, setProfile] = useState({
    category: "",
    catg_id: "",
    u_subcatg_id: "",
  });

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesSub, setCategoriesSub] = useState<SubCategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(MEMBERS_API.userCategoriesById(id ?? ""), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategories(response.data?.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = useCallback(async () => {
    if (!profile.catg_id) return;
    try {
      const response = await axios.get(
        MEMBERS_API.registerSubCategoriesByValue(profile.catg_id || ""),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCategoriesSub(response.data.categoriessub || []);
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    }
  }, [profile?.catg_id]);

  useEffect(() => {
    fetchCategories();
  }, [fetchData]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!profile.u_subcatg_id) {
      setError("Please select a sub-category");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        MEMBERS_API.createSubCategory,
        {
          u_id: id,
          u_subcatg_id: profile.u_subcatg_id,
          u_subcatg_other_sub_category: "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == "200") {
        handleOpenSubCategory();
        toast.success("SubCategory Added Succesfully");
        fetchData();

        setProfile({
          category: "",
          catg_id: "",
          u_subcatg_id: "",
        });
      } else {
        setError(response.data.message || "Failed to add sub-category");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      setError(message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleOpenSubCategory();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add SubCategory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-label-sm font-medium text-error">{error}</p>}
          <div className="flex flex-col gap-2">
            <Label htmlFor="member-sub-category" className="flex items-center gap-2">
              <FileText className="size-4 text-secondary" />
              Category<span className="text-error">*</span>
            </Label>
            <Select
              value={profile.catg_id}
              onValueChange={(value) => {
                setProfile((prev) => ({ ...prev, catg_id: value, u_subcatg_id: "" }));
                setCategoriesSub([]);
              }}
            >
              <SelectTrigger id="member-sub-category">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="member-sub-subcategory" className="flex items-center gap-2">
              <FileText className="size-4 text-tertiary" />
              Sub Category<span className="text-error">*</span>
            </Label>
            <Select
              value={profile.u_subcatg_id}
              onValueChange={(value) =>
                setProfile((prev) => ({ ...prev, u_subcatg_id: value }))
              }
              disabled={!profile.catg_id}
            >
              <SelectTrigger id="member-sub-subcategory">
                <SelectValue placeholder="Select Sub Category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesSub.map((subCategory) => (
                  <SelectItem key={subCategory.id} value={String(subCategory.id)}>
                    {subCategory.subcategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleOpenSubCategory}
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubCategoryMember;
