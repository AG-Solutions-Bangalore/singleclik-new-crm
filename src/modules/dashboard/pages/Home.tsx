import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Building2, LayoutGrid, Tags } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { NO_IMAGE, storageImage } from "@/lib/constants";
import { useDashboardStats } from "@/modules/dashboard/hooks/useDashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
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

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching user list data", error);
    }
  }, [error]);

  const totalMembers = categoriesData.reduce((sum, item) => sum + (Number(item.member_count) || 0), 0);
  const emptyCount = categoriesData.filter((c) => c.member_count == "0").length;

  return (
    <Layout>
      <div className="flex flex-col gap-5 md:gap-6">
        <PageHeader
          title="Dashboard"
          description="Welcome back — here's what's happening across your marketplace today."
          actions={
            <>
              <Button variant="outline" size="sm" onClick={() => navigate("/member-list")}>
                <Building2 />
                Businesses
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate("/user-list")}>
                Consumers
                <ArrowUpRight />
              </Button>
            </>
          }
        />

        {loading ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-9 w-20" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                    <Skeleton className="size-12 shrink-0 rounded-xl" />
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2.5 rounded-xl border border-outline bg-surface p-4"
                  >
                    <Skeleton className="size-16 rounded-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            </Card>
          </>
        ) : categoriesData.length === 0 ? (
          <EmptyState
            icon={LayoutGrid}
            title="No categories found."
            description="Categories you create will appear here with live business counts."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                icon={Tags}
                label="Total Categories"
                value={String(categoriesData.length)}
                hint="Active groupings in the directory"
                accent="bg-primary-container text-on-primary-container"
              />
              <StatCard
                icon={Building2}
                label="Total Businesses"
                value={String(totalMembers)}
                hint="Across all categories"
                accent="bg-secondary-container text-on-secondary-container"
              />
              <StatCard
                icon={LayoutGrid}
                label="Empty Categories"
                value={String(emptyCount)}
                hint={emptyCount === 0 ? "Everything is populated" : "Need attention"}
                accent="bg-tertiary-container text-on-tertiary-container"
              />
            </div>

            <section aria-label="Categories" className="overflow-hidden rounded-xl border border-outline bg-surface-container-lowest shadow-md">
              <div className="flex flex-col gap-1 border-b border-outline px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-title-lg font-semibold tracking-tight">Categories</h2>
                  <Badge variant="muted" className="tabular-nums">
                    {categoriesData.length}
                  </Badge>
                </div>
                <p className="text-body-md text-on-surface-variant">
                  {totalMembers} {totalMembers === 1 ? "business" : "businesses"} in total · click a card to manage
                </p>
              </div>

              <motion.div
                className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:p-4 md:grid-cols-4 lg:grid-cols-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {categoriesData.map((item) => {
                  const count = Number(item.member_count) || 0;
                  const isEmpty = item.member_count == "0";
                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => navigate(`/category-edit/${item.id}`)}
                      variants={itemVariants}
                      whileHover={{ y: -4, transition: { duration: 0.18, ease: "easeOut" } }}
                      className="cursor-pointer"
                    >
                      <div className="group flex h-full flex-col items-center gap-2 rounded-xl border border-outline bg-surface px-3 pt-5 pb-4 text-center shadow-sm transition-all hover:border-primary hover:shadow-md">
                        <span className="relative">
                          <motion.img
                            src={
                              item.category_image === "null" || !item.category_image
                                ? NO_IMAGE
                                : storageImage("categories_images", item.category_image)
                            }
                            alt={item.category}
                            loading="lazy"
                            className="size-16 rounded-full border-2 border-outline object-cover shadow-sm transition-colors group-hover:border-primary"
                            whileHover={{ scale: 1.06 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18 }}
                          />
                          <Badge
                            variant={isEmpty ? "destructive" : "success"}
                            className="absolute -top-1.5 -right-3 px-2 shadow-sm tabular-nums"
                          >
                            {item.member_count}
                          </Badge>
                        </span>
                        <span className="w-full">
                          <span className="block w-full truncate text-label-md font-medium text-on-surface">
                            {item.category}
                          </span>
                          <span className="mt-0.5 block text-label-sm font-normal text-on-surface-variant tabular-nums">
                            {count === 0 ? "No businesses yet" : `${count} ${count === 1 ? "business" : "businesses"}`}
                          </span>
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
