import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import type { NotificationForm } from "../types/notifications";
import { useNotificationDetail, useUpdateNotification } from "../hooks/useNotifications";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditNotification = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notify, setNotify] = useState<NotificationForm>({
    notification_heading: "",
    notification_des: "",
    notification_images: "",
    notification_status: "",
  });
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: detailData, error: detailError } = useNotificationDetail(id);
  const updateMutation = useUpdateNotification();
  const isPending = updateMutation.isPending;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNotify({
      ...notify,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (detailData) {
      setNotify(detailData);
    }
  }, [detailData]);

  useEffect(() => {
    if (detailError) {
      console.error("Error fetching Notifiation Edit:", detailError);
    }
  }, [detailError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      {
        id: id ?? "",
        notification_heading: notify.notification_heading,
        notification_des: notify.notification_des,
        notification_status: notify.notification_status,
        selectedFile,
      },
      {
        onSuccess: ({ response }) => {
          if (response.data.code == "200") {
            navigate("/notification");
          }
        },
      },
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Edit Notification"
          description="Update the broadcast content and status."
          backTo="/notification"
        />
        <Card>
          <CardHeader>
            <CardTitle>Notification Content</CardTitle>
            <CardDescription>Preview the artwork, then update the fields below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col items-center gap-2">
              <div className="relative">
                <AvatarImage
                  folder="notification_images"
                  file={notify.notification_images}
                  alt={notify.notification_heading || "Notification"}
                  size="xl"
                  className="rounded-2xl border"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change notification image"
                  className="absolute -right-2 -bottom-2 cursor-pointer rounded-full border border-outline bg-surface p-1.5 shadow-md transition-colors hover:bg-surface-container-low"
                >
                  <Pencil className="size-4 text-on-surface" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  name="notification_images"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedFile(e.target.files?.[0] ?? null)
                  }
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
                  <Label htmlFor="notification_heading">
                    Heading <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="notification_heading"
                    type="text"
                    name="notification_heading"
                    onChange={onInputChange}
                    value={notify.notification_heading}
                    placeholder="Enter heading"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification_status">
                    Status <span className="text-error">*</span>
                  </Label>
                  <Select
                    name="notification_status"
                    value={notify.notification_status}
                    onValueChange={(value) =>
                      setNotify((prev) => ({ ...prev, notification_status: value }))
                    }
                    required
                  >
                    <SelectTrigger id="notification_status">
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
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notification_des">
                    Description <span className="text-error">*</span>
                  </Label>
                  <Textarea
                    id="notification_des"
                    name="notification_des"
                    onChange={onInputChange}
                    value={notify.notification_des}
                    placeholder="Enter description"
                    required
                    rows={4}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={() => navigate("/notification")}>
                  Back
                </Button>
                <Button type="submit" disabled={isPending}>
                  <Send />
                  <span>{isPending ? "Updating..." : "Update"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditNotification;
