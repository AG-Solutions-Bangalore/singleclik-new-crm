import type { ImgHTMLAttributes } from "react";
import { storageImage } from "@/lib/constants";
import { cn } from "@/lib/utils";

const avatarSizes = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-24 w-24",
  xl: "h-32 w-32",
} as const;

interface AvatarImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  folder: string;
  file?: string | null;
  alt: string;
  size?: keyof typeof avatarSizes;
}

function AvatarImage({ folder, file, alt, size = "sm", className, ...props }: AvatarImageProps) {
  return (
    <img
      src={storageImage(folder, file)}
      alt={alt}
      loading="lazy"
      className={cn(avatarSizes[size], "rounded-full border border-outline object-cover", className)}
      {...props}
    />
  );
}

export { AvatarImage };
