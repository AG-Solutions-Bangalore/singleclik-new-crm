import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import { TbStatusChange } from "react-icons/tb";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/app-context";
import { AvatarImage } from "@/components/common/AvatarImage";
import { useHoldMember, useMembersList } from "../hooks/useMembersList";
import type { MemberRow } from "../types/member";

type PhotoFilter = "All" | "Photo" | "No photo";

const PHOTO_FILTERS: PhotoFilter[] = ["All", "Photo", "No photo"];

const profileTypeLabel = (value: MemberRow["profile_type"]): string => {
  const normalized = String(value);
  if (normalized === "0") return "Business";
  if (normalized === "1") return "Service";
  if (normalized === "0,1") return "Business/Service";
  return "Unknown";
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
      sortable: false,
      searchable: false,
      render: (_row, i) => i + 1,
    },
    {
      key: "photo",
      header: "Image",
      sortable: false,
      searchable: false,
      exportValue: (row) => row.photo ?? "",
      render: (row) => (
        <AvatarImage folder="user_images" file={row.photo} alt={row.name} size="sm" />
      ),
    },
    { key: "name", header: "Full name" },
    { key: "company_name", header: "Company" },
    { key: "mobile", header: "Mobile" },
    {
      key: "profile_type",
      header: "Profile",
      render: (row) => profileTypeLabel(row.profile_type),
      exportValue: (row) => profileTypeLabel(row.profile_type),
    },
    { key: "status", header: "Status", sortable: false },
    {
      key: "id",
      header: "Action",
      sortable: false,
      searchable: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          {!row.photo && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => whatsApp(e, row.mobile, row.name)}
              title="Send WhatsApp Message"
              aria-label="Send WhatsApp Message"
              className="hover:text-[#25d366]"
            >
              <FaWhatsapp className="size-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleEdit(e, row.id)}
            title="Edit Member Info"
            aria-label="Edit Member Info"
          >
            <RiEditLine className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(`/member-view/${row.id}`)}
            title="View Member Info"
            aria-label="View Member Info"
          >
            <MdOutlineRemoveRedEye className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleChangeToHold(e, row.id)}
            title="Hold"
            aria-label="Hold member"
            className="text-error hover:text-error"
          >
            <TbStatusChange className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => handleWhatsAppClick(e, row.mobile)}
            title="Open WhatsApp"
            aria-label="Open WhatsApp"
            className="hover:text-[#25d366]"
          >
            <FiMessageCircle className="size-5" />
          </Button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Add Message
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="flex flex-col gap-2">
            <h4 className="text-label-sm font-medium">WhatsApp Message</h4>
            <Textarea
              placeholder="Type your WhatsApp message..."
              className="min-h-[100px]"
              value={globalWhatsappMessage}
              onChange={(e) => setGlobalWhatsappMessage(e.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-3 rounded-default border border-outline px-3 py-1.5">
        <RadioGroup
          value={position}
          onValueChange={(value) => setPosition(value as PhotoFilter)}
          className="flex items-center gap-3"
        >
          {PHOTO_FILTERS.map((option) => (
            <span key={option} className="flex items-center gap-1.5">
              <RadioGroupItem value={option} id={`photo-filter-${option}`} />
              <Label htmlFor={`photo-filter-${option}`} className="cursor-pointer">
                {option}
              </Label>
            </span>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Member List"
          description={`All registered members with photo filter and WhatsApp actions · ${filteredData.length} shown`}
        />
        {loading && memberList === null ? (
          <TableSkeleton />
        ) : (
          <DataTable
            title="Member List"
            data={filteredData}
            columns={columns}
            loading={loading}
            actions={toolbar}
            rowKey={(row) => row.id}
            initialPageSize={10}
            searchPlaceholder="Search members…"
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
