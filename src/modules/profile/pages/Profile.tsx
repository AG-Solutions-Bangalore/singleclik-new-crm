import { useState } from "react";
import type { ChangeEvent } from "react";
import { Save } from "lucide-react";
import Layout from "@/components/layout/Layout";
import type { ProfileForm } from "@/modules/profile/types/profile.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/textarea";

const Profile = () => {
  const [form, setForm] = useState<ProfileForm>({ name: "", email: "", message: "" });

  const handleChange =
    (field: keyof ProfileForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <PageHeader title="Profile" description="View and update your profile details" />
        <Card>
          <CardContent>
            <form className="flex w-full max-w-lg flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange("name")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange("email")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange("message")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Button type="button" variant="primary">
                  <Save />
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
