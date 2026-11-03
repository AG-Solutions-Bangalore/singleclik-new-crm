import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
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
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import { getToken, getUserField } from "@/lib/auth-storage";
import { clearAppStorage } from "@/lib/storage";
import { PANEL_CHANGE_PASSWORD_URL } from "@/modules/auth/api/auth.api";

interface SecurityDialogProps {
  open: boolean;
  onClose: () => void;
}

const SecurityDialog = ({ open, onClose }: SecurityDialogProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ChangePasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange =
    (field: keyof ChangePasswordForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (form.oldPassword === form.newPassword) {
      toast.error("New password must be different from old password");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getToken();
      const userName = getUserField("name");
      const userLogin = getUserField("login_username");
      const userMobile = getUserField("username");
      const userEmail = getUserField("email");

      // Prioritize the actual account name (e.g. "Admin") as required by the backend,
      // falling back to login username, mobile number, or email.
      const candidates = Array.from(
        new Set([userName, userLogin, userMobile, userEmail, "Admin"].filter(Boolean) as string[])
      );

      let lastError: string | null = null;
      let successData: any = null;

      for (const candidate of candidates) {
        try {
          const payload = {
            username: candidate,
            name: candidate,
            old_password: form.oldPassword,
            password: form.newPassword,
            new_password: form.newPassword,
            confirm_password: form.confirmPassword,
          };

          const res = await axios.post(PANEL_CHANGE_PASSWORD_URL, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = res.data;
          if (
            data?.code === 200 ||
            data?.code === 201 ||
            (data?.status !== false && data?.code !== 400 && data?.code !== 401 && data?.code !== 404)
          ) {
            successData = data;
            break;
          } else {
            lastError = data?.message || data?.msg || "Failed to change password";
          }
        } catch (err: any) {
          lastError =
            err.response?.data?.message ||
            err.response?.data?.msg ||
            err.message;
          // Continue to next candidate only if it looks like an authentication / user matching issue
          if (err.response?.status !== 400 && err.response?.status !== 404) {
            break;
          }
        }
      }

      if (!successData) {
        throw new Error(lastError || "Please enter valid old password");
      }

      toast.success(
        successData?.message ||
        successData?.msg ||
        "Password changed successfully! You have been logged out. Please log in with your updated password."
      );

      // Reset form state
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

      // Auto logout and redirect to login page
      clearAppStorage();
      queryClient.clear();
      onClose();
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("Change password error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message ||
        "Please enter valid old password";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Security</DialogTitle>
          <DialogDescription>
            Update your account password. Once changed, you will be automatically logged out and must sign in with your updated password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="security-old-password">Old Password</Label>
            <PasswordInput
              id="security-old-password"
              placeholder="Enter current password"
              autoComplete="current-password"
              required
              value={form.oldPassword}
              onChange={handleChange("oldPassword")}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="security-new-password">New Password</Label>
            <PasswordInput
              id="security-new-password"
              placeholder="Enter new password"
              autoComplete="new-password"
              required
              value={form.newPassword}
              onChange={handleChange("newPassword")}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="security-confirm-password">Confirm Password</Label>
            <PasswordInput
              id="security-confirm-password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              disabled={isSubmitting}
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="min-w-28"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating…
                </>
              ) : (
                <>
                  <KeyRound className="size-4" />
                  Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityDialog;
