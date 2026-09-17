import { useEffect } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useAdvSliderList } from "@/modules/sliders/hooks/useAdvSlider";
import type { SliderRow } from "@/modules/sliders/types/slider";

const SliderList = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");

  const { data: sliderListData = [], isLoading, error } = useAdvSliderList({
    enabled: !!isPanelUp,
  });

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching slider list data", error);
    }
  }, [error]);

  const handleEdit = (e: ReactMouseEvent, id: number) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam ?? "null");
    navigate(`/slider-edit/${id}`);
  };

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
          alt="Slider"
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
            onClick={(e) => handleEdit(e, row.id)}
            title="Edit Slider Info"
            aria-label="Edit Slider Info"
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
          title="Ad Sliders"
          description={
            isLoading
              ? "Loading advertisement sliders…"
              : `${sliderListData.length} ${sliderListData.length === 1 ? "banner" : "banners"} · shown across the app`
          }
          actions={
            <Button asChild size="sm">
              <Link to="/add-slider">
                <Plus /> Add Slider
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
            title={`All ad sliders · ${sliderListData.length} total`}
            description="Banners, destinations and visibility."
            data={sliderListData}
            columns={columns}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search by URL…"
            emptyMessage="No sliders found."
          />
        )}
      </div>
    </Layout>
  );
};

export default SliderList;
