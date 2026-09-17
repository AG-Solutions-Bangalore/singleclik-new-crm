import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ArrowRight, Loader2, Lock, User } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { useLogin } from "@/modules/auth/hooks/useLogin";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    login({ username: email, password });
  };

  return (
    <AuthLayout
      title="Sign In"
      description="Login to your CRM account"
    >
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#10B981",
              color: "#FFFFFF",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "#FFFFFF",
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <form onSubmit={handleSubmit} method="POST" className="flex flex-col gap-4">
        {/* Username / Mobile Number input with icon */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A7D71]">
            <User className="size-4" />
          </div>
          <Input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="Enter your username or mobile"
            autoComplete="username"
            className="h-11 rounded-2xl border-[#E5DFD5] bg-[#FAF8F5] pl-10 text-[14px] shadow-2xs transition-colors focus:border-[#8B5E3C] focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 dark:border-[#2C2E38] dark:bg-[#1E2025] dark:focus:border-[#D4AF37]"
            required
          />
        </div>

        {/* Password input with icon */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A7D71] z-10">
            <Lock className="size-4" />
          </div>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="h-11 rounded-2xl border-[#E5DFD5] bg-[#FAF8F5] pl-10 pr-10 text-[14px] shadow-2xs transition-colors focus:border-[#8B5E3C] focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 dark:border-[#2C2E38] dark:bg-[#1E2025] dark:focus:border-[#D4AF37]"
            required
          />
        </div>

        {/* Remember me + Forgot password row */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-[#605A51] dark:text-[#A4A6B0]">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              className="rounded-md border-[#D1C7B7] data-[state=checked]:bg-[#18181B] data-[state=checked]:text-white dark:border-[#3E4250] dark:data-[state=checked]:bg-[#F0E6D8] dark:data-[state=checked]:text-[#18181B]"
            />
            <span>Remember me</span>
          </label>
          <Link
            to="/forget-password"
            className="font-medium text-[#8B5E3C] transition-colors hover:text-[#6E482D] hover:underline dark:text-[#D4AF37]"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Primary Submit Button matching Reference 1 */}
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#18181B] px-5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#2A2825] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#F0E6D8] dark:text-[#18181B] dark:hover:bg-[#E3D4C0]"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Signing in…</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-2 flex items-center justify-center">
          <div className="w-full border-t border-[#EBE5DC] dark:border-[#2C2E38]" />
          <span className="absolute bg-white px-3 text-[11px] font-medium text-[#9E968B] dark:bg-[#16171B]">
            or
          </span>
        </div>

        {/* Secondary Outline Pill Button */}
        <div className="flex items-center justify-between gap-2 text-xs text-[#78716C] dark:text-[#A1A1AA]">
          <span>Don&apos;t have an account?</span>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-full border border-[#D5CCC0] bg-transparent px-4 py-2 text-xs font-semibold text-[#1C1917] transition-colors hover:bg-[#FAF8F5] dark:border-[#363945] dark:text-[#FAF8F5] dark:hover:bg-[#1E2025]"
          >
            Create Account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
