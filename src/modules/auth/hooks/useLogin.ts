import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PANEL_LOGIN_URL } from "@/modules/auth/api/auth.api";

export interface LoginPayload {
  username: string;
  password: string;
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
    onSuccess: (res) => {
      if (res.status === 200 && res.data?.msg === "success.") {
        const token = res.data.UserInfo?.token;
        if (token) {
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
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("An error occurred during login.");
    },
  });
}
