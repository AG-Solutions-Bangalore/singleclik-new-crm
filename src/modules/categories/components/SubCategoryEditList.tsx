import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { RiArrowUpDoubleFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryDetail } from "@/modules/categories/hooks/useCategories";
import { useUpdateSubCategoryRow } from "@/modules/categories/hooks/useSubCategories";
import type {
  CategoryEditFormState,
  SubCategoryRow,
} from "@/modules/categories/types/categories";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const SubCategoryEditList = () => {
  const [categoryData, setCategoryData] = useState<CategoryEditFormState>({
    category: "",
    category_status: "",
    category_type: "",
    category_image: "",
    category_sort: "",
  });
  const [subcategories, setSubcategories] = useState<SubCategoryRow[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedSubcategories, setEditedSubcategories] = useState<SubCategoryRow[]>([]);
  const { id } = useParams();
  const { data: categoryDetail, error: categoryError } = useCategoryDetail(id);
  const updateSubCategory = useUpdateSubCategoryRow();

  useEffect(() => {
    if (categoryDetail) {
      setCategoryData(categoryDetail.categories);
      setSubcategories(categoryDetail.categoriessub ?? []);
      setEditedSubcategories(categoryDetail.categoriessub ?? []);
    }
  }, [categoryDetail]);

  useEffect(() => {
    if (categoryError) {
      console.error("Error fetching category edit:", categoryError);
    }
  }, [categoryError]);

  const handleEditClick = (index: number) => {
    setEditIndex(index);
  };

  const handleUpdateSubCat = (e: React.MouseEvent, index: number) => {
    e.preventDefault();

    const current = editedSubcategories[index];
    if (!current) return;

    setEditIndex(null);
    const subcategoryId = current.id;

    updateSubCategory.mutate({
      rowId: subcategoryId,
      data: {
        category_id: current.category_id,
        subcategory: current.subcategory,
        subcategory_status: current.subcategory_status,
      },
    });
  };

  const handleChange = (
    index: number,
    field: "subcategory" | "subcategory_status",
    value: string
  ) => {
    const updatedSubcategories = [...editedSubcategories];
    const current = updatedSubcategories[index];
    if (!current) return;
    updatedSubcategories[index] = { ...current, [field]: value };
    setEditedSubcategories(updatedSubcategories);
  };

  return (
    <Card className="h-[420px] w-full overflow-hidden">
      <CardHeader>
        <CardTitle>SubCategory List</CardTitle>
        <CardDescription>Inline edit sub categories of this category.</CardDescription>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto pb-16">
        <table className="min-w-full divide-y divide-outline">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-4 py-2 text-left text-label-sm font-medium text-on-surface-variant">
                Sl No
              </th>
              <th className="px-4 py-2 text-left text-label-sm font-medium text-on-surface-variant">
                Subcategory of {categoryData.category}
              </th>
              <th className="px-4 py-2 text-left text-label-sm font-medium text-on-surface-variant">
                Status
              </th>
              <th className="px-4 py-2 text-left text-label-sm font-medium text-on-surface-variant">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline bg-surface-container-lowest">
            {editedSubcategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-body-md text-on-surface-variant">
                  No subcategories found.
                </td>
              </tr>
            ) : (
              subcategories.map((subcat, index) => (
                <tr key={index} className="transition-colors hover:bg-surface-container-low">
                  <td className="px-4 py-2 text-body-md text-on-surface">{index + 1}</td>
                  <td className="px-4 py-2 text-body-md text-on-surface">
                    {editIndex === index ? (
                      <Input
                        type="text"
                        value={editedSubcategories[index]?.subcategory ?? ""}
                        onChange={(e) => handleChange(index, "subcategory", e.target.value)}
                        aria-label="Subcategory name"
                      />
                    ) : (
                      subcat.subcategory
                    )}
                  </td>
                  <td className="px-4 py-2 text-body-md text-on-surface">
                    {editIndex === index ? (
                      <Select
                        value={editedSubcategories[index]?.subcategory_status ?? ""}
                        onValueChange={(value) =>
                          handleChange(index, "subcategory_status", value)
                        }
                      >
                        <SelectTrigger aria-label="Subcategory status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      subcat.subcategory_status
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editIndex === index ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleUpdateSubCat(e, index)}
                        disabled={updateSubCategory.isPending}
                        aria-label="Save subcategory"
                        title="Save"
                      >
                        <RiArrowUpDoubleFill className="text-emerald-700" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(index)}
                        aria-label="Edit subcategory"
                        title="Edit"
                      >
                        <CiEdit className="text-emerald-700" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default SubCategoryEditList;
