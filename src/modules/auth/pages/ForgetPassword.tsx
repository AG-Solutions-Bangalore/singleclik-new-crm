import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Mail, User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { PANEL_SEND_PASSWORD_URL } from "@/modules/auth/api/auth.api";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      toast.error("Please fill in both Username and Email.");
      return;
    }

    setIsPending(true);
    try {
      const trimmedUser = username.trim();
      const trimmedEmail = email.trim();

      const formData = new FormData();
      formData.append("username", trimmedUser);
      formData.append("name", trimmedUser);
      formData.append("email", trimmedEmail);

      const params = new URLSearchParams({
        username: trimmedUser,
        email: trimmedEmail,
      });

      const response = await axios.post(
        `${PANEL_SEND_PASSWORD_URL}?${params.toString()}`,
        formData,
      );

      const data = response.data;
      if (
        data?.code === 400 ||
        data?.code === 404 ||
        data?.code === 401 ||
        data?.status === false
      ) {
        toast.error(data?.message || data?.msg || "Email not sent. Please check your username and email.");
        return;
      }

      toast.success(data?.message || data?.msg || "New Password sent to your registered email.");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Could not send password reset request. Please verify your details.";
      toast.error(errorMsg);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your registered username and email to receive your password"
      flip
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
        {/* Username / Mobile input */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <User className="size-4" />
          </div>
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username or mobile"
            autoComplete="off"
            className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10 text-[14px] shadow-2xs transition-colors focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/60 dark:focus:border-blue-500"
            required
            disabled={isPending}
          />
        </div>

        {/* Email input */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Mail className="size-4" />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            autoComplete="off"
            className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10 text-[14px] shadow-2xs transition-colors focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/60 dark:focus:border-blue-500"
            required
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Sending…</span>
            </>
          ) : (
            <>
              <span>Send Password</span>
              <ArrowRight className="size-4" />
            </>
          )}
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
