import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgetPassword = () => {
  return (
    <AuthLayout
      title="Reset password"
      description="Enter your email and we'll help you get back into your account."
      brandHeading="Locked out?"
      brandCopy="No worries — it happens. Enter your email address and we'll send you a reset link right away."
      brandPoints={["Secure reset link", "Back in minutes", "24×7 account access"]}
      flip
    >
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Your email</Label>
          <Input id="email" name="email" type="email" placeholder="name@mail.com" autoComplete="email" />
        </div>
        <Button type="submit" className="w-full">
          <KeyRound />
          Send Reset Link
        </Button>
        <p className="text-center text-body-md text-on-surface-variant">
          Remembered your password?{" "}
          <Link
            to="/"
            className="font-medium text-primary outline-none hover:underline focus-visible:rounded-sm focus-visible:outline-[2px] focus-visible:outline-primary"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgetPassword;
