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
import { useMemberCategories } from "../hooks/useMemberCategories";
import { useCreateCategoryMember } from "../hooks/useMemberMutations";
import type { CategoryOption } from "../types/member";

interface AddCategoryMemberProps {
  open: boolean;
  handleOpenCategory: () => void;
  id: string | undefined;
}

const AddCategoryMember = ({ open, handleOpenCategory, id }: AddCategoryMemberProps) => {
  const [profile, setProfile] = useState({
    category: "",
    catg_id: "",
  });
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [error, setError] = useState("");

  const { data: categoriesData, error: categoriesError } = useMemberCategories();
  const createCategoryMutation = useCreateCategoryMember(id, {
    onCreated: () => {
      handleOpenCategory();
      setProfile({
        category: "",
        catg_id: "",
      });
    },
    onFailure: (message) => setError(message),
  });
  const isSubmitting = createCategoryMutation.isPending;

  useEffect(() => {
    if (categoriesData !== undefined) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (categoriesError) {
      console.error("Error fetching Categories:", categoriesError);
    }
  }, [categoriesError]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!profile.catg_id) {
      setError("Please select a category");
      return;
    }

    createCategoryMutation.mutate(profile.catg_id);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleOpenCategory();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-label-sm font-medium text-error">{error}</p>}
          <div className="flex flex-col gap-2">
            <Label htmlFor="member-category" className="flex items-center gap-2">
              <FileText className="size-4 text-secondary" />
              Category<span className="text-error">*</span>
            </Label>
            <Select
              value={profile.catg_id}
              onValueChange={(value) =>
                setProfile((prev) => ({ ...prev, catg_id: value }))
              }
            >
              <SelectTrigger id="member-category">
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
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleOpenCategory}
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

export default AddCategoryMember;
