import { useState } from "react";
import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { Menu } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Logout from "@/components/layout/Logout";
import SideNav from "@/components/layout/SideNav";
import UserMenu from "@/components/layout/UserMenu";

const Layout = ({ children }: { children: ReactNode }) => {
  const [openSideNav, setOpenSideNav] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-[#0B1120] dark:text-slate-100">
        <SideNav
          openSideNav={openSideNav}
          setOpenSideNav={setOpenSideNav}
        />
        <div className="flex min-h-screen flex-col transition-[margin] duration-300 xl:ml-72">
          {/* Top Navigation Bar with Profile Dropdown on the Right */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-[#0F172A]/90 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpenSideNav((v) => !v)}
                aria-label="Toggle navigation"
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 xl:hidden"
              >
                <Menu className="size-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 md:inline-block">
                {formattedDate}
              </span>
              <UserMenu onLogoutRequest={() => setLogoutOpen(true)} />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
          <Footer />
        </div>

        <Logout open={logoutOpen} handleOpen={() => setLogoutOpen(false)} />
      </div>
    </MotionConfig>
  );
};

export default Layout;
