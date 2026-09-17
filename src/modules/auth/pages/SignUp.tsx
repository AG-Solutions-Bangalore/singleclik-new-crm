import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignUp = () => {
  return (
    <AuthLayout
      title="Create account"
      description="Nice to meet you! Enter your details to register."
      brandHeading="Join us today"
      brandCopy="Get your business discovered, manage customers and grow faster with the SingleClik CRM panel."
      brandPoints={["Free business listing", "Customer management", "Real-time inquiries"]}
    >
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Your Name</Label>
          <Input id="name" name="name" placeholder="Full name" autoComplete="name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Your Email</Label>
          <Input id="email" name="email" type="email" placeholder="name@mail.com" autoComplete="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" name="password" placeholder="Create a password" autoComplete="new-password" />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-body-md text-on-surface-variant">
          <Checkbox id="terms" />
          <span>
            I agree to the{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Terms and Conditions
            </a>
          </span>
        </label>
        <Button type="submit" className="w-full">
          <UserPlus />
          Sign Up
        </Button>
        <p className="text-center text-body-md text-on-surface-variant">
          Already have an account?{" "}
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

export default SignUp;
