import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
}

export function PasswordInput({ id, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative block">
      <Input id={id} type={show ? "text" : "password"} className="pr-10" {...props} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition-colors outline-none hover:bg-surface-container-low hover:text-on-surface focus-visible:outline-[2px] focus-visible:outline-primary"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </span>
  );
}
