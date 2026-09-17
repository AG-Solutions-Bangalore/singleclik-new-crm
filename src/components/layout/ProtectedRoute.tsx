import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "@/context/app-context";

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
  const token = localStorage.getItem("token");
  const { isPanelUp } = useAppContext();

  if (!token || !(typeof isPanelUp === "object" && isPanelUp?.success)) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
