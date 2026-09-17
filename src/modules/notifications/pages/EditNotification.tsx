import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
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
import { storageImage } from "@/lib/constants";
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

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const imageUrl = storageImage("notification_images", notify.notification_images);

  return (
    <Layout>
      <div className="space-y-4">
        <PageHeader
          title="Edit Notification"
          description="Update notification details"
          backTo="/notification"
        />
        <Card>
          <CardContent>
            <div className="relative mx-auto mb-6 flex w-44 flex-col items-center">
              <img
                src={imageUrl}
                alt="Notification"
                className="h-32 w-32 rounded-full border border-outline object-cover"
              />
              <div className="absolute right-4 bottom-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change notification image"
                  className="cursor-pointer rounded-full border border-outline bg-surface-container-low p-1.5 text-on-surface transition-colors hover:bg-surface-container"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  name="notification_images"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedFile(e.target.files?.[0] ?? null)
                  }
                  className="hidden"
                />
              </div>
              {selectedFile && (
                <p className="mt-2 text-sm text-on-surface-variant">{selectedFile.name}</p>
              )}
            </div>

            <form id="categoryForm" autoComplete="off" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notification_heading">Heading</Label>
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
                  <Label htmlFor="notification_des">Description</Label>
                  <Input
                    id="notification_des"
                    type="text"
                    name="notification_des"
                    onChange={onInputChange}
                    value={notify.notification_des}
                    placeholder="Enter description"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification_status">
                    Notification Status <span className="text-error">*</span>
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
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Button type="submit" variant="primary" disabled={isPending}>
                  <Send />
                  <span>{isPending ? "Updating..." : "Update"}</span>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/notification">
                    <ArrowLeft />
                    <span>Back</span>
                  </Link>
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
