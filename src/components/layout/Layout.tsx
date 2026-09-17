import { useState } from "react";
import type { ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import SideNav from "@/components/layout/SideNav";

const Layout = ({ children }: { children: ReactNode }) => {
  const [openSideNav, setOpenSideNav] = useState(false);
  return (
    <div className="min-h-screen bg-surface-dim text-on-background">
      <SideNav openSideNav={openSideNav} setOpenSideNav={setOpenSideNav} />
      <div className="flex min-h-screen flex-col p-4 transition-[margin] duration-300 md:p-6 xl:ml-72">
        <DashboardNavbar openSideNav={openSideNav} setOpenSideNav={setOpenSideNav} />
        <main className="mt-4 flex-1 md:mt-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
