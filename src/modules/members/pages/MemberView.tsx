import { useEffect, useRef, useState } from "react";
import type { ReactInstance, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, Info, Phone, Printer } from "lucide-react";
import ReactToPrint from "react-to-print";
import Layout from "@/components/layout/Layout";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarImage } from "@/components/common/AvatarImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { useAppContext } from "@/context/app-context";
import { useMemberDetail } from "../hooks/useMemberDetail";
import type { MemberCategory, MemberRow, MemberSubCategory } from "../types/member";

const profileTypeLabel = (value: MemberRow["profile_type"] | undefined): string => {
  if (value == 0) return "Business";
  if (value == 1) return "Service";
  return "Business/Service";
};

function InfoRows({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-outline">
      {rows.map((item) => (
        <div key={item.label} className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3 sm:grid-cols-[180px_1fr]">
          <dt className="text-label-sm font-medium text-on-surface-variant">{item.label}</dt>
          <dd className="min-w-0 text-body-md text-on-surface wrap-break-word">
            {item.value == null || item.value === "" ? (
              <span className="text-on-surface-variant">—</span>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const MemberView = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const [profile, setProfile] = useState<Partial<MemberRow>>({});
  const [profileCategory, setProfileCategory] = useState<MemberCategory[]>([]);
  const [profileSubCategory, setProfileSubCategory] = useState<MemberSubCategory[]>([]);

  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();

  const { data: profileData, isLoading, error: profileError } = useMemberDetail(id);

  useEffect(() => {
    if (!isPanelUp) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  useEffect(() => {
    if (profileData === undefined) return;
    setProfile(profileData?.user);
    setProfileCategory(profileData?.categories);
    setProfileSubCategory(profileData?.subcategories);
    console.log("sub category ", profileData?.subcategories);
  }, [profileData]);

  useEffect(() => {
    if (profileError) {
      console.error("Error fetching Profile list data", profileError);
    }
  }, [profileError]);

  const contactRows = [
    { label: "Company", value: profile.company_name },
    { label: "Mobile", value: profile.mobile },
    { label: "WhatsApp", value: profile.whatsapp },
    { label: "Email", value: profile.email },
    { label: "Website", value: profile.website },
  ];

  const identityRows: { label: string; value: ReactNode }[] = [
    { label: "Business Profile", value: profileTypeLabel(profile.profile_type) },
    {
      label: "Business Category",
      value:
        profileCategory.length > 0
          ? profileCategory.map((item) => <p key={item.id}>{item.category}</p>)
          : "—",
    },
    {
      label: "Sub Category",
      value:
        profileSubCategory.length > 0
          ? profileSubCategory.map((item) => <p key={item.id}>{item.subcategory}</p>)
          : "—",
    },
    { label: "Area", value: profile.area },
    { label: "Referral Code", value: profile.referral_code },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Business Profile"
          description="Contact, identification and business information for this member."
          backTo="/member-list"
          actions={
            <ReactToPrint
              trigger={() => (
                <Button size="sm">
                  <Printer />
                  <span>Print</span>
                </Button>
              )}
              content={() => componentRef.current as unknown as ReactInstance}
            />
          }
        />

        {isLoading ? (
          <div className="rounded-xl border border-outline bg-surface-container-lowest shadow-md">
            <Spinner className="py-16" />
          </div>
        ) : (
          <div ref={componentRef} className="flex flex-col gap-4 md:gap-5">
            <Card className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <AvatarImage
                  folder="user_images"
                  file={profile.photo}
                  alt={profile.name ?? "Member"}
                  size="xl"
                  className="ring-2 ring-primary-container"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-label-sm font-medium tracking-wide text-on-surface-variant uppercase">
                    {profile.status ?? "Member"}
                  </p>
                  <h2 className="mt-0.5 truncate text-headline-md font-semibold tracking-tight">
                    {profile.name ?? "—"}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="primary">{profileTypeLabel(profile.profile_type)}</Badge>
                    <StatusBadge status={profile.status} inactiveVariant="secondary" />
                    {profile.company_name ? (
                      <Badge variant="muted">{profile.company_name}</Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-2">
              <Card className="overflow-hidden p-0">
                <CardHeader className="px-4 pt-4 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                      <Phone className="size-4" aria-hidden />
                    </span>
                    <div>
                      <CardTitle className="text-title-lg">Contact Information</CardTitle>
                      <CardDescription>How to reach this business.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 pb-1">
                  <InfoRows rows={contactRows} />
                </CardContent>
              </Card>

              <Card className="overflow-hidden p-0">
                <CardHeader className="px-4 pt-4 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
                      <Building2 className="size-4" aria-hidden />
                    </span>
                    <div>
                      <CardTitle className="text-title-lg">Business Details</CardTitle>
                      <CardDescription>Profile, categories and location.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 pb-1">
                  <InfoRows rows={identityRows} />
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden p-0">
              <CardHeader className="px-4 pt-4 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-tertiary-container text-on-tertiary-container">
                    <Info className="size-4" aria-hidden />
                  </span>
                  <div>
                    <CardTitle className="text-title-lg">About the Business</CardTitle>
                    <CardDescription>In their own words.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-5">
                <p className="text-body-lg leading-relaxed text-on-surface">
                  {profile.about_us || <span className="text-on-surface-variant">—</span>}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MemberView;
