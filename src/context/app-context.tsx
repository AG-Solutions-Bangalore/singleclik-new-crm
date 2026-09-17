import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { clearAppStorage } from "@/lib/storage";
import { getToken } from "@/lib/auth-storage";

export interface PanelStatus {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

interface AppContextValue {
  isPanelUp: PanelStatus | boolean | null;
  isPanelLoading: boolean;
  setIsPanelUp: React.Dispatch<React.SetStateAction<PanelStatus | boolean | null>>;
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
  // null = panel status not known yet — do NOT redirect until the check resolves.
  // This is what caused the auth flash: the old code defaulted to `true`
  // (a boolean, not the `{ success }` object), so ProtectedRoute bounced
  // every refresh to "/" and then back to "/home" once the query finished.
  const [isPanelUp, setIsPanelUp] = useState<PanelStatus | boolean | null>(null);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: panelData,
    error: panelError,
    isLoading: isPanelLoading,
    isFetched,
  } = useQuery({
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
    // Wait for the panel check before deciding any redirect — otherwise the
    // login page flashes on every refresh while the request is in flight.
    if (!isFetched || isPanelLoading) return;

    const token = getToken();
    const currentPath = location.pathname;

    const go = (to: string) => {
      if (to !== currentPath) navigate(to, { replace: true });
    };

    if (error) {
      clearAppStorage();
      go("/maintenance");
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
          "/settings",
        ];
        const isAllowedPath = allowedPaths.some((path) => currentPath.startsWith(path));
        // Stay where the user is (covers refresh); only bounce unknown /
        // auth paths to the dashboard instead of flashing the login page.
        if (!isAllowedPath) {
          go("/home");
        }
      } else {
        if (currentPath === "/" || currentPath === "/register" || currentPath === "/forget-password") {
          return; // public route, stay put
        }
        go("/"); // Redirect to login if no token
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isFetched, isPanelLoading, isPanelUp, location.pathname]);

  return (
    <AppContext.Provider value={{ isPanelUp, isPanelLoading, setIsPanelUp }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
