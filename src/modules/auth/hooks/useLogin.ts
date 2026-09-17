import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PANEL_LOGIN_URL } from "@/modules/auth/api/auth.api";
import { setAuthToken, setRememberedUsername } from "@/lib/auth-storage";

export interface LoginPayload {
  username: string;
  password: string;
  remember?: boolean;
}

async function loginFn(payload: LoginPayload) {
  const formData = new FormData();
  formData.append("username", payload.username);
  formData.append("password", payload.password);
  return axios.post(PANEL_LOGIN_URL, formData);
}

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginFn,
    onSuccess: (res, variables) => {
      if (res.status === 200 && res.data?.msg === "success.") {
        const token = res.data.UserInfo?.token;
        if (token) {
          const remember = variables.remember ?? false;
          // Remember me ON  -> localStorage (persists across browser restarts)
          // Remember me OFF -> sessionStorage (forgotten when tab/browser closes)
          setAuthToken(token, remember);
          setRememberedUsername(variables.username, remember);
          localStorage.setItem("id", res.data.UserInfo.user.user_type);
          localStorage.setItem("name", res.data.UserInfo.user.name);
          localStorage.setItem("username", res.data.UserInfo.user.mobile);
          if (res.data.UserInfo.user.email) {
            localStorage.setItem("email", res.data.UserInfo.user.email);
          }
          localStorage.setItem("user_type_id", res.data.UserInfo.user.user_type);
          navigate("/home", { replace: true });
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("An error occurred during login.");
    },
  });
}
