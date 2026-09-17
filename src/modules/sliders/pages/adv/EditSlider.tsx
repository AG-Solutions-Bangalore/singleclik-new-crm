import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Pencil, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { AvatarImage } from "@/components/common/AvatarImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useAdvSliderDetail, useUpdateAdvSlider } from "@/modules/sliders/hooks/useAdvSlider";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditSlider = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [advSlider, setAdvSlider] = useState({
    slider_images: "",
    slider_url: "",
    slider_status: "",
  });
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo = storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;

  const { data: sliderData, error } = useAdvSliderDetail(id);
  const updateMutation = useUpdateAdvSlider();

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAdvSlider({
      ...advSlider,
      [e.target.name]: e.target.value,
    });
  };

  const onStatusChange = (value: string) => {
    setAdvSlider((prev) => ({
      ...prev,
      slider_status: value,
    }));
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  const handleBack = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/adv-slider?page=${pageNo}`);
  };

  useEffect(() => {
    if (sliderData) {
      setAdvSlider(sliderData);
    }
  }, [sliderData]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching ADv Slider:", error);
    }
  }, [error]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    updateMutation.mutate(
      {
        id,
        slider_url: advSlider.slider_url,
        slider_status: advSlider.slider_status,
        selectedFile,
      },
      {
        onSuccess: (response) => {
          if (response.data.code == "200") {
            toast.success("Adv Slider updated successfully");
            navigate(`/adv-slider?page=${pageNo}`);
          } else {
            toast.error("Duplicate entry");
          }
        },
      },
    );
  };

  return (
    <Layout>
      <div className="space-y-4">
        <PageHeader
          title="Adv Slider Edit"
          description="Update advertisement slider details"
          backTo={`/adv-slider?page=${pageNo}`}
        />
        <Card>
          <CardContent>
            <div className="relative m-auto mb-6 flex w-44 flex-col items-center">
              <AvatarImage
                folder="slider_images"
                file={advSlider.slider_images}
                alt="Slider"
                size="xl"
                className="mb-2 border-2"
              />
              <div className="absolute right-0 bottom-0 -translate-x-6 -translate-y-1/4 transform">
                <div
                  className="cursor-pointer rounded-full border border-outline bg-surface-container-low p-[3px] hover:bg-surface-container"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Pencil className="h-6 w-6 text-on-surface" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  name="slider_images"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
              {selectedFile && <p className="text-sm text-on-surface-variant">{selectedFile.name}</p>}
            </div>

            <form id="categoryForm" autoComplete="off" onSubmit={handleSubmit} className="mt-2">
              <div className="mb-4 space-y-1.5">
                <Label htmlFor="slider_url">Slider Url</Label>
                <Input
                  id="slider_url"
                  type="text"
                  name="slider_url"
                  onChange={onInputChange}
                  value={advSlider.slider_url}
                  required
                />
              </div>
              <div className="mb-4 space-y-1.5">
                <Label htmlFor="slider_status">
                  Adv Slider Status <span className="text-red-700">*</span>
                </Label>
                <Select value={advSlider.slider_status} onValueChange={onStatusChange} required>
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

              <div className="flex justify-start gap-3">
                <Button type="submit" variant="primary" disabled={updateMutation.isPending}>
                  <Send />
                  <span>{updateMutation.isPending ? "Updating..." : "Update"}</span>
                </Button>
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditSlider;
