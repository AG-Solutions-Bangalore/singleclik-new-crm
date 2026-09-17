import { useEffect } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
          alt="Slider"
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
          onClick={(e) => handleEdit(e, row.id)}
          title="Edit Slider Info"
          aria-label="Edit Slider Info"
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
          title="Adv Slider List"
          description="Manage advertisement sliders"
          actions={
            <Button asChild variant="primary">
              <Link to="/add-slider">
                <Plus /> Add Slider
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
            title="Adv Slider List"
            data={sliderListData}
            columns={columns}
            rowKey={(row) => row.id}
            disableDownload
            disablePrint
            searchPlaceholder="Search sliders…"
            emptyMessage="No sliders found."
          />
        )}
      </div>
    </Layout>
  );
};

export default SliderList;
