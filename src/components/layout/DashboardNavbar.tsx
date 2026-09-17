import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { ChevronRight, CircleUserRound, KeyRound, LogOut, Menu, Moon, Sun, UserRound } from "lucide-react";
import Logout from "@/components/layout/Logout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardNavbarProps {
  openSideNav: boolean;
  setOpenSideNav: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardNavbar = ({ openSideNav, setOpenSideNav }: DashboardNavbarProps) => {
  const { pathname } = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const userName = localStorage.getItem("name") ?? "Admin";

  const [openModal, setOpenModal] = useState(false);

  const handleOpenLogout = () => setOpenModal((v) => !v);

  const pathSegments = pathname.split("/").filter((el) => el !== "");

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-4 z-40 rounded-xl border border-outline bg-surface/90 shadow-md backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setOpenSideNav(!openSideNav)}
            aria-label="Toggle navigation"
          >
            <Menu />
          </Button>
          <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1 text-label-md sm:flex">
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

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle color theme">
            {resolvedTheme === "dark" ? <Sun /> : <Moon />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account menu">
                <CircleUserRound />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <UserRound className="size-4" /> {userName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <UserRound /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/change-password">
                  <KeyRound /> Change Password
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={handleOpenLogout} aria-label="Log out" className="text-error hover:text-error">
            <LogOut />
          </Button>
        </div>
      </div>
      <Logout open={openModal} handleOpen={handleOpenLogout} />
    </header>
  );
};

export default DashboardNavbar;
