import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { storageImage } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { usePopupSliderList } from "@/modules/sliders/hooks/usePopupSlider";
import type { SliderRow } from "@/modules/sliders/types/slider";

const PopupSlider = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();

  const { data: popupListData, isLoading, error } = usePopupSliderList({
    enabled: !!isPanelUp,
  });

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching pop upslider list data", error);
    }
  }, [error]);

  const columns: DataTableColumn<SliderRow>[] = [
    {
      key: "slNo",
      header: "SL No",
      sortable: false,
      searchable: false,
      hideable: false,
      render: (_row, i) => i + 1,
    },
    {
      key: "slider_images",
      header: "Image",
      sortable: false,
      searchable: false,
      render: (row) => (
        <img
          src={storageImage("slider_images", row.slider_images)}
          alt="Popup slider"
          className="h-10 w-10 rounded-md object-cover"
        />
      ),
      exportValue: (row) => row.slider_images,
    },
    {
      key: "slider_url",
      header: "URL",
      exportValue: (row) => row.slider_url,
    },
    {
      key: "slider_status",
      header: "Status",
      sortable: false,
      render: (row) =>
        row.slider_status === "Active" ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="secondary">{row.slider_status}</Badge>
        ),
      exportValue: (row) => row.slider_status,
    },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      hideable: false,
      render: (row) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate(`/popup-slider-edit/${row.id}`)}
          title="Edit Popup Slider"
          aria-label="Edit Popup Slider"
        >
          <Pencil />
        </Button>
      ),
      exportValue: () => "",
    },
  ];

  return (
    <Layout>
      <div className="space-y-4">
        <PageHeader
          title="Popup Slider List"
          description="Manage popup sliders"
          actions={
            <Button asChild variant="primary">
              <Link to="/add-popup-slider">
                <Plus /> Add Popup Slider
              </Link>
            </Button>
          }
        />
        {isLoading ? (
          <div className="rounded-lg border border-outline bg-surface-container-lowest shadow-md">
            <Spinner className="py-16" />
          </div>
        ) : (
          <DataTable
            title="Popup Slider List"
            data={popupListData ? popupListData : []}
            columns={columns}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search popup sliders…"
            emptyMessage="No popup sliders found."
          />
        )}
      </div>
    </Layout>
  );
};

export default PopupSlider;
