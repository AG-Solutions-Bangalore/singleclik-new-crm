import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { AvatarImage } from "@/components/common/AvatarImage";
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
import { usePopupSliderDetail, useUpdatePopupSlider } from "@/modules/sliders/hooks/usePopupSlider";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditPopupSlider = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [popupSlider, setPopupSlider] = useState({
    slider_images: "",
    slider_url: "",
    slider_status: "",
  });
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: sliderData, error } = usePopupSliderDetail(id);
  const updateMutation = useUpdatePopupSlider();

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPopupSlider({
      ...popupSlider,
      [e.target.name]: e.target.value,
    });
  };

  const onStatusChange = (value: string) => {
    setPopupSlider((prev) => ({
      ...prev,
      slider_status: value,
    }));
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  useEffect(() => {
    if (sliderData) {
      setPopupSlider(sliderData);
    }
  }, [sliderData]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching Popup Slider:", error);
    }
  }, [error]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    updateMutation.mutate(
      {
        id,
        slider_url: popupSlider.slider_url,
        slider_status: popupSlider.slider_status,
        selectedFile,
      },
      {
        onSuccess: (response) => {
          if (response.data.code == "200") {
            toast.success("Popup Slider updated successfully");
            navigate("/popup-slider");
          } else {
            toast.error("Duplicate entry");
          }
        },
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Edit Popup Slider"
          description="Update the popup image, link and status."
          backTo="/popup-slider"
        />
        <Card>
          <CardHeader>
            <CardTitle>Popup Details</CardTitle>
            <CardDescription>Preview the artwork, then update the fields below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col items-center gap-2">
              <div className="relative">
                <AvatarImage
                  folder="slider_images"
                  file={popupSlider.slider_images}
                  alt="Popup slider"
                  size="xl"
                  className="rounded-2xl border"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change popup image"
                  className="absolute -right-2 -bottom-2 cursor-pointer rounded-full border border-outline bg-surface p-1.5 shadow-md transition-colors hover:bg-surface-container-low"
                >
                  <Pencil className="size-4 text-on-surface" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  name="slider_images"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
              {selectedFile && (
                <p className="max-w-56 truncate text-body-md text-on-surface-variant">
                  {selectedFile.name}
                </p>
              )}
            </div>
            <form id="categoryForm" autoComplete="off" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="slider_url">
                    Destination URL <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="slider_url"
                    type="text"
                    name="slider_url"
                    onChange={onInputChange}
                    value={popupSlider?.slider_url}
                    placeholder="https://example.com/offer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slider_status">
                    Status <span className="text-error">*</span>
                  </Label>
                  <Select value={popupSlider?.slider_status} onValueChange={onStatusChange} required>
                    <SelectTrigger id="slider_status">
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
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={() => navigate("/popup-slider")}>
                  Back
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  <Send />
                  <span>{updateMutation.isPending ? "Updating..." : "Update"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditPopupSlider;
