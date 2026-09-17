import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { ChevronRight, KeyRound, LogOut, Moon, Sun, X } from "lucide-react";
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
import { BrandLogo } from "@/components/common/BrandLogo";
import ProfileDialog from "@/components/layout/ProfileDialog";
import ProfileEditDialog from "@/modules/profile/components/ProfileEditDialog";
import SecurityDialog from "@/modules/profile/components/SecurityDialog";
import { cn } from "@/lib/utils";

interface SideNavProps {
  openSideNav: boolean;
  setOpenSideNav: React.Dispatch<React.SetStateAction<boolean>>;
  onLogoutRequest: () => void;
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

const SideNav = ({ openSideNav, setOpenSideNav, onLogoutRequest }: SideNavProps) => {
  const sidenavRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const userName = localStorage.getItem("name") ?? "Admin";

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
        <div className="p-3">
          <BrandLogo to="/home" onNavigate={handleItemClick} />
        </div>
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
                      "flex items-center gap-3 rounded-md px-3 py-2 text-label-md transition-colors duration-150",
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

      <div className="border-t border-outline p-2.5">
        <div className="rounded-xl border border-outline bg-surface-container-low p-2">
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className="group flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors outline-none hover:bg-surface focus-visible:outline-[2px] focus-visible:outline-primary"
        >
            <span className="relative shrink-0" aria-hidden>
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-label-md font-semibold text-on-primary ring-2 ring-primary-container">
                {userName.charAt(0).toUpperCase()}
              </span>
              <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-surface-container-low bg-emerald-500" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-label-md font-semibold text-on-surface">{userName}</span>
              <span className="block text-label-sm text-on-surface-variant">View profile</span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-on-surface-variant transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </button>
          <div className="mt-2 grid grid-cols-3 gap-1.5 border-t border-outline pt-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              title="Toggle color theme"
              className="inline-flex h-10 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-label-sm font-medium text-on-surface-variant transition-colors outline-none hover:bg-surface hover:text-on-surface focus-visible:outline-[2px] focus-visible:outline-primary"
            >
              {resolvedTheme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              Theme
            </button>
            <button
              type="button"
              onClick={() => setSecurityOpen(true)}
              aria-label="Change password"
              title="Change password"
              className="inline-flex h-10 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-label-sm font-medium text-on-surface-variant transition-colors outline-none hover:bg-surface hover:text-on-surface focus-visible:outline-[2px] focus-visible:outline-primary"
            >
              <KeyRound className="size-[18px]" />
              Security
            </button>
            <button
              type="button"
              onClick={onLogoutRequest}
              aria-label="Log out"
              title="Log out"
              className="inline-flex h-10 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-label-sm font-medium text-error transition-colors outline-none hover:bg-error-container focus-visible:outline-[2px] focus-visible:outline-primary"
            >
              <LogOut className="size-[18px]" />
              Logout
            </button>
          </div>
        </div>
      </div>
      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onOpenSecurity={() => {
          setProfileOpen(false);
          setSecurityOpen(true);
        }}
        onOpenProfile={() => {
          setProfileOpen(false);
          setProfileEditOpen(true);
        }}
      />
      <ProfileEditDialog open={profileEditOpen} onClose={() => setProfileEditOpen(false)} />
      <SecurityDialog open={securityOpen} onClose={() => setSecurityOpen(false)} />
    </aside>
  );
};

export default SideNav;
