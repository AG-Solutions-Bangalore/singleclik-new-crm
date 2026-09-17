import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { KeyRound, LogOut, Moon, Sun, X } from "lucide-react";
import { TbStackPop, TbCategory2 } from "react-icons/tb";
import { CgProductHunt } from "react-icons/cg";
import { TfiLayoutSlider } from "react-icons/tfi";
import { PiCardholderLight } from "react-icons/pi";
import { FiUsers } from "react-icons/fi";
import {
  MdOutlineBusinessCenter,
  MdOutlineDelete,
  MdOutlineFeedback,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import Logout from "@/components/layout/Logout";
import { cn } from "@/lib/utils";

interface SideNavProps {
  openSideNav: boolean;
  setOpenSideNav: React.Dispatch<React.SetStateAction<boolean>>;
}

const sideItems = [
  { to: "/home", label: "Dashboard", Icon: MdOutlineSpaceDashboard },
  { to: "/member-list", label: "Businesses", Icon: MdOutlineBusinessCenter },
  { to: "/user-list", label: "Consumers", Icon: FiUsers },
  { to: "/category", label: "Category", Icon: TbCategory2 },
  { to: "/adv-slider", label: "Adv Slider", Icon: TfiLayoutSlider },
  { to: "/popup-slider", label: "Pop up Slider", Icon: TbStackPop },
  { to: "/hold-user", label: "Hold User", Icon: PiCardholderLight },
  { to: "/delete-user", label: "Delete User", Icon: MdOutlineDelete },
  { to: "/product", label: "Products", Icon: CgProductHunt },
  { to: "/feedback", label: "Feedback", Icon: MdOutlineFeedback },
  { to: "/notification", label: "Notification", Icon: IoIosNotificationsOutline },
];

const SideNav = ({ openSideNav, setOpenSideNav }: SideNavProps) => {
  const sidenavRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const [logoOk, setLogoOk] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const userName = localStorage.getItem("name") ?? "Admin";

  const handleOpenLogout = () => setOpenModal((v) => !v);
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  // close sidebar when clicking outside
  useEffect(() => {
    function handClickOutside(e: MouseEvent) {
      if (sidenavRef.current && !sidenavRef.current.contains(e.target as Node)) {
        setOpenSideNav(false);
      }
    }

    document.addEventListener("mousedown", handClickOutside);
    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, [setOpenSideNav]);

  // Close sidebar on route change
  useEffect(() => {
    setOpenSideNav(false);
  }, [pathname, setOpenSideNav]);

  const handleItemClick = () => {
    // Clear page-no from localStorage
    localStorage.removeItem("page-no");
  };

  return (
    <aside
      ref={sidenavRef}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-outline bg-surface shadow-lg transition-transform duration-300",
        openSideNav ? "translate-x-0" : "-translate-x-full",
        "xl:translate-x-0"
      )}
    >
      <div className="relative border-b border-outline">
        <Link to="/home" className="flex items-center gap-3 p-4" onClick={handleItemClick}>
          {logoOk ? (
            <img
              src="https://www.ag-solutions.in/assets/images/logo.png"
              alt="AG Solution logo"
              className="h-11 w-auto shrink-0"
              onError={() => setLogoOk(false)}
            />
          ) : (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-label-md font-semibold text-on-primary">
              SC
            </span>
          )}
          <div className="leading-tight">
            <div className="text-body-md font-semibold text-on-surface">
              <span className="font-bold">AG</span> Solution
            </div>
            <div className="text-label-sm font-normal text-on-surface-variant">Single Click Solution</div>
          </div>
        </Link>
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpenSideNav(false)}
          className="absolute top-3 right-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition-colors outline-none hover:bg-surface-container-low hover:text-on-surface focus-visible:outline-[2px] focus-visible:outline-primary xl:hidden"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {sideItems.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink to={to} onClick={handleItemClick}>
                {({ isActive }) => (
                  <span
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-label-md transition-colors duration-150",
                      isActive
                        ? "bg-primary font-medium text-on-primary shadow-sm"
                        : "font-normal text-on-surface hover:bg-surface-container-low"
                    )}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden />
                    {label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-outline bg-surface-container-low/60 p-3">
        <Link
          to="/profile"
          onClick={handleItemClick}
          className="flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors outline-none hover:border-outline hover:bg-surface focus-visible:outline-[2px] focus-visible:outline-primary"
        >
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-label-md font-semibold text-on-primary ring-2 ring-primary-container"
          >
            {userName.charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-label-md font-medium text-on-surface">{userName}</span>
            <span className="block text-label-sm text-on-surface-variant">View profile</span>
          </span>
        </Link>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title="Toggle color theme"
            className="inline-flex h-9 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-outline bg-surface py-1 text-label-sm text-on-surface-variant transition-colors outline-none hover:border-primary hover:text-on-surface focus-visible:outline-[2px] focus-visible:outline-primary"
          >
            {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            Theme
          </button>
          <Link
            to="/change-password"
            onClick={handleItemClick}
            aria-label="Change password"
            title="Change password"
            className="inline-flex h-9 flex-col items-center justify-center gap-0.5 rounded-lg border border-outline bg-surface py-1 text-label-sm text-on-surface-variant transition-colors outline-none hover:border-primary hover:text-on-surface focus-visible:outline-[2px] focus-visible:outline-primary"
          >
            <KeyRound className="size-4" />
            Security
          </Link>
          <button
            type="button"
            onClick={handleOpenLogout}
            aria-label="Log out"
            title="Log out"
            className="inline-flex h-9 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-error/40 bg-surface py-1 text-label-sm text-error transition-colors outline-none hover:bg-error-container focus-visible:outline-[2px] focus-visible:outline-primary"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </div>
      <Logout open={openModal} handleOpen={handleOpenLogout} />
    </aside>
  );
};

export default SideNav;
