import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  LayoutGrid,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Tags,
  Users,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { NO_IMAGE, storageImage } from "@/lib/constants";
import { useDashboardStats } from "@/modules/dashboard/hooks/useDashboard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 16,
    },
  },
};

const Home = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const { data: categoriesData = [], isLoading: loading, error } = useDashboardStats();
  const [searchTerm, setSearchTerm] = useState("");
  const userName = localStorage.getItem("name") ?? "Admin";

  // Time-aware greeting
  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching dashboard data", error);
    }
  }, [error]);

  const totalMembers = categoriesData.reduce((sum, item) => sum + (Number(item.member_count) || 0), 0);

  const filteredCategories = categoriesData.filter((item) =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col gap-6 md:gap-8">
        {/* Top Hero Greeting Banner matching Reference Image 3 */}
        <div className="group relative overflow-hidden rounded-[26px] border border-[#E8E1D5] bg-gradient-to-r from-[#FBF9F5] via-[#F6F1E8] to-[#ECE3D4] shadow-sm dark:border-[#282B34] dark:from-[#1A1B20] dark:via-[#16171B] dark:to-[#121316]">
          {/* Card background image — aligned to the right side */}
          <div aria-hidden className="absolute inset-0">
            <img
              src="https://singleclik.com/api/public/assets/images/web_images/about.webp"
              alt=""
              className="absolute inset-y-0 right-0 h-full w-full object-cover opacity-15 transition-transform duration-700 group-hover:scale-[1.02] lg:left-auto lg:w-[46%] lg:opacity-100 lg:[mask-image:linear-gradient(to_right,transparent,black_28%)]"
            />
            {/* Readability fade so left text stays legible over the bg */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FBF9F5] via-[#F6F1E8]/80 to-transparent dark:from-[#1A1B20] dark:via-[#16171B]/80 dark:to-transparent lg:via-[#F6F1E8]/40 lg:to-transparent dark:lg:via-[#16171B]/40" />
          </div>

          <div className="relative z-10 grid items-center gap-6 p-6 md:p-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DFD5C6] bg-white/70 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#8B5E3C] uppercase shadow-2xs dark:border-[#333742] dark:bg-[#20222A] dark:text-[#D4AF37]">
                <Sparkles className="size-3.5" />
                <span>SingleClik Marketplace & CRM</span>
              </div>

              <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#1C1917] dark:text-[#FAF8F5] sm:text-3xl lg:text-4xl">
                {timeGreeting}, {userName}! 👋
              </h1>
              <p className="mt-1 font-serif-accent italic text-base text-[#8B5E3C] dark:text-[#C89968]">
                Welcome back to SingleClik CRM
              </p>
              <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-[#605A51] dark:text-[#A4A6B0]">
                Single Clik connects you with verified businesses and professionals without sharing your personal contact. Oversee categories, monitor inquiries, and manage your network in one place.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate("/add-category")}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#18181B] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#2F2C29] active:scale-95 dark:bg-[#F0E6D8] dark:text-[#18181B] dark:hover:bg-[#E3D4C0]"
                >
                  <Plus className="size-3.5" />
                  <span>Add Category</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/member-list")}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#D5CCC0] bg-white/80 px-4 py-2 text-xs font-semibold text-[#1C1917] shadow-2xs transition-colors hover:bg-white dark:border-[#353842] dark:bg-[#20222A] dark:text-[#FAF8F5]"
                >
                  <Building2 className="size-3.5" />
                  <span>Verified Businesses</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/user-list")}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#D5CCC0] bg-white/80 px-4 py-2 text-xs font-semibold text-[#1C1917] shadow-2xs transition-colors hover:bg-white dark:border-[#353842] dark:bg-[#20222A] dark:text-[#FAF8F5]"
                >
                  <Users className="size-3.5" />
                  <span>Consumers</span>
                  <ArrowRight className="size-3.5 text-[#8B5E3C]" />
                </button>
              </div>
            </div>

          
          </div>
        </div>

        {/* 4 Pastel Tinted Metric Cards matching Reference Image 3 */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-2 h-8 w-16" />
                <Skeleton className="mt-2 h-3 w-32" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Tags}
              label="Total Categories"
              value={String(categoriesData.length)}
              variant="amber"
              badge="+12%"
              hint="Active marketplace groupings"
            />
            <StatCard
              icon={Building2}
              label="Verified Businesses"
              value={String(totalMembers)}
              variant="blue"
              badge="↑ 8%"
              hint="Registered service providers"
            />
            <StatCard
              icon={MessageSquare}
              label="Active Inquiries"
              value="1,650"
              variant="mint"
              badge="↑ 14%"
              hint="Private in-app negotiations"
            />
            <StatCard
              icon={Users}
              label="Consumer Reach"
              value="100+"
              variant="purple"
              badge="98%"
              hint="Zero contact sharing"
            />
          </div>
        )}

        {/* Categories Directory Grid matching Reference Image 2 & 3 */}
        <section
          aria-label="Categories Directory"
          className="overflow-hidden rounded-[24px] border border-[#E8E1D5] bg-white p-5 shadow-xs dark:border-[#262830] dark:bg-[#16171B] md:p-6"
        >
          {/* Header & Search Bar */}
          <div className="mb-6 flex flex-col gap-4 border-b border-[#EFE8DD] pb-5 dark:border-[#24262E] md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <p className="text-[11px] font-bold tracking-[0.16em] text-[#8B5E3C] uppercase dark:text-[#C89968]">
                  DIRECTORY
                </p>
                <span className="text-[#CFC5B6]">·</span>
                <span className="text-xs font-semibold text-[#605A51] dark:text-[#A1A1AA]">
                  {categoriesData.length} Total
                </span>
              </div>
              <h2 className="mt-0.5 font-display text-xl font-bold tracking-tight text-[#1C1917] dark:text-[#FAF8F5]">
                Marketplace Categories
              </h2>
              <p className="text-xs text-[#78716C] dark:text-[#A1A1AA]">
                Browse all active categories with verified business listings
              </p>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8A7D71]" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full rounded-full border border-[#E5DFD5] bg-[#FAF8F5] pl-9 pr-4 text-xs shadow-2xs transition-colors focus:border-[#8B5E3C] focus:bg-white focus:outline-none dark:border-[#2C2E38] dark:bg-[#1E2025] dark:focus:border-[#D4AF37]"
                />
              </div>
              <button
                type="button"
                onClick={() => navigate("/add-category")}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[#18181B] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#2F2C29] dark:bg-[#F0E6D8] dark:text-[#18181B]"
              >
                <Plus className="size-3.5" />
                <span className="hidden sm:inline">Add Category</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-outline p-5"
                >
                  <Skeleton className="size-16 rounded-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <EmptyState
              icon={LayoutGrid}
              title="No categories found."
              description="No categories match your search query."
            />
          ) : (
            <motion.div
              className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredCategories.map((item) => {
                const count = Number(item.member_count) || 0;
                const isEmpty = count === 0;

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => navigate(`/category-edit/${item.id}`)}
                    variants={itemVariants}
                    whileHover={{ y: -4, transition: { duration: 0.18, ease: "easeOut" } }}
                    className="cursor-pointer"
                  >
                    <div className="group flex h-full flex-col items-center gap-2.5 rounded-2xl border border-[#E8E1D5] bg-[#FAF8F5] p-4 text-center shadow-2xs transition-all duration-200 hover:border-[#8B5E3C] hover:bg-white hover:shadow-md dark:border-[#262830] dark:bg-[#1A1C22] dark:hover:border-[#D4AF37] dark:hover:bg-[#20222A]">
                      <span className="relative">
                        <motion.img
                          src={
                            item.category_image === "null" || !item.category_image
                              ? NO_IMAGE
                              : storageImage("categories_images", item.category_image)
                          }
                          alt={item.category}
                          loading="lazy"
                          className="size-16 rounded-full border-2 border-[#E5DFD5] object-cover shadow-sm transition-colors group-hover:border-[#8B5E3C] dark:border-[#353842]"
                          whileHover={{ scale: 1.06 }}
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        />
                        <span
                          className={`absolute -top-1 -right-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums shadow-xs ${
                            isEmpty
                              ? "bg-[#FEE2E2] text-[#991B1B] dark:bg-[#3B1717] dark:text-[#FCA5A5]"
                              : "bg-[#E8F8F0] text-[#1E824C] dark:bg-[#152B20] dark:text-[#6EE7B7]"
                          }`}
                        >
                          {item.member_count}
                        </span>
                      </span>

                      <div className="w-full">
                        <span className="block truncate font-display text-[14px] font-semibold text-[#1C1917] group-hover:text-[#8B5E3C] dark:text-[#FAF8F5] dark:group-hover:text-[#D4AF37]">
                          {item.category}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[#78716C] dark:text-[#A1A1AA] tabular-nums">
                          {count === 0 ? "No businesses yet" : `${count} verified`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Home;
