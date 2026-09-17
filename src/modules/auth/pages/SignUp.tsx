import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-dim p-4 text-on-surface md:p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-lg border border-outline bg-surface-container-lowest shadow-md lg:grid-cols-2">
        <div className="hidden flex-col justify-center gap-3 bg-primary p-8 text-on-primary lg:flex">
          <div className="flex items-center gap-2">
            <img
              src="https://singleclik.com/draft/assets/img/logos/logo.png"
              alt="logo_image"
              className="h-12 w-12 rounded-lg bg-surface-container-lowest p-1"
            />
            <span className="text-3xl font-bold">Single Clik</span>
          </div>
          <h1 className="text-headline-md font-semibold">Join Us Today</h1>
          <p className="text-body-md opacity-90">Nice to meet you! Enter your details to register.</p>
        </div>
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
            <CardTitle>Join Us Today</CardTitle>
            <CardDescription>Nice to meet you! Enter your details to register.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" placeholder="name@mail.com" autoComplete="name" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Your Email</Label>
                <Input id="email" name="email" type="email" placeholder="name@mail.com" autoComplete="email" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "password" : "text"}
                    placeholder="********"
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Show password" : "Hide password"}
                    className="absolute inset-y-0 right-0 mr-3 flex items-center text-primary outline-none focus-visible:rounded-sm focus-visible:outline-[2px] focus-visible:outline-primary"
                  >
                    {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-body-md text-on-surface-variant">
                <Checkbox id="terms" />
                <span>
                  I agree the{" "}
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
                <Link to="/" className="font-medium text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
