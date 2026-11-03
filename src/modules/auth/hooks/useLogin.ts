import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PANEL_LOGIN_URL } from "@/modules/auth/api/auth.api";
import { setAuthToken, setUserSession } from "@/lib/auth-storage";

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
          const user = res.data.UserInfo?.user || {};
          const loginUser = variables.username;

          // Remember me ON  -> localStorage (persists across browser restarts)
          // Remember me OFF -> sessionStorage (forgotten when tab/browser closes)
          setAuthToken(token, remember);

          const store = remember ? localStorage : sessionStorage;
          if (loginUser) {
            store.setItem("login_username", loginUser);
          }

          setUserSession(
            {
              id: String(user.user_type ?? user.id ?? ""),
              name: user.name || loginUser || "Admin",
              username: user.name || loginUser || user.mobile || "Admin",
              email: user.email || "",
              user_type_id: String(user.user_type ?? ""),
            },
            remember,
          );
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
