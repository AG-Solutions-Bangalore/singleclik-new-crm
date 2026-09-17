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
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A7D71]">
            <User className="size-4" />
          </div>
          <Input
            id="name"
            name="name"
            placeholder="Full Name / Business Name"
            autoComplete="name"
            className="h-11 rounded-2xl border-[#E5DFD5] bg-[#FAF8F5] pl-10 text-[14px] shadow-2xs transition-colors focus:border-[#8B5E3C] focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 dark:border-[#2C2E38] dark:bg-[#1E2025]"
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A7D71]">
            <Mail className="size-4" />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Official Business Email"
            autoComplete="email"
            className="h-11 rounded-2xl border-[#E5DFD5] bg-[#FAF8F5] pl-10 text-[14px] shadow-2xs transition-colors focus:border-[#8B5E3C] focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 dark:border-[#2C2E38] dark:bg-[#1E2025]"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A7D71] z-10">
            <Lock className="size-4" />
          </div>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Create password"
            autoComplete="new-password"
            className="h-11 rounded-2xl border-[#E5DFD5] bg-[#FAF8F5] pl-10 pr-10 text-[14px] shadow-2xs transition-colors focus:border-[#8B5E3C] focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 dark:border-[#2C2E38] dark:bg-[#1E2025]"
            required
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 pt-1 text-xs text-[#605A51] dark:text-[#A4A6B0]">
          <Checkbox
            id="terms"
            defaultChecked
            className="rounded-md border-[#D1C7B7] data-[state=checked]:bg-[#18181B] data-[state=checked]:text-white dark:border-[#3E4250] dark:data-[state=checked]:bg-[#F0E6D8] dark:data-[state=checked]:text-[#18181B]"
          />
          <span>
            I agree to Single Clik{" "}
            <a href="#" className="font-medium text-[#8B5E3C] underline hover:text-[#6E482D] dark:text-[#D4AF37]">
              Terms and Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#18181B] px-5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#2A2825] active:scale-[0.99] dark:bg-[#F0E6D8] dark:text-[#18181B] dark:hover:bg-[#E3D4C0]"
        >
          <span>Register Business</span>
          <ArrowRight className="size-4" />
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-[#78716C] dark:text-[#A1A1AA]">
          <span>Already have an account?</span>
          <Link
            to="/"
            className="font-semibold text-[#1C1917] hover:underline dark:text-[#FAF8F5]"
          >
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
