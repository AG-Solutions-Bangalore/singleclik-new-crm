import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { clearAppStorage } from "@/lib/storage";

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

  const { data: panelData, error: panelError } = useQuery({
    queryKey: ["panel-status"],
    queryFn: async (): Promise<PanelStatus> => {
      const response = await axios.get(`${BASE_URL}/api/panel-check-status`);
      return (await response.data) as PanelStatus;
    },
    refetchInterval: 60000,
    retry: false,
  });

  useEffect(() => {
    if (panelData) {
      setIsPanelUp(panelData);
      setError(!panelData.success);
    }
  }, [panelData]);

  useEffect(() => {
    if (panelError) {
      setError(true);
    }
  }, [panelError]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      clearAppStorage();
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

  return <AppContext.Provider value={{ isPanelUp, setIsPanelUp }}>{children}</AppContext.Provider>;
};

export default AppProvider;
