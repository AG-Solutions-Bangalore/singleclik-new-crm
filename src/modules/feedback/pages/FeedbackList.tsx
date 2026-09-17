import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { useFeedbackList } from "@/modules/feedback/hooks/useFeedbackList";
import type { FeedbackRow } from "@/modules/feedback/types/feedback.types";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";

const FeedbackList = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const { data: feedbackData = [], isLoading: loading, error } = useFeedbackList();

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching feedback list data", error);
    }
  }, [error]);

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
          data={feedbackData}
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
