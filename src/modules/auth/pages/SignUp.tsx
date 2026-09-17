import { Link } from "react-router-dom";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const SignUp = () => {
  return (
    <AuthLayout
      title="Create Account"
      description="Register your business on Single Clik"
    >
      <form className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <User className="size-4" />
          </div>
          <Input
            id="name"
            name="name"
            placeholder="Full Name / Business Name"
            autoComplete="name"
            className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10 text-[14px] shadow-2xs transition-colors focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/60 dark:focus:border-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Mail className="size-4" />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Official Business Email"
            autoComplete="email"
            className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10 text-[14px] shadow-2xs transition-colors focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/60 dark:focus:border-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 z-10">
            <Lock className="size-4" />
          </div>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Create password"
            autoComplete="new-password"
            className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10 pr-10 text-[14px] shadow-2xs transition-colors focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/60 dark:focus:border-blue-500"
            required
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
          <Checkbox
            id="terms"
            defaultChecked
            className="rounded-md border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:border-slate-700 dark:data-[state=checked]:bg-blue-600"
          />
          <span>
            I agree to Single Clik{" "}
            <a href="#" className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400">
              Terms and Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-700 active:scale-[0.99] dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <span>Register Business</span>
          <ArrowRight className="size-4" />
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Already have an account?</span>
          <Link
            to="/"
            className="font-semibold text-slate-900 hover:underline dark:text-white"
          >
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
