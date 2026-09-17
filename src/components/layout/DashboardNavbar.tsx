import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardNavbarProps {
  openSideNav: boolean;
  setOpenSideNav: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardNavbar = ({ openSideNav, setOpenSideNav }: DashboardNavbarProps) => {
  const { pathname } = useLocation();

  const pathSegments = pathname.split("/").filter((el) => el !== "");

  return (
    <header className="sticky top-4 z-40 rounded-xl border border-outline bg-surface/90 shadow-md backdrop-blur">
      <div className="flex items-center gap-2 px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 xl:hidden"
          onClick={() => setOpenSideNav(!openSideNav)}
          aria-label="Toggle navigation"
        >
          <Menu />
        </Button>
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-label-md">
          <Link to="/home" className="shrink-0 font-medium text-on-surface-variant transition-colors hover:text-primary">
            Home
          </Link>
          {pathSegments.map((segment, index) => {
            const name = segment.charAt(0).toUpperCase() + segment.slice(1);
            const link = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;
            return (
              <span key={link} className="flex min-w-0 items-center gap-1">
                <ChevronRight className="size-4 shrink-0 text-on-surface-variant" aria-hidden />
                {isLast ? (
                  <span className="truncate font-medium text-on-surface" aria-current="page">
                    {name}
                  </span>
                ) : (
                  <Link to={link} className="shrink-0 text-on-surface-variant transition-colors hover:text-primary">
                    {name}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default DashboardNavbar;
