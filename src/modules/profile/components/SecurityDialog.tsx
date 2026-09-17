import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "react-toastify";
import type { ChangePasswordForm } from "@/modules/profile/types/profile.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SecurityDialogProps {
  open: boolean;
  onClose: () => void;
}

const SecurityDialog = ({ open, onClose }: SecurityDialogProps) => {
  const [form, setForm] = useState<ChangePasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange =
    (field: keyof ChangePasswordForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    toast.success("Password changed successfully");
    setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Security</DialogTitle>
          <DialogDescription>Update your account password</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="security-old-password">Old Password</Label>
            <Input
              id="security-old-password"
              type="password"
              placeholder="Old Password"
              autoComplete="current-password"
              required
              value={form.oldPassword}
              onChange={handleChange("oldPassword")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="security-new-password">New Password</Label>
            <Input
              id="security-new-password"
              type="password"
              placeholder="New Password"
              autoComplete="new-password"
              required
              value={form.newPassword}
              onChange={handleChange("newPassword")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="security-confirm-password">Confirm Password</Label>
            <Input
              id="security-confirm-password"
              type="password"
              placeholder="Confirm Password"
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="min-w-28">
              <KeyRound />
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityDialog;
