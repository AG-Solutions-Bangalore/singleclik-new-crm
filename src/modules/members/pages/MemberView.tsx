import { useEffect, useRef, useState } from "react";
import type { ReactInstance, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Printer } from "lucide-react";
import ReactToPrint from "react-to-print";
import Layout from "@/components/layout/Layout";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarImage } from "@/components/common/AvatarImage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Profile Details"
          description="Member contact, identification and business information."
          backTo="/member-list"
          actions={
            <ReactToPrint
              trigger={() => (
                <button
                  type="button"
                  className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-1.5 font-medium text-on-primary transition-colors duration-200 outline-none hover:bg-primary-hover focus-visible:outline-[3px] focus-visible:outline-primary-container active:bg-primary-active"
                >
                  <Printer className="size-4" />
                  <span>Print</span>
                </button>
              )}
              content={() => componentRef.current as unknown as ReactInstance}
            />
          }
        />

        {isLoading ? (
          <div className="rounded-lg border border-outline bg-surface-container-lowest shadow-md">
            <Spinner className="py-16" />
          </div>
        ) : (
          <Card>
            <div ref={componentRef} className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="border-b border-dashed border-outline-variant pb-2 text-headline-md font-semibold">
                    {profile.name} - {profile.status}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="primary">{profileTypeLabel(profile.profile_type)}</Badge>
                    <StatusBadge status={profile.status} inactiveVariant="secondary" />
                  </div>
                </div>
                <AvatarImage
                  folder="user_images"
                  file={profile.photo}
                  alt={profile.name ?? "Member"}
                  size="lg"
                  className="border-2 border-tertiary"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="p-0">
                  <CardHeader className="rounded-t-lg bg-primary-container p-3 pb-3">
                    <CardTitle className="text-on-primary-container">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <tbody>
                        {contactRows.map((item, index) => (
                          <tr key={index} className="border-b border-outline last:border-b-0">
                            <th className="bg-surface-container-low p-3 text-left">
                              {item.label}
                            </th>
                            <td className="p-3">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                <Card className="p-0">
                  <CardHeader className="rounded-t-lg bg-secondary-container p-3 pb-3">
                    <CardTitle className="text-on-secondary-container">
                      Identification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <tbody>
                        {identityRows.map((item, index) => (
                          <tr key={index} className="border-b border-outline last:border-b-0">
                            <th className="bg-surface-container-low p-3 text-left">
                              {item.label}
                            </th>
                            <td className="p-3">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              <Card className="p-0">
                <CardHeader className="rounded-t-lg bg-tertiary-container p-3 pb-3">
                  <CardTitle className="text-on-tertiary-container">
                    About Your Business
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="p-3">{profile.about_us}</p>
                </CardContent>
              </Card>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MemberView;
