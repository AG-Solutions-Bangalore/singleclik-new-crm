export interface ProfileForm {
  name: string;
  email: string;
  message: string;
}

export function getDefaultProfileForm(): ProfileForm {
  return {
    name: localStorage.getItem("name") ?? "",
    email: localStorage.getItem("email") ?? "",
    message: "",
  };
}

export interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
