import { useState } from "react";
import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { Menu, X } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Logout from "@/components/layout/Logout";
import SideNav from "@/components/layout/SideNav";

const Layout = ({ children }: { children: ReactNode }) => {
  const [openSideNav, setOpenSideNav] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-surface-dim text-on-background">
      <SideNav
        openSideNav={openSideNav}
        setOpenSideNav={setOpenSideNav}
        onLogoutRequest={() => setLogoutOpen(true)}
      />
      <div className="flex min-h-screen flex-col p-3 transition-[margin] duration-300 md:p-4 xl:ml-72">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <button
        type="button"
        onClick={() => setOpenSideNav((v) => !v)}
        aria-label={openSideNav ? "Close navigation" : "Open navigation"}
        className="fixed bottom-4 left-4 z-40 flex size-12 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform outline-none hover:scale-105 focus-visible:outline-[3px] focus-visible:outline-primary-container xl:hidden"
      >
        {openSideNav ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      <Logout open={logoutOpen} handleOpen={() => setLogoutOpen(false)} />
    </div>
    </MotionConfig>
  );
};

export default Layout;
