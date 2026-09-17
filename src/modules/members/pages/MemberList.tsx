import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import { TbStatusChange } from "react-icons/tb";
import { Camera, ImageOff, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/app-context";
import { AvatarImage } from "@/components/common/AvatarImage";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useHoldMember, useMembersList } from "../hooks/useMembersList";
import type { MemberRow } from "../types/member";
import { cn } from "@/lib/utils";

type PhotoFilter = "All" | "Photo" | "No photo";

const profileTypeLabel = (value: MemberRow["profile_type"]): string => {
  const normalized = String(value);
  if (normalized === "0") return "Business";
  if (normalized === "1") return "Service";
  if (normalized === "0,1") return "Business/Service";
  return "Unknown";
};

const profileBadgeVariant = (value: MemberRow["profile_type"]): "primary" | "secondary" | "accent" | "muted" => {
  const normalized = String(value);
  if (normalized === "0") return "primary";
  if (normalized === "1") return "secondary";
  if (normalized === "0,1") return "accent";
  return "muted";
};

const MemberList = () => {
  const [memberList, setMemberList] = useState<MemberRow[] | null>(null);
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [position, setPosition] = useState<PhotoFilter>("All");
  const [globalWhatsappMessage, setGlobalWhatsappMessage] = useState("");
  const [pendingHoldId, setPendingHoldId] = useState<number | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");

  const { data: membersData, isLoading, error: membersError } = useMembersList();
  const holdMemberMutation = useHoldMember((heldId) => {
    setMemberList((prevMemberListData) =>
      (prevMemberListData ?? []).filter((member) => member.id !== heldId)
    );
  });
  const loading = isLoading || holdMemberMutation.isPending;

  useEffect(() => {
    if (!localStorage.getItem("page-no")) {
      localStorage.setItem("page-no", "1");
    }
  }, []);

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (membersData !== undefined) {
      setMemberList(membersData);
    }
  }, [membersData]);

  useEffect(() => {
    if (membersError) {
      console.error("Error fetching user list data", membersError);
    }
  }, [membersError]);

  const filteredData = useMemo(() => {
    if (!memberList) return [];
    if (position === "Photo") {
      return memberList.filter((member) => member.photo !== null);
    }
    if (position === "No photo") {
      return memberList.filter((member) => member.photo === null);
    }
    return memberList;
  }, [position, memberList]);

  const totalCount = memberList?.length ?? 0;
  const missingPhotoCount = useMemo(
    () => (memberList ?? []).filter((m) => m.photo === null).length,
    [memberList]
  );

  const whatsApp = (e: MouseEvent, value: string, userName: string) => {
    e.preventDefault();

    const phoneNumber = value;
    const code = "+91";
    const message = ` Dear ${userName}.
    \n
    Thank you for registering with us.
    \n
    We received your information but did not find your photo; please share your photo.
    \n
    Thanks and regards,\n
    Govind Garg\n
    AG Solutions`;
    const whatsappLink = `https://wa.me/${code}${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappLink, "_blank");
  };

  const handleChangeToHold = (e: MouseEvent, id: number) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    setPendingHoldId(id);
  };

  const confirmHold = () => {
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    if (pendingHoldId !== null) {
      holdMemberMutation.mutate(pendingHoldId);
    }
    setPendingHoldId(null);
  };

  const handleEdit = (e: MouseEvent, id: number) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam ?? "null");
    navigate(`/member-edit/${id}`);
  };

  const handleWhatsAppClick = (e: MouseEvent, mobile: string) => {
    e.stopPropagation();
    const encodedMessage = encodeURIComponent(globalWhatsappMessage);
    const whatsappUrl = `https://wa.me/+91${(mobile || "").replace(/\D/g, "")}?text=${encodedMessage}`;
    console.log("WhatsApp URL:", whatsappUrl);
    window.open(whatsappUrl, "_blank");
  };

  const columns: DataTableColumn<MemberRow>[] = [
    {
      key: "slNo",
      header: "SL No",
      align: "center",
      sortable: false,
      searchable: false,
      render: (_row, i) => <span className="text-on-surface-variant tabular-nums">{i + 1}</span>,
    },
    {
      key: "photo",
      header: "Image",
      align: "center",
      sortable: false,
      searchable: false,
      exportValue: (row) => row.photo ?? "",
      render: (row) => (
        <AvatarImage
          folder="user_images"
          file={row.photo}
          alt={row.name}
          size="sm"
          className="ring-1 ring-outline transition-shadow hover:shadow-md"
        />
      ),
    },
    {
      key: "name",
      header: "Full name",
      render: (row) => <span className="font-medium text-on-surface">{row.name}</span>,
    },
    {
      key: "company_name",
      header: "Company",
      render: (row) =>
        row.company_name ? (
          <span className="text-on-surface">{row.company_name}</span>
        ) : (
          <span className="text-on-surface-variant">—</span>
        ),
    },
    {
      key: "mobile",
      header: "Mobile",
      render: (row) => <span className="whitespace-nowrap tabular-nums">{row.mobile}</span>,
    },
    {
      key: "profile_type",
      header: "Profile",
      render: (row) => (
        <Badge variant={profileBadgeVariant(row.profile_type)} className="whitespace-nowrap">
          {profileTypeLabel(row.profile_type)}
        </Badge>
      ),
      exportValue: (row) => profileTypeLabel(row.profile_type),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      sortable: false,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "id",
      header: "Action",
      align: "center",
      sortable: false,
      searchable: false,
      render: (row) => (
        <div className="inline-flex items-center gap-0.5 rounded-lg border border-outline/70 bg-surface p-0.5 shadow-sm">
          {!row.photo && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => whatsApp(e, row.mobile, row.name)}
              title="Send WhatsApp Message"
              aria-label="Send WhatsApp Message"
              className="rounded-md hover:bg-emerald-50 hover:text-[#1da851] dark:hover:bg-emerald-950"
            >
              <FaWhatsapp className="size-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleEdit(e, row.id)}
            title="Edit Member Info"
            aria-label="Edit Member Info"
            className="rounded-md hover:bg-primary-container hover:text-on-primary-container"
          >
            <RiEditLine className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(`/member-view/${row.id}`)}
            title="View Member Info"
            aria-label="View Member Info"
            className="rounded-md"
          >
            <MdOutlineRemoveRedEye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleChangeToHold(e, row.id)}
            title="Hold"
            aria-label="Hold member"
            className="rounded-md text-error hover:bg-error-container hover:text-error"
          >
            <TbStatusChange className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleWhatsAppClick(e, row.mobile)}
            title="Open WhatsApp"
            aria-label="Open WhatsApp"
            className="rounded-md hover:bg-emerald-50 hover:text-[#1da851] dark:hover:bg-emerald-950"
          >
            <FiMessageCircle className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filterOptions: { value: PhotoFilter; icon: typeof Users; count?: number }[] = [
    { value: "All", icon: Users, count: totalCount },
    { value: "Photo", icon: Camera, count: totalCount - missingPhotoCount },
    { value: "No photo", icon: ImageOff, count: missingPhotoCount },
  ];

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="tablist"
        aria-label="Filter by photo"
        className="inline-flex items-center gap-0.5 rounded-lg border border-outline bg-surface-container-low p-1"
      >
        {filterOptions.map(({ value, icon: Icon }) => {
          const active = position === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setPosition(value)}
              className={cn(
                "relative inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-label-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:outline-[2px] focus-visible:outline-primary",
                active
                  ? "text-on-surface"
                  : "text-on-surface-variant hover:bg-surface hover:text-on-surface"
              )}
            >
              {active ? (
                <motion.span
                  layoutId="member-photo-filter-pill"
                  transition={{ type: "spring", stiffness: 450, damping: 34 }}
                  className="absolute inset-0 rounded-md bg-surface shadow-sm ring-1 ring-outline"
                />
              ) : null}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                <Icon className="size-3.5" aria-hidden />
                {value}
              </span>
            </button>
          );
        })}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <FiMessageCircle />
            Message
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-4">
          <div className="flex flex-col gap-2">
            <div>
              <h4 className="text-label-md font-semibold text-on-surface">Broadcast message</h4>
              <p className="mt-0.5 text-body-md text-on-surface-variant">
                Used by the WhatsApp action on each row.
              </p>
            </div>
            <Textarea
              placeholder="Type your WhatsApp message..."
              className="min-h-[100px]"
              value={globalWhatsappMessage}
              onChange={(e) => setGlobalWhatsappMessage(e.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Businesses"
          description={
            memberList === null
              ? "Loading registered businesses…"
              : `${totalCount} ${totalCount === 1 ? "business" : "businesses"} registered · ${missingPhotoCount} missing ${missingPhotoCount === 1 ? "photo" : "photos"}`
          }
          actions={
            memberList !== null && missingPhotoCount > 0 ? (
              <Badge variant="accent" className="tabular-nums">
                {missingPhotoCount} need {missingPhotoCount === 1 ? "photo" : "photos"}
              </Badge>
            ) : undefined
          }
        />
        {loading && memberList === null ? (
          <TableSkeleton />
        ) : (
          <DataTable
            title={`All businesses · ${filteredData.length} shown`}
            description="Search, sort and manage every registered business from one place."
            data={filteredData}
            columns={columns}
            loading={loading}
            actions={toolbar}
            rowKey={(row) => row.id}
            initialPageSize={10}
            searchPlaceholder="Search by name, company or mobile…"
            disableDownload
            disablePrint
          />
        )}
        <ConfirmDialog
          open={pendingHoldId !== null}
          onOpenChange={(v) => !v && setPendingHoldId(null)}
          title="Hold member?"
          description="This member will be moved to the Hold list. You can activate them again from the Hold User page."
          confirmLabel="Hold"
          loading={holdMemberMutation.isPending}
          onConfirm={confirmHold}
        />
      </div>
    </Layout>
  );
};

export default MemberList;
