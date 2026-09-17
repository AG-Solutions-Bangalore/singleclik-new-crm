import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { FormActions } from "@/components/common/FormActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/textarea";
import type { NotificationForm } from "../types/notifications";
import { useCreateNotification } from "../hooks/useNotifications";

type AddNotificationState = Pick<
  NotificationForm,
  "notification_heading" | "notification_des" | "notification_images"
>;

const AddNotification = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notify, setNotify] = useState<AddNotificationState>({
    notification_heading: "",
    notification_des: "",
    notification_images: "",
  });
  const navigate = useNavigate();
  const createMutation = useCreateNotification();
  const isPending = createMutation.isPending;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNotify({
      ...notify,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        notification_heading: notify.notification_heading,
        notification_des: notify.notification_des,
        selectedFile,
      },
      {
        onSuccess: (res) => {
          if (res.data.code == "200") {
            setNotify({
              notification_heading: "",
              notification_des: "",
              notification_images: "",
            });
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
          title="Create Notification"
          description="Compose a broadcast for your users."
          backTo="/notification"
        />
        <Card>
          <CardHeader>
            <CardTitle>Notification Content</CardTitle>
            <CardDescription>Heading, artwork and the message body.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
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
                    placeholder="e.g. Festival Sale is live"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification_images">Image</Label>
                  <label
                    htmlFor="notification_images"
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
                        Optional artwork for the broadcast
                      </span>
                    </span>
                  </label>
                  <Input
                    id="notification_images"
                    type="file"
                    accept="image/*"
                    name="notification_images"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSelectedFile(e.target.files?.[0] ?? null)
                    }
                    className="hidden"
                  />
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
                    placeholder="Write the message users will receive…"
                    required
                    rows={4}
                  />
                </div>
              </div>
              <FormActions
                isPending={isPending}
                pendingLabel="Submitting..."
                submitLabel="Submit"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddNotification;
