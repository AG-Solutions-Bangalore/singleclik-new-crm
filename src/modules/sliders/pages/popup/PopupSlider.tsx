import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAppContext } from "@/context/app-context";
import { storageImage } from "@/lib/constants";
import { StatusBadge } from "@/components/common/StatusBadge";
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
      render: (_row, i) => <span className="text-on-surface-variant tabular-nums">{i + 1}</span>,
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
          loading="lazy"
          className="h-10 w-14 rounded-lg border border-outline object-cover shadow-sm"
        />
      ),
      exportValue: (row) => row.slider_images,
    },
    {
      key: "slider_url",
      header: "URL",
      render: (row) => (
        <span className="block max-w-64 truncate text-body-md text-on-surface" title={row.slider_url}>
          {row.slider_url}
        </span>
      ),
      exportValue: (row) => row.slider_url,
    },
    {
      key: "slider_status",
      header: "Status",
      sortable: false,
      render: (row) => <StatusBadge status={row.slider_status} inactiveVariant="secondary" />,
      exportValue: (row) => row.slider_status,
    },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      hideable: false,
      render: (row) => (
        <div className="inline-flex items-center rounded-lg border border-outline/70 bg-surface p-0.5 shadow-sm">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(`/popup-slider-edit/${row.id}`)}
            title="Edit Popup Slider"
            aria-label="Edit Popup Slider"
            className="rounded-md hover:bg-primary-container hover:text-on-primary-container"
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      ),
      exportValue: () => "",
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Popup Sliders"
          description={
            isLoading
              ? "Loading popup sliders…"
              : `${popupListData?.length ?? 0} ${(popupListData?.length ?? 0) === 1 ? "popup" : "popups"} · shown on app launch`
          }
          actions={
            <Button asChild size="sm">
              <Link to="/add-popup-slider">
                <Plus /> Add Popup Slider
              </Link>
            </Button>
          }
        />
        {isLoading ? (
          <div className="rounded-xl border border-outline bg-surface-container-lowest shadow-md">
            <Spinner className="py-16" />
          </div>
        ) : (
          <DataTable
            title={`All popup sliders · ${popupListData?.length ?? 0} total`}
            description="Popups, destinations and visibility."
            data={popupListData ? popupListData : []}
            columns={columns}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search by URL…"
            emptyMessage="No popup sliders found."
          />
        )}
      </div>
    </Layout>
  );
};

export default PopupSlider;
