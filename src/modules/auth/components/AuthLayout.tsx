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
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[#F7F4EE] text-[#1C1917] dark:bg-[#0E0F12] dark:text-[#FAF8F5] selection:bg-[#F0E6D8] selection:text-[#1C1917]">
      {/* Subtle atmospheric ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[520px] rounded-full bg-[#EADCC7]/40 blur-[120px] dark:bg-[#2A231A]/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 size-[520px] rounded-full bg-[#E5D7C2]/40 blur-[120px] dark:bg-[#221B14]/30"
      />

      {/* Top Navbar */}
      <header className="relative z-20 flex w-full shrink-0 items-center justify-between px-6 py-4 md:px-12 lg:px-16">
        <BrandLogo to="/" />
        <div className="hidden items-center gap-6 text-[11px] font-semibold tracking-[0.14em] text-[#78716C] uppercase dark:text-[#A1A1AA] md:flex">
          <span>Quality · Privacy · Verified Businesses</span>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="scrollbar-hide relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 items-center overflow-y-auto px-4 py-4 sm:px-6 md:px-10 lg:px-14 lg:py-2">
        <div className="m-auto grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: SingleClik Verified Editorial Showcase */}
          <div
            className={cn(
              "hidden flex-col justify-center lg:flex lg:col-span-7 xl:col-span-7",
              flip && "lg:order-last"
            )}
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DFD6C7] bg-[#EFE9DD]/80 px-3.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#8B5E3C] uppercase shadow-xs dark:border-[#302820] dark:bg-[#221C16] dark:text-[#D4AF37]">
              <Sparkles className="size-3.5" />
              <span>Verified Business Marketplace · Single Clik</span>
            </div>

            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#1C1917] dark:text-[#FAF8F5] sm:text-5xl lg:text-[46px] xl:text-[52px] leading-[1.08]">
              Connect.{" "}
              <span className="font-serif-accent italic font-normal text-[#8B5E3C] dark:text-[#D4AF37]">
                Collaborate.
              </span>{" "}
              <br />
              Get Things Done.
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#605A51] dark:text-[#A4A6B0]">
              Single Clik connects you with verified businesses and professionals without sharing your personal contact. Enquire, chat, and get things done – all in one secure platform.
            </p>

            {/* 4 Value Pillars */}
            <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-[#E8E1D5] bg-white/70 p-3 shadow-2xs backdrop-blur-xs dark:border-[#262830] dark:bg-[#16171B]/70">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FDF4EA] text-[#8B5E3C] dark:bg-[#2C2117] dark:text-[#E2B185]">
                  <ShieldCheck className="size-4.5" />
                </span>
                <div className="min-w-0 leading-tight">
                  <span className="block text-[13px] font-semibold text-[#1C1917] dark:text-[#FAF8F5]">
                    Verified Businesses
                  </span>
                  <span className="block text-[11px] text-[#78716C] dark:text-[#A1A1AA]">
                    100+ trusted providers
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#E8E1D5] bg-white/70 p-3 shadow-2xs backdrop-blur-xs dark:border-[#262830] dark:bg-[#16171B]/70">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8] dark:bg-[#162238] dark:text-[#93C5FD]">
                  <Lock className="size-4.5" />
                </span>
                <div className="min-w-0 leading-tight">
                  <span className="block text-[13px] font-semibold text-[#1C1917] dark:text-[#FAF8F5]">
                    Zero Number Sharing
                  </span>
                  <span className="block text-[11px] text-[#78716C] dark:text-[#A1A1AA]">
                    100% privacy protected
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#E8E1D5] bg-white/70 p-3 shadow-2xs backdrop-blur-xs dark:border-[#262830] dark:bg-[#16171B]/70">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#047857] dark:bg-[#142C22] dark:text-[#6EE7B7]">
                  <MessageSquare className="size-4.5" />
                </span>
                <div className="min-w-0 leading-tight">
                  <span className="block text-[13px] font-semibold text-[#1C1917] dark:text-[#FAF8F5]">
                    Built-in Secure Chat
                  </span>
                  <span className="block text-[11px] text-[#78716C] dark:text-[#A1A1AA]">
                    Discuss details in real-time
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#E8E1D5] bg-white/70 p-3 shadow-2xs backdrop-blur-xs dark:border-[#262830] dark:bg-[#16171B]/70">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F3FF] text-[#6D28D9] dark:bg-[#251D3C] dark:text-[#C4B5FD]">
                  <Sparkles className="size-4.5" />
                </span>
                <div className="min-w-0 leading-tight">
                  <span className="block text-[13px] font-semibold text-[#1C1917] dark:text-[#FAF8F5]">
                    Centralized Enquiries
                  </span>
                  <span className="block text-[11px] text-[#78716C] dark:text-[#A1A1AA]">
                    Close deals in one place
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Luxury Card */}
          <div className="flex w-full justify-center lg:col-span-5 xl:col-span-5">
            <div className="w-full max-w-[420px] rounded-[28px] border border-[#E8E1D5] bg-white/95 p-6 shadow-[0_16px_44px_-10px_rgba(28,25,23,0.08)] backdrop-blur-md dark:border-[#282B34] dark:bg-[#16171B]/95 sm:p-7">
              <div className="text-center">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A7D71] uppercase dark:text-[#9E968B]">
                  WELCOME TO
                </p>
                <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-[#1C1917] dark:text-[#FAF8F5]">
                  Single<span className="text-[#8B5E3C] dark:text-[#C89968]">Clik</span>
                </h2>
                <p className="mt-1 text-sm text-[#78716C] dark:text-[#A1A1AA]">{description || title}</p>
              </div>

              <div className="mt-5">{children}</div>

              <div className="mt-6 border-t border-[#EFE8DD] pt-4 text-center dark:border-[#282B34]">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-[#A89F93] uppercase dark:text-[#6A6660]">
                  Quality Today · A Stronger Tomorrow
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 shrink-0 border-t border-[#E8E1D5] px-6 py-3 text-center text-xs text-[#8A7D71] dark:border-[#22242B] dark:text-[#78716C]">
        <p>© 2024 Single Clik. All rights reserved. Connecting people & businesses safely.</p>
      </footer>
    </div>
  );
}
