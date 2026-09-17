import { useState } from "react";
import { useTheme } from "next-themes";
import { ChevronDown, KeyRound, LogOut, Moon, Sun, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileDialog from "@/components/layout/ProfileDialog";
import ProfileEditDialog from "@/modules/profile/components/ProfileEditDialog";
import SecurityDialog from "@/modules/profile/components/SecurityDialog";

interface UserMenuProps {
  onLogoutRequest: () => void;
}

export default function UserMenu({ onLogoutRequest }: UserMenuProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  const userName = localStorage.getItem("name") ?? "Admin";
  const userRole = "SingleClik Admin";

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group flex cursor-pointer items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pr-3 pl-1 shadow-2xs transition-all duration-200 hover:border-blue-500 hover:shadow-xs focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
          >
            <span className="flex size-7.5 items-center justify-center rounded-full bg-blue-600 font-display text-[13px] font-bold text-white shadow-2xs ring-2 ring-blue-500/20">
              {userName.charAt(0).toUpperCase()}
            </span>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{userName}</span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{userRole}</span>
            </div>
            <ChevronDown className="size-3.5 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Header Card inside Dropdown */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/70">
            <span className="flex size-10 items-center justify-center rounded-full bg-blue-600 font-display text-base font-bold text-white shadow-xs">
              {userName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[14px] font-bold text-slate-900 dark:text-slate-100">{userName}</p>
              <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">{userRole}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
          >
            <UserRound className="size-3.5" />
            <span>View Full Profile</span>
          </button>

          <DropdownMenuSeparator className="my-1.5 bg-slate-100 dark:bg-slate-800" />

          {/* Theme Toggle */}
          <DropdownMenuItem
            onClick={toggleTheme}
            className="flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-2.5">
              {resolvedTheme === "dark" ? (
                <Sun className="size-4 text-amber-500" />
              ) : (
                <Moon className="size-4 text-blue-600" />
              )}
              <span>Theme</span>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-300">
              {resolvedTheme === "dark" ? "Dark" : "Light"}
            </span>
          </DropdownMenuItem>

          {/* Security / Password */}
          <DropdownMenuItem
            onClick={() => setSecurityOpen(true)}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <KeyRound className="size-4 text-slate-500 dark:text-slate-400" />
            <span>Security & Password</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5 bg-slate-100 dark:bg-slate-800" />

          {/* Logout */}
          <DropdownMenuItem
            onClick={onLogoutRequest}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:hover:bg-red-950/30 dark:focus:bg-red-950/30"
          >
            <LogOut className="size-4 text-red-600 dark:text-red-400" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
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
    </>
  );
}
