import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader2, LogIn } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { useLogin } from "@/modules/auth/hooks/useLogin";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      description="If you are already a member, easily log in"
      brandHeading="Welcome back"
      brandCopy="SingleClik empowers businesses to showcase services, connect with customers, manage inquiries, chat and close deals seamlessly in one platform."
      brandPoints={["Showcase services & products", "Manage inquiries and chat", "Close deals in one place"]}
    >
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <form onSubmit={handleSubmit} method="POST" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Mobile Number</Label>
          <Input
            type="number"
            id="email"
            name="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="123456789"
            autoComplete="username"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>
        <div className="flex items-center justify-end">
          <Link
            to="/forget-password"
            className="text-label-sm font-medium text-primary outline-none hover:underline focus-visible:rounded-sm focus-visible:outline-[2px] focus-visible:outline-primary"
          >
            Forgot your password?
          </Link>
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="animate-spin" /> : <LogIn />}
          {isPending ? "Signing in…" : "Sign In"}
        </Button>
        <p className="text-center text-body-md text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary outline-none hover:underline focus-visible:rounded-sm focus-visible:outline-[2px] focus-visible:outline-primary"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
