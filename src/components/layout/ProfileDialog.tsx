import { KeyRound, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onOpenSecurity: () => void;
  onOpenProfile: () => void;
}

const ProfileDialog = ({ open, onClose, onOpenSecurity, onOpenProfile }: ProfileDialogProps) => {
  const userName = localStorage.getItem("name") ?? "Admin";
  const userMobile = localStorage.getItem("username") ?? "—";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <span
            aria-hidden
            className="flex size-16 items-center justify-center rounded-full bg-primary text-headline-md font-semibold text-white ring-4 ring-primary-container"
          >
            {userName.charAt(0).toUpperCase()}
          </span>
          <DialogTitle>{userName}</DialogTitle>
          <DialogDescription>{userMobile}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 rounded-lg border border-outline bg-surface-container-low p-3 text-body-md">
          <div className="flex items-center justify-between gap-2">
            <span className="text-on-surface-variant">Name</span>
            <span className="font-medium text-on-surface">{userName}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-on-surface-variant">Mobile</span>
            <span className="font-medium text-on-surface">{userMobile}</span>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" type="button" onClick={onOpenSecurity}>
            <KeyRound /> Security
          </Button>
          <Button type="button" onClick={onOpenProfile}>
            <UserRound /> Full Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
