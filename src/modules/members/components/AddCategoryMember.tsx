import { useEffect, useState } from "react";
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
import type { CategoryOption } from "../types/member";

interface AddCategoryMemberProps {
  open: boolean;
  handleOpenCategory: () => void;
  id: string | undefined;
  fetchData: () => void;
}

const AddCategoryMember = ({ open, handleOpenCategory, id, fetchData }: AddCategoryMemberProps) => {
  const [profile, setProfile] = useState({
    category: "",
    catg_id: "",
  });
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(MEMBERS_API.categories, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching Categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!profile.catg_id) {
      setError("Please select a category");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        MEMBERS_API.createCategory,
        {
          u_id: id,
          u_catg_id: profile.catg_id,
          u_catg_other_sub_category: "",
          u_catg_other_category: "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == "200") {
        handleOpenCategory();
        toast.success("Category Added Succesfully");
        fetchData();

        setProfile({
          category: "",
          catg_id: "",
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
