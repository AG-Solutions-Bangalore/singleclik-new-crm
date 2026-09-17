import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgetPassword = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-dim p-4 text-on-surface md:p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-lg border border-outline bg-surface-container-lowest shadow-md lg:grid-cols-2">
        <Card className="rounded-none border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center gap-2 lg:hidden">
              <img
                src="https://singleclik.com/draft/assets/img/logos/logo.png"
                alt="logo_image"
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold text-primary">Single Clik</span>
            </div>
            <CardTitle>Forget Password</CardTitle>
            <CardDescription>Enter your email to reset your password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Your email</Label>
                <Input id="email" name="email" type="email" placeholder="name@mail.com" autoComplete="email" />
              </div>
              <Button type="submit" className="w-full">
                <KeyRound />
                Reset Password
              </Button>
              <p className="text-center text-body-md text-on-surface-variant">
                Remembered your password?{" "}
                <Link to="/" className="font-medium text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
        <div className="hidden flex-col justify-center gap-3 bg-primary p-8 text-on-primary lg:flex">
          <div className="flex items-center gap-2">
            <img
              src="https://singleclik.com/draft/assets/img/logos/logo.png"
              alt="logo_image"
              className="h-12 w-12 rounded-lg bg-surface-container-lowest p-1"
            />
            <span className="text-3xl font-bold">Single Clik</span>
          </div>
          <h1 className="text-headline-md font-semibold">Reset your password</h1>
          <p className="text-body-md opacity-90">
            Enter your email address and we&apos;ll help you get back into your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
