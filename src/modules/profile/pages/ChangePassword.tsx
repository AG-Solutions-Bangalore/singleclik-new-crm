import { useState } from "react";
import type { ChangeEvent } from "react";
import { KeyRound } from "lucide-react";
import Layout from "@/components/layout/Layout";
import type { ChangePasswordForm } from "@/modules/profile/types/profile.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";

const ChangePassword = () => {
  const [form, setForm] = useState<ChangePasswordForm>({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const handleChange =
    (field: keyof ChangePasswordForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <PageHeader title="Change Password" description="Update your account password" />
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="old-password">Old Password</Label>
              <Input
                id="old-password"
                type="password"
                placeholder="Old Password"
                autoComplete="current-password"
                required
                value={form.oldPassword}
                onChange={handleChange("oldPassword")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="New Password"
                autoComplete="new-password"
                required
                value={form.newPassword}
                onChange={handleChange("newPassword")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm Password"
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="primary" className="w-full">
              <KeyRound />
              Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ChangePassword;
