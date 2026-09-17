import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { FEEDBACK_LIST_URL } from "@/modules/feedback/api/feedback.api";
import type { FeedbackRow } from "@/modules/feedback/types/feedback.types";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";

const FeedbackList = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(FEEDBACK_LIST_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFeedbackData(response.data?.feedback);
      } catch (error) {
        console.error("Error fetching feedback list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedData();
    setLoading(false);
  }, []);

  const columns: DataTableColumn<FeedbackRow>[] = [
    {
      key: "slNo",
      header: "SL No",
      sortable: false,
      searchable: false,
      render: (_row, i) => i + 1,
    },
    {
      key: "name",
      header: "Full name",
      sortable: false,
    },
    {
      key: "feedback_subject",
      header: "Subject",
      sortable: false,
    },
    {
      key: "feedback_description",
      header: "Description",
      sortable: false,
    },
  ];

  return (
    <Layout>
      <div className="mt-5">
        <DataTable
          title="Feedback List"
          description="Customer feedback submitted through the platform"
          data={feedbackData ? feedbackData : []}
          columns={columns}
          loading={loading}
          rowKey={(row) => row.id}
          searchPlaceholder="Search feedback…"
          disableDownload
          disablePrint
          emptyMessage="No feedback found."
        />
      </div>
    </Layout>
  );
};

export default FeedbackList;
