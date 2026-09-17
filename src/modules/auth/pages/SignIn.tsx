import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Lock, User } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { useLogin } from "@/modules/auth/hooks/useLogin";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  getRememberedUsername,
  getToken,
  wasRememberMeChecked,
} from "@/lib/auth-storage";

const SignIn = () => {
  const [email, setEmail] = useState(() => getRememberedUsername());
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => wasRememberMeChecked());
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  // Already have a session (e.g. refresh / back button) — skip the login
  // form instead of flashing it, and go straight to the dashboard.
  useEffect(() => {
    if (getToken() && typeof isPanelUp === "object" && isPanelUp?.success) {
      navigate("/home", { replace: true });
    }
  }, [isPanelUp, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // isPanelUp is null while the status check is in flight — only bounce
    // when the panel is definitively down, not while still loading.
    if (isPanelUp === false) {
      navigate("/maintenance");
      return;
    }

    login({ username: email, password, remember: rememberMe });
  };

  return (
    <AuthLayout
      title="Sign In"
      description="Login to your CRM account"
    >
      <form onSubmit={handleSubmit} method="POST" className="flex flex-col gap-4">
        {/* Username / Mobile Number input with icon */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
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
            className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10 text-[14px] shadow-2xs transition-colors focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/60 dark:focus:border-blue-500"
            required
          />
        </div>

        {/* Password input with icon */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 z-10">
            <Lock className="size-4" />
          </div>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10 pr-10 text-[14px] shadow-2xs transition-colors focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/60 dark:focus:border-blue-500"
            required
          />
        </div>

        {/* Remember me + Forgot password row */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-slate-600 dark:text-slate-400">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              className="rounded-md border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:border-slate-700 dark:data-[state=checked]:bg-blue-600"
            />
            <span>Remember me</span>
          </label>
          <Link
            to="/forget-password"
            className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
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
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          <span className="absolute bg-white px-3 text-[11px] font-medium text-slate-400 dark:bg-slate-900">
            or
          </span>
        </div>

        {/* Secondary Outline Pill Button */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Don&apos;t have an account?</span>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-transparent px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Create Account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
