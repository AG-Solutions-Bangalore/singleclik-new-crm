import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/textarea";
import { NOTIFICATIONS_API, authHeaders } from "../api/notifications";
import type { NotificationForm } from "../types/notifications";

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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNotify({
      ...notify,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const data = new FormData();
    data.append("notification_heading", notify.notification_heading);
    data.append("notification_des", notify.notification_des);
    data.append("notification_images", selectedFile ?? "null");

    axios({
      url: NOTIFICATIONS_API.create,
      method: "POST",
      data,
      headers: authHeaders(),
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success("Notification Create  succesfull");

        setNotify({
          notification_heading: "",
          notification_des: "",
          notification_images: "",
        });
        navigate("/notification");
      } else {
        toast.error("duplicate entry");
      }
    });
  };

  return (
    <Layout>
      <div className="space-y-4">
        <PageHeader
          title="Create Notification"
          description="Add a new notification"
          backTo="/notification"
        />
        <Card>
          <CardContent>
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  <Label htmlFor="notification_images">Notification Image</Label>
                  <Input
                    id="notification_images"
                    type="file"
                    name="notification_images"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSelectedFile(e.target.files?.[0] ?? null)
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notification_des">Description</Label>
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
              <div className="mt-6 flex justify-center">
                <Button type="submit" variant="primary" disabled={isButtonDisabled}>
                  <Send />
                  <span>{isButtonDisabled ? "Submitting..." : "Submit"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddNotification;
