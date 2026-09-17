import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { useFeedbackList } from "@/modules/feedback/hooks/useFeedbackList";
import type { FeedbackRow } from "@/modules/feedback/types/feedback.types";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { TableSkeleton } from "@/components/ui/table-skeleton";

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
      render: (_row, i) => <span className="text-on-surface-variant tabular-nums">{i + 1}</span>,
    },
    {
      key: "name",
      header: "Full name",
      sortable: false,
      render: (row) => <span className="font-medium whitespace-nowrap text-on-surface">{row.name}</span>,
    },
    {
      key: "feedback_subject",
      header: "Subject",
      sortable: false,
      render: (row) => (
        <Badge variant="primary" className="max-w-48 truncate">
          {row.feedback_subject}
        </Badge>
      ),
    },
    {
      key: "feedback_description",
      header: "Description",
      sortable: false,
      render: (row) => (
        <span className="block max-w-md whitespace-normal text-body-md text-on-surface">
          {row.feedback_description}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Feedback"
          description={
            loading
              ? "Loading customer feedback…"
              : `${feedbackData.length} ${feedbackData.length === 1 ? "message" : "messages"} submitted through the platform`
          }
          actions={
            feedbackData.length > 0 ? (
              <Badge variant="secondary" className="tabular-nums">
                {feedbackData.length} total
              </Badge>
            ) : undefined
          }
        />
        {loading && feedbackData.length === 0 ? (
          <TableSkeleton />
        ) : (
          <DataTable
            title={`All feedback · ${feedbackData.length} total`}
            description="What customers are telling you."
            data={feedbackData}
            columns={columns}
            loading={loading}
            rowKey={(row) => row.id}
            searchPlaceholder="Search by name or subject…"
            disableDownload
            disablePrint
            emptyMessage="No feedback found."
          />
        )}
      </div>
    </Layout>
  );
};

export default FeedbackList;
