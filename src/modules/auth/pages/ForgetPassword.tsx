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
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Mail className="size-4" />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your registered email"
            autoComplete="email"
            className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10 text-[14px] shadow-2xs transition-colors focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/60 dark:focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-700 active:scale-[0.99] dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <span>Send Recovery Link</span>
          <ArrowRight className="size-4" />
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Remembered your password?</span>
          <Link
            to="/"
            className="font-semibold text-slate-900 hover:underline dark:text-white"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgetPassword;
