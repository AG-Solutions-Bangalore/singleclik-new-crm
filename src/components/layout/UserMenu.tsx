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
            className="group flex cursor-pointer items-center gap-2.5 rounded-full border border-[#E5DFD5] bg-white py-1 pr-3 pl-1 shadow-2xs transition-all duration-200 hover:border-[#8B5E3C] hover:shadow-xs focus-visible:outline-2 focus-visible:outline-[#8B5E3C] dark:border-[#2C2E38] dark:bg-[#18191E] dark:hover:border-[#D4AF37]"
          >
            <span className="flex size-7.5 items-center justify-center rounded-full bg-[#8B5E3C] font-display text-[13px] font-bold text-white shadow-2xs ring-2 ring-[#8B5E3C]/20">
              {userName.charAt(0).toUpperCase()}
            </span>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[13px] font-semibold text-[#1C1917] dark:text-[#FAF8F5]">{userName}</span>
              <span className="text-[10px] font-medium text-[#78716C] dark:text-[#A1A1AA]">{userRole}</span>
            </div>
            <ChevronDown className="size-3.5 text-[#8A7D71] transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-60 rounded-2xl border border-[#E8E1D5] bg-white p-2 shadow-xl dark:border-[#282B34] dark:bg-[#16171B]"
        >
          {/* Header Card inside Dropdown */}
          <div className="flex items-center gap-3 rounded-xl bg-[#FAF8F5] p-2.5 dark:bg-[#1E2026]">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#8B5E3C] font-display text-base font-bold text-white shadow-xs">
              {userName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[14px] font-bold text-[#1C1917] dark:text-[#FAF8F5]">{userName}</p>
              <p className="truncate text-[11px] font-medium text-[#78716C] dark:text-[#A1A1AA]">{userRole}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-[#8B5E3C] transition-colors hover:bg-[#F6F2EA] dark:text-[#D4AF37] dark:hover:bg-white/5"
          >
            <UserRound className="size-3.5" />
            <span>View Full Profile</span>
          </button>

          <DropdownMenuSeparator className="my-1.5 bg-[#EFE8DD] dark:bg-[#282B34]" />

          {/* Theme Toggle */}
          <DropdownMenuItem
            onClick={toggleTheme}
            className="flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#F6F2EA] dark:text-[#FAF8F5] dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-2.5">
              {resolvedTheme === "dark" ? (
                <Sun className="size-4 text-[#F59E0B]" />
              ) : (
                <Moon className="size-4 text-[#6366F1]" />
              )}
              <span>Theme</span>
            </div>
            <span className="rounded-full bg-[#EFE8DD] px-2 py-0.5 text-[10px] font-semibold text-[#605A51] uppercase dark:bg-[#282B34] dark:text-[#A1A1AA]">
              {resolvedTheme === "dark" ? "Dark" : "Light"}
            </span>
          </DropdownMenuItem>

          {/* Security / Password */}
          <DropdownMenuItem
            onClick={() => setSecurityOpen(true)}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#F6F2EA] dark:text-[#FAF8F5] dark:hover:bg-white/5"
          >
            <KeyRound className="size-4 text-[#78716C] dark:text-[#A1A1AA]" />
            <span>Security & Password</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5 bg-[#EFE8DD] dark:bg-[#282B34]" />

          {/* Logout */}
          <DropdownMenuItem
            onClick={onLogoutRequest}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-[#DC2626] hover:bg-red-50 focus:bg-red-50 focus:text-[#DC2626] dark:text-[#F87171] dark:hover:bg-red-950/30 dark:focus:bg-red-950/30"
          >
            <LogOut className="size-4 text-[#DC2626] dark:text-[#F87171]" />
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
