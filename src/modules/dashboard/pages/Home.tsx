import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { NO_IMAGE, storageImage } from "@/lib/constants";
import { useDashboardStats } from "@/modules/dashboard/hooks/useDashboard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Dashboard"
          description={
            loading ? "Loading categories…" : `${categoriesData.length} categor${categoriesData.length === 1 ? "y" : "ies"}`
          }
        />
        {loading ? (
          <Card>
            <Spinner className="py-12" />
          </Card>
        ) : categoriesData.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 py-12 text-center">
            <LayoutGrid className="size-8 text-on-surface-variant" />
            <p className="text-body-md text-on-surface-variant">No categories found.</p>
          </Card>
        ) : (
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
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeInOut" },
                }}
              >
                <Card className="relative cursor-pointer overflow-hidden p-3 transition-colors hover:bg-surface-container-low">
                  <div className="relative flex items-center justify-center">
                    <motion.img
                      src={
                        item.category_image === "null" || !item.category_image
                          ? NO_IMAGE
                          : storageImage("categories_images", item.category_image)
                      }
                      alt={item.category}
                      className="h-14 w-14 rounded-full object-cover shadow-md"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    <motion.div
                      className="absolute top-0 right-0"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <Badge variant={item.member_count == "0" ? "destructive" : "success"}>
                        {item.member_count}
                      </Badge>
                    </motion.div>
                  </div>
                  <div className="pt-2">
                    <h3 className="truncate text-center text-label-sm font-semibold text-on-surface">
                      {item.category}
                    </h3>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
