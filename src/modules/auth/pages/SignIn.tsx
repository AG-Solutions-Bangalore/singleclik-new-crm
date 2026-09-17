import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { PANEL_LOGIN_URL } from "@/modules/auth/api/auth.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useAppContext();
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    setLoading(true);

    //create a formData object and append state values
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      // Send POST request to login API with form data
      const res = await axios.post(PANEL_LOGIN_URL, formData);

      if (res.status === 200 && res.data?.msg === "success.") {
        const token = res.data.UserInfo?.token;
        if (token) {
          // Store the token in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("id", res.data.UserInfo.user.user_type);
          localStorage.setItem("name", res.data.UserInfo.user.name);
          localStorage.setItem("username", res.data.UserInfo.user.mobile);
          localStorage.setItem("user_type_id", res.data.UserInfo.user.user_type);

          navigate("/home");
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-dim p-4 text-on-surface md:p-6">
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
          <h1 className="text-headline-md font-semibold">Welcome back</h1>
          <p className="text-body-md opacity-90">
            SingleClik empowers businesses to showcase services connect with customers manage inquiries chat and
            close deals seamlessly in one platform.
          </p>
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
            <CardTitle>Sign In</CardTitle>
            <CardDescription>If you are already a member, easily log in</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {loading ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-surface/60">
                <Spinner />
              </div>
            ) : null}
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
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Password"
                    type={show ? "password" : "text"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Show password" : "Hide password"}
                    className="absolute inset-y-0 right-0 mr-3 flex items-center text-primary outline-none focus-visible:rounded-sm focus-visible:outline-[2px] focus-visible:outline-primary"
                  >
                    {show ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Link
                  to="/forget-password"
                  className="text-label-sm font-medium text-primary outline-none hover:underline focus-visible:rounded-sm focus-visible:outline-[2px] focus-visible:outline-primary"
                >
                  Forgot your password?
                </Link>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                <LogIn />
                {loading ? "Checking..." : "Sign In"}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
