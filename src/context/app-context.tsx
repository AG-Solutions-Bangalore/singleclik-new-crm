import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

export interface PanelStatus {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

interface AppContextValue {
  isPanelUp: PanelStatus | boolean;
  setIsPanelUp: React.Dispatch<React.SetStateAction<PanelStatus | boolean>>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

/** Backwards-compatible alias for the previous ContextPanel export. */
export const ContextPanel = AppContext;

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isPanelUp, setIsPanelUp] = useState<PanelStatus | boolean>(true);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/panel-check-status`);
      const datas = (await response.data) as PanelStatus;
      setIsPanelUp(datas);
      if (datas?.success) {
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (typeof isPanelUp === "object" && isPanelUp?.success) {
      if (token) {
        const allowedPaths = [
          "/home",
          "/member-list",
          "/member-view",
          "/member-edit",
          "/category-view",
          "/category",
          "/profile",
          "/change-password",
          "/category-edit",
          "/sub-category",
          "/add-subCategory",
          "/add-category",
          "/sub-category-edit",
          "/user-list",
          "/adv-slider",
          "/add-slider",
          "/slider-edit",
          "/popup-slider",
          "/add-popup-slider",
          "/popup-slider-edit",
          "/hold-user",
          "/delete-user",
          "/product",
          "/add-product",
          "/edit-product",
          "/feedback",
          "/notification",
          "/add-notification",
          "/edit-notification",
        ];
        const isAllowedPath = allowedPaths.some((path) => currentPath.startsWith(path));
        if (isAllowedPath) {
          navigate(currentPath);
        } else {
          navigate("/home");
        }
      } else {
        if (currentPath === "/" || currentPath === "/register" || currentPath === "/forget-password") {
          navigate(currentPath);
        } else {
          navigate("/"); // Redirect to login if no token
        }
      }
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return <AppContext.Provider value={{ isPanelUp, setIsPanelUp }}>{children}</AppContext.Provider>;
};

export default AppProvider;
