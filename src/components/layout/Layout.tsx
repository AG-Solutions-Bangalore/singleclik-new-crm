import { useState } from "react";
import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { Menu, X } from "lucide-react";
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
      <div className="min-h-screen bg-[#FAF8F5] text-on-background dark:bg-[#121316]">
        <SideNav
          openSideNav={openSideNav}
          setOpenSideNav={setOpenSideNav}
        />
        <div className="flex min-h-screen flex-col transition-[margin] duration-300 xl:ml-72">
          {/* Top Navigation Bar matching Reference Images 2 & 3 */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#EBE5DC] bg-[#FAF8F5]/90 px-4 backdrop-blur-md dark:border-[#22242B] dark:bg-[#121316]/90 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpenSideNav((v) => !v)}
                aria-label="Toggle navigation"
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-outline bg-surface text-on-surface shadow-xs transition-colors hover:bg-surface-container-low xl:hidden"
              >
                <Menu className="size-5" />
              </button>
    
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden text-label-sm font-medium text-on-surface-variant md:inline-block">
                {formattedDate}
              </span>
              <UserMenu onLogoutRequest={() => setLogoutOpen(true)} />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
          <Footer />
        </div>

        <button
          type="button"
          onClick={() => setOpenSideNav((v) => !v)}
          aria-label={openSideNav ? "Close navigation" : "Open navigation"}
          className="fixed bottom-4 left-4 z-40 flex size-12 cursor-pointer items-center justify-center rounded-full bg-[#18181B] text-white shadow-xl transition-transform outline-none hover:scale-105 focus-visible:outline-[3px] focus-visible:outline-[#F0E6D8] dark:bg-[#F0E6D8] dark:text-[#18181B] xl:hidden"
        >
          {openSideNav ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Logout open={logoutOpen} handleOpen={() => setLogoutOpen(false)} />
      </div>
    </MotionConfig>
  );
};

export default Layout;
