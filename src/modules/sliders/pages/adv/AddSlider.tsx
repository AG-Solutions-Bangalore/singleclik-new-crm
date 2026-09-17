import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ImagePlus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { FormActions } from "@/components/common/FormActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { useCreateAdvSlider } from "@/modules/sliders/hooks/useAdvSlider";

const AddSlider = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [advSlider, setAdvSlider] = useState({
    slider_url: "",
    slider_images: "",
  });
  const navigate = useNavigate();
  const createMutation = useCreateAdvSlider();

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAdvSlider({
      ...advSlider,
      [e.target.name]: e.target.value,
    });
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { slider_url: advSlider.slider_url, selectedFile },
      {
        onSuccess: (res) => {
          if (res.data.code == "200") {
            toast.success("Adv Slider Create  succesfull");

            setAdvSlider({
              slider_url: "",
              slider_images: "",
            });
            navigate("/adv-slider");
          } else {
            toast.error("duplicate entry");
          }
        },
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Create Ad Slider"
          description="Add a new advertisement banner."
          backTo="/adv-slider"
        />
        <Card>
          <CardHeader>
            <CardTitle>Banner Details</CardTitle>
            <CardDescription>Upload the banner image and set its destination link.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="slider_images">Banner Image</Label>
                  <label
                    htmlFor="slider_images"
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-outline bg-surface-container-low px-4 py-3 transition-colors hover:border-primary hover:bg-surface"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                      <ImagePlus className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-label-md font-medium text-on-surface">
                        {selectedFile ? selectedFile.name : "Choose an image"}
                      </span>
                      <span className="block text-body-md text-on-surface-variant">
                        Wide banners work best
                      </span>
                    </span>
                  </label>
                  <Input
                    id="slider_images"
                    type="file"
                    accept="image/*"
                    name="slider_images"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slider_url">
                    Destination URL <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="slider_url"
                    type="text"
                    name="slider_url"
                    onChange={onInputChange}
                    value={advSlider.slider_url}
                    placeholder="https://example.com/offer"
                    required
                  />
                </div>
              </div>
              <FormActions
                isPending={createMutation.isPending}
                pendingLabel="Submiting...."
                submitLabel="Submit"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddSlider;
