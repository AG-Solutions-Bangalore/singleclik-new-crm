import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { createAdvSlider } from "@/modules/sliders/api/advSlider";

const AddSlider = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [advSlider, setAdvSlider] = useState({
    slider_url: "",
    slider_images: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

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
    setIsButtonDisabled(true);
    const data = new FormData();
    data.append("slider_url", advSlider.slider_url);
    data.append("slider_images", selectedFile as unknown as Blob);

    createAdvSlider(data).then((res) => {
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
    });
  };

  return (
    <Layout>
      <div className="space-y-4">
        <PageHeader
          title="Create Adv Slider"
          description="Add a new advertisement slider"
          backTo="/adv-slider"
        />
        <Card>
          <CardContent>
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="slider_images">Slider Image</Label>
                  <Input
                    id="slider_images"
                    type="file"
                    name="slider_images"
                    onChange={onFileChange}
                  />
                </div>
                <div className="space-y-1.5">
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
              </div>
              <div className="flex justify-center">
                <Button type="submit" variant="primary" disabled={isButtonDisabled}>
                  <Send />
                  <span>{isButtonDisabled ? "Submiting...." : "Submit"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddSlider;
