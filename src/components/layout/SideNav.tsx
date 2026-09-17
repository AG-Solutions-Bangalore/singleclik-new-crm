import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { X } from "lucide-react";
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
  const [logoOk, setLogoOk] = useState(true);

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

      <div className="border-t border-outline p-4">
        <p className="text-center text-label-sm text-on-surface-variant">SingleClik CRM · v1.0</p>
      </div>
    </aside>
  );
};

export default SideNav;
