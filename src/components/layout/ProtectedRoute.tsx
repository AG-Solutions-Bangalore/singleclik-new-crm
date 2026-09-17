import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "@/context/app-context";
import { getToken } from "@/lib/auth-storage";

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
  const token = getToken();
  const { isPanelUp, isPanelLoading } = useAppContext();

  // While the panel-status check is in flight we don't know yet whether the
  // backend is up — render nothing instead of bouncing to "/" (that bounce
  // was the login-page flash on every refresh).
  if (isPanelLoading || isPanelUp === null) {
    return null;
  }

  if (!token || !(typeof isPanelUp === "object" && isPanelUp?.success)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
