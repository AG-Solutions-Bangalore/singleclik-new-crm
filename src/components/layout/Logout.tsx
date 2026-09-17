import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { clearAppStorage } from "@/lib/storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    <AlertDialog open={open} onOpenChange={(v) => !v && handleOpen()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to sign in again to access the panel.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>
            <LogOut /> Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Logout;
