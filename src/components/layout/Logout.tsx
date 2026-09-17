import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { clearAppStorage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LogoutProps {
  open: boolean;
  handleOpen: () => void;
}

const Logout = ({ open, handleOpen }: LogoutProps) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    clearAppStorage();
    navigate("/");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleOpen()}>
      <DialogHeader>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogDescription>Are you sure you want to log out?</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="ghost" onClick={handleOpen}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut /> Confirm
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default Logout;
