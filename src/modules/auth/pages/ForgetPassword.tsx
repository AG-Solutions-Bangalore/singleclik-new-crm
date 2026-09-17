import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { Input } from "@/components/ui/input";

const ForgetPassword = () => {
  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your registered email to receive a recovery link"
      flip
    >
      <form className="flex flex-col gap-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A7D71]">
            <Mail className="size-4" />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your registered email"
            autoComplete="email"
            className="h-11 rounded-2xl border-[#E5DFD5] bg-[#FAF8F5] pl-10 text-[14px] shadow-2xs transition-colors focus:border-[#8B5E3C] focus:bg-white focus:ring-2 focus:ring-[#8B5E3C]/20 dark:border-[#2C2E38] dark:bg-[#1E2025]"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#18181B] px-5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#2A2825] active:scale-[0.99] dark:bg-[#F0E6D8] dark:text-[#18181B] dark:hover:bg-[#E3D4C0]"
        >
          <span>Send Recovery Link</span>
          <ArrowRight className="size-4" />
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-[#78716C] dark:text-[#A1A1AA]">
          <span>Remembered your password?</span>
          <Link
            to="/"
            className="font-semibold text-[#1C1917] hover:underline dark:text-[#FAF8F5]"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgetPassword;
