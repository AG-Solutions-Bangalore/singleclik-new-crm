import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, LayoutGrid, Tags } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { NO_IMAGE, storageImage } from "@/lib/constants";
import { useDashboardStats } from "@/modules/dashboard/hooks/useDashboard";
import { Badge } from "@/components/ui/badge";
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
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 14,
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

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-6">
        <PageHeader
          title="Dashboard"
          description={
            loading
              ? "Loading overview…"
              : `${categoriesData.length} categor${categoriesData.length === 1 ? "y" : "ies"} · ${totalMembers} business${totalMembers === 1 ? "" : "es"}`
          }
        />

        {loading ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-11 shrink-0 rounded-lg" />
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Card key={i} className="flex flex-col items-center gap-2.5 p-4">
                  <Skeleton className="size-16 rounded-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </Card>
              ))}
            </div>
          </>
        ) : categoriesData.length === 0 ? (
          <EmptyState icon={LayoutGrid} title="No categories found." />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                icon={Tags}
                label="Total Categories"
                value={String(categoriesData.length)}
                accent="bg-primary-container text-on-primary-container"
              />
              <StatCard
                icon={Building2}
                label="Total Businesses"
                value={String(totalMembers)}
                accent="bg-secondary-container text-on-secondary-container"
              />
              <StatCard
                icon={LayoutGrid}
                label="Empty Categories"
                value={String(categoriesData.filter((c) => c.member_count == "0").length)}
                accent="bg-tertiary-container text-on-tertiary-container"
              />
            </div>
            <motion.div
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categoriesData.map((item) => (
                <motion.div
                  key={item.id}
                  onClick={() => navigate(`/category-edit/${item.id}`)}
                  variants={itemVariants}
                  whileHover={{
                    y: -4,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  className="cursor-pointer"
                >
                  <Card className="group flex h-full flex-col items-center gap-2 p-4 text-center transition-colors hover:border-primary hover:bg-surface-container-low">
                    <span className="relative">
                      <motion.img
                        src={
                          item.category_image === "null" || !item.category_image
                            ? NO_IMAGE
                            : storageImage("categories_images", item.category_image)
                        }
                        alt={item.category}
                        className="size-16 rounded-full border-2 border-outline object-cover shadow-md transition-colors group-hover:border-primary"
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <Badge
                        variant={item.member_count == "0" ? "destructive" : "success"}
                        className="absolute -top-1 -right-2 shadow-sm"
                      >
                        {item.member_count}
                      </Badge>
                    </span>
                    <h3 className="w-full truncate text-label-md font-medium text-on-surface">
                      {item.category}
                    </h3>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
