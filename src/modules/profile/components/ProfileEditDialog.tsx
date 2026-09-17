import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Save } from "lucide-react";
import { toast } from "react-toastify";
import type { ProfileForm } from "@/modules/profile/types/profile.types";
import { getDefaultProfileForm } from "@/modules/profile/types/profile.types";
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
import { Textarea } from "@/components/ui/textarea";

interface ProfileEditDialogProps {
  open: boolean;
  onClose: () => void;
}

const ProfileEditDialog = ({ open, onClose }: ProfileEditDialogProps) => {
  const [form, setForm] = useState<ProfileForm>(() => getDefaultProfileForm());

  useEffect(() => {
    if (open) {
      setForm(getDefaultProfileForm());
    }
  }, [open ]);

  const handleChange =
    (field: keyof ProfileForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.name.trim()) {
      localStorage.setItem("name", form.name.trim());
    }
    if (form.email.trim()) {
      localStorage.setItem("email", form.email.trim());
    }
    toast.success("Profile updated successfully");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>View and update your profile details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange("name")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-message">Message</Label>
            <Textarea
              id="profile-message"
              placeholder="Your message"
              rows={5}
              value={form.message}
              onChange={handleChange("message")}
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Save />
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
