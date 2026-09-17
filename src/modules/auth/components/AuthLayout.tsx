import { useState } from "react";
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LOGO_URL = "https://singleclik.com/draft/assets/img/logos/logo.png";

export function BrandLogo({ size = "md", dark = false }: { size?: "sm" | "md"; dark?: boolean }) {
  const [logoOk, setLogoOk] = useState(true);
  const box = size === "md" ? "h-12 w-12 text-xl" : "h-10 w-10 text-base";

  return (
    <span className="flex items-center gap-2.5">
      {logoOk ? (
        <img
          src={LOGO_URL}
          alt="SingleClik logo"
          onError={() => setLogoOk(false)}
          className={cn(box, "shrink-0 rounded-xl bg-white object-contain p-1 shadow-sm")}
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            box,
            "flex shrink-0 items-center justify-center rounded-xl bg-white font-bold text-primary shadow-sm"
          )}
        >
          SC
        </span>
      )}
      <span className={cn("font-bold tracking-tight", size === "md" ? "text-2xl" : "text-xl", dark ? "text-primary" : "text-white")}>
        SingleClik
      </span>
    </span>
  );
}

interface AuthLayoutProps {
  title: string;
  description: string;
  brandHeading: string;
  brandCopy: string;
  brandPoints?: string[];
  flip?: boolean;
  children: ReactNode;
}

export function AuthLayout({
  title,
  description,
  brandHeading,
  brandCopy,
  brandPoints = [],
  flip = false,
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-dim p-4 text-on-surface md:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-secondary/10 blur-3xl"
      />

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-xl border border-outline bg-surface-container-lowest shadow-lg lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between gap-8 overflow-hidden bg-primary p-8 text-white lg:flex">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-black/10"
          />
          <BrandLogo />
          <div className="relative">
            <h1 className="text-headline-md font-semibold tracking-tight text-white">{brandHeading}</h1>
            <p className="mt-3 max-w-sm text-body-md leading-relaxed text-white/85">{brandCopy}</p>
            {brandPoints.length > 0 ? (
              <ul className="mt-5 flex flex-col gap-2.5">
                {brandPoints.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-label-md text-white/90">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <p className="relative text-label-sm text-white/70">Single Click Solution · CRM Panel</p>
        </div>

        <div className={cn("flex flex-col justify-center p-6 sm:p-8", flip && "lg:order-first")}>
          <div className="mb-6 lg:hidden">
            <BrandLogo size="sm" dark />
          </div>
          <h2 className="text-headline-md font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 mb-6 text-body-md text-on-surface-variant">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
