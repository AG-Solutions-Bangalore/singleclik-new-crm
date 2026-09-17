export interface ProfileForm {
  name: string;
  email: string;
  message: string;
}

export interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
