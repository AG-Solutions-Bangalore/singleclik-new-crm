import { BrandLogo } from "@/components/common/BrandLogo";
import { cn } from "@/lib/utils";
import { Lock, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  description: string;
  brandHeading?: string;
  brandCopy?: string;
  brandPoints?: string[];
  flip?: boolean;
  children: ReactNode;
}

export function AuthLayout({
  title,
  description,
  flip = false,
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#0B1120] dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900">
      {/* Subtle atmospheric ambient glow matching SingleClik Blue & Emerald */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[520px] rounded-full bg-blue-200/40 blur-[130px] dark:bg-blue-900/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 size-[520px] rounded-full bg-emerald-200/30 blur-[130px] dark:bg-emerald-950/20"
      />

      {/* Top Navbar */}
      <header className="relative z-20 flex w-full shrink-0 items-center justify-between px-6 py-4 md:px-12 lg:px-16">
        <BrandLogo to="/" />
        <div className="hidden items-center gap-6 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase dark:text-slate-400 md:flex">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Network · Privacy First · 100+ Categories
          </span>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="scrollbar-hide relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 items-center overflow-y-auto px-4 py-4 sm:px-6 md:px-10 lg:px-14 lg:py-2">
        <div className="m-auto grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: SingleClik Verified Showcase */}
          <div
            className={cn(
              "hidden flex-col justify-center lg:flex lg:col-span-7 xl:col-span-7",
              flip && "lg:order-last"
            )}
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-blue-700 uppercase shadow-2xs dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              <Sparkles className="size-3.5" />
              <span>Verified Business Marketplace · Single Clik</span>
            </div>

            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[46px] xl:text-[52px] leading-[1.08]">
              Connect.{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Collaborate.
              </span>{" "}
              <br />
              Get Things Done.
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              Single Clik connects you with verified businesses and professionals without sharing your personal contact. Enquire, chat, and get things done – all in one secure platform.
            </p>

            {/* 4 Value Pillars from singleclik.com */}
            <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3.5 shadow-2xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/80">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <ShieldCheck className="size-5" />
                </span>
                <div className="min-w-0 leading-tight">
                  <span className="block text-[13px] font-semibold text-slate-900 dark:text-white">
                    Verified Network
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Trusted businesses only
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3.5 shadow-2xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/80">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Lock className="size-5" />
                </span>
                <div className="min-w-0 leading-tight">
                  <span className="block text-[13px] font-semibold text-slate-900 dark:text-white">
                    100% Private & Secure
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    No personal numbers shared
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3.5 shadow-2xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/80">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <MessageSquare className="size-5" />
                </span>
                <div className="min-w-0 leading-tight">
                  <span className="block text-[13px] font-semibold text-slate-900 dark:text-white">
                    Direct In-App Chat
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Enquire & negotiate safely
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3.5 shadow-2xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/80">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  <Sparkles className="size-5" />
                </span>
                <div className="min-w-0 leading-tight">
                  <span className="block text-[13px] font-semibold text-slate-900 dark:text-white">
                    98% Satisfaction Rate
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Fast, simple & reliable
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Auth Card */}
          <div className="flex w-full justify-center lg:col-span-5 xl:col-span-5">
            <div className="w-full max-w-[420px] rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-none sm:p-7">
              <div className="text-center">
                <p className="text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase dark:text-blue-400">
                  SINGLECLIK CRM PORTAL
                </p>
                <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Single<span className="text-blue-600 dark:text-blue-400">Clik</span>
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description || title}</p>
              </div>

              <div className="mt-5">{children}</div>

              <div className="mt-6 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase dark:text-slate-500">
                  Bridging People & Businesses for a Smarter Tomorrow
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 shrink-0 border-t border-slate-200 px-6 py-3 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>© 2024 Single Clik. All rights reserved. Connecting people & businesses safely.</p>
      </footer>
    </div>
  );
}
