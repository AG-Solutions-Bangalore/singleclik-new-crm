import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
import { BrandLogo } from "@/components/common/BrandLogo";
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
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#E8E1D5] bg-[#FAF8F5] text-[#1C1917] shadow-lg transition-transform duration-300 dark:border-[#22242B] dark:bg-[#121316] dark:text-[#E4E4E7]",
        openSideNav ? "translate-x-0" : "-translate-x-full",
        "xl:translate-x-0"
      )}
    >
      {/* Brand Header */}
      <div className="relative border-b border-[#E8E1D5] px-4 py-4 dark:border-[#22242B]">
        <BrandLogo to="/home" onNavigate={handleItemClick} />
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpenSideNav(false)}
          className="absolute top-4 right-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#8A7D71] transition-colors outline-none hover:bg-black/5 hover:text-[#1C1917] focus-visible:outline-2 focus-visible:outline-[#8B5E3C] dark:text-[#A1A1AA] dark:hover:bg-white/10 dark:hover:text-white xl:hidden"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
        <div className="mb-2 px-3 text-[10px] font-bold tracking-wider text-[#8A7D71] uppercase dark:text-[#71717A]">
          Navigation
        </div>
        <ul className="flex flex-col gap-1.5">
          {sideItems.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink to={to} onClick={handleItemClick}>
                {({ isActive }) => (
                  <span
                    className={cn(
                      "group flex items-center gap-3.5 rounded-2xl px-3.5 py-2.5 text-label-md transition-all duration-150",
                      isActive
                        ? "bg-[#18181B] font-semibold text-white shadow-xs dark:bg-[#F0E6D8] dark:text-[#18181B]"
                        : "font-normal text-[#605A51] hover:bg-[#EFE8DD] hover:text-[#1C1917] dark:text-[#A1A1AA] dark:hover:bg-white/[0.06] dark:hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 shrink-0 transition-colors",
                        isActive
                          ? "text-white dark:text-[#18181B]"
                          : "text-[#8A7D71] group-hover:text-[#1C1917] dark:text-[#8E8E93] dark:group-hover:text-white"
                      )}
                      aria-hidden
                    />
                    <span className="truncate">{label}</span>
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Subtle bottom tag */}
      <div className="border-t border-[#E8E1D5] px-4 py-3 text-center text-[10px] font-semibold tracking-wider text-[#9E968B] uppercase dark:border-[#22242B] dark:text-[#6A6660]">
        SingleClik CRM · Privacy First
      </div>
    </aside>
  );
};

export default SideNav;
