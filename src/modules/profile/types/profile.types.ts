import { getUserField } from "@/lib/auth-storage";

export interface ProfileForm {
  name: string;
  email: string;
  message: string;
}

export function getDefaultProfileForm(): ProfileForm {
  return {
    name: getUserField("name"),
    email: getUserField("email"),
    message: "",
  };
}

export interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
