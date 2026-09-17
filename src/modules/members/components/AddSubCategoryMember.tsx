import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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
import { useUserCategories, useRegisterSubCategoriesByValue } from "../hooks/useMemberCategories";
import { useCreateSubCategoryMember } from "../hooks/useMemberMutations";
import type { CategoryOption, SubCategoryOption } from "../types/member";

interface AddSubCategoryMemberProps {
  open: boolean;
  handleOpenSubCategory: () => void;
  id: string | undefined;
}

const AddSubCategoryMember = ({
  open,
  handleOpenSubCategory,
  id,
}: AddSubCategoryMemberProps) => {
  const [profile, setProfile] = useState({
    category: "",
    catg_id: "",
    u_subcatg_id: "",
  });

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesSub, setCategoriesSub] = useState<SubCategoryOption[]>([]);
  const [error, setError] = useState("");

  const { data: userCategoriesData, error: userCategoriesError } = useUserCategories(id);
  const { data: registerSubCategoriesData, error: registerSubCategoriesError } =
    useRegisterSubCategoriesByValue(profile.catg_id);
  const createSubCategoryMutation = useCreateSubCategoryMember(id, {
    onCreated: () => {
      handleOpenSubCategory();
      setProfile({
        category: "",
        catg_id: "",
        u_subcatg_id: "",
      });
    },
    onFailure: (message) => setError(message),
  });
  const isSubmitting = createSubCategoryMutation.isPending;

  useEffect(() => {
    if (userCategoriesData !== undefined) {
      setCategories(userCategoriesData);
    }
  }, [userCategoriesData]);

  useEffect(() => {
    if (userCategoriesError) {
      console.error("Error fetching categories:", userCategoriesError);
    }
  }, [userCategoriesError]);

  useEffect(() => {
    if (registerSubCategoriesData !== undefined) {
      setCategoriesSub(registerSubCategoriesData);
    }
  }, [registerSubCategoriesData]);

  useEffect(() => {
    if (registerSubCategoriesError) {
      console.error("Error fetching sub-categories:", registerSubCategoriesError);
    }
  }, [registerSubCategoriesError]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!profile.u_subcatg_id) {
      setError("Please select a sub-category");
      return;
    }

    createSubCategoryMutation.mutate(profile.u_subcatg_id);
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
