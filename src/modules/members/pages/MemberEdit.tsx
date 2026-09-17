import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ImagePlus, Tag } from "lucide-react";
import { MdArrowBack, MdSend } from "react-icons/md";
import toast from "react-hot-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMemberDetail } from "../hooks/useMemberDetail";
import { useMemberCategories, useSubCategoriesByValue } from "../hooks/useMemberCategories";
import { useUpdateMember } from "../hooks/useMemberMutations";
import type { MemberForm, SubCategoryOption } from "../types/member";
import Modal from "../components/image-cropper/Modal";

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const profileOptions = [
  { value: "0", label: "Business" },
  { value: "1", label: "Service" },
  { value: "0,1", label: "Business/Service" },
];

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

const MemberEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [member, setMember] = useState<MemberForm>({
    name: "",
    company_name: "",
    mobile: "",
    email: "",
    profile_type: "",
    category: "",
    sub_category: "",
    subcategory: "",
    other_category: "",
    other_sub_category: "",
    whatsapp: "",
    website: "",
    about_us: "",
    catg_id: "",
    area: "",
    photo: "",
    referred_by_code: "",
    status: "",
  });
  // Categories feed the (currently hidden) category selects; fetched for parity with the source.
  const [subcategories, setSubCategories] = useState<SubCategoryOption[]>([]);
  const [selectedFile1, setSelectedFile1] = useState<File | null>(null);
  const [selectedSubCategoryValue, setSelectedSubCategoryValue] = useState("");

  // for pagination
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo = storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  //

  const { error: categoriesError } = useMemberCategories();
  const { data: memberDetailData, error: memberDetailError } = useMemberDetail(id);
  const { data: subCategoriesData, error: subCategoriesError } =
    useSubCategoriesByValue(member.catg_id);
  const updateMemberMutation = useUpdateMember(id, () => {
    navigate(`/member-list?page=${pageNo}`);
  });
  const avatarUrl = useRef(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );
  const [modalOpen, setModalOpen] = useState(false);

  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
  };

  useEffect(() => {
    if (memberDetailData === undefined) return;
    if (memberDetailData?.user) {
      setMember(memberDetailData.user);
    } else {
      toast.error("No user data found");
      console.error("no user data found");

      navigate("/member-list");
    }
  }, [memberDetailData, navigate]);

  useEffect(() => {
    if (memberDetailError) {
      console.error("Error fetching user data:", memberDetailError);
    }
  }, [memberDetailError]);

  useEffect(() => {
    if (categoriesError) {
      console.error("Error fetching Categories:", categoriesError);
    }
  }, [categoriesError]);

  useEffect(() => {
    if (subCategoriesData !== undefined) {
      setSubCategories(subCategoriesData);
    }
  }, [subCategoriesData]);

  useEffect(() => {
    if (subCategoriesError) {
      console.error("Error fetching Sub Categories:", subCategoriesError);
    }
  }, [subCategoriesError]);

  const validateOnlyDigits = (inputtxt: string) => {
    const phoneno = /^\d+$/;
    return phoneno.test(inputtxt) || inputtxt.length === 0;
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (
      (name === "mobile" || name === "whatsapp") &&
      !validateOnlyDigits(value)
    ) {
      return;
    }
    setMember((prev) => ({ ...prev, [name]: value }) as MemberForm);

    if (name === "category") {
      setMember((prev) => ({ ...prev, catg_id: value, sub_category: "" }));
      setSelectedSubCategoryValue("");
    }
    if (name === "sub_category") {
      const selectedOption = subcategories.find((sub) => String(sub.id) === value);
      if (selectedOption) {
        setSelectedSubCategoryValue(selectedOption.subcategory);
      }
    }
  };

  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(`/member-list?page=${pageNo}`);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formEl = document.getElementById("memberId") as HTMLFormElement | null;
    const form = formEl?.checkValidity() ?? false;
    if (!form) {
      toast.error("Fill all required field");
      return;
    }
    if (String(member.profile_type ?? "") === "" || member.status === "") {
      toast.error("Fill all required field");
      return;
    }
    updateMemberMutation.mutate({
      member,
      selectedSubCategoryValue,
      file: selectedFile1,
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Edit Business"
          description="Update personal details, contact info, profile and photo."
          backTo={`/member-list?page=${pageNo}`}
          actions={
            <Link to={`/category-view/${id}`}>
              <Button variant="secondary" size="sm">
                <Tag />
                Categories
              </Button>
            </Link>
          }
        />

        <form id="memberId" autoComplete="off" onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Name, company and email address.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Field>
                  <Label htmlFor="member-name">
                    Full Name <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="member-name"
                    type="text"
                    required
                    name="name"
                    value={member.name}
                    onChange={onInputChange}
                    placeholder="Full Name"
                  />
                </Field>
                <Field>
                  <Label htmlFor="member-company">
                    Company <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="member-company"
                    type="text"
                    name="company_name"
                    value={member.company_name}
                    onChange={onInputChange}
                    placeholder="Company"
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="member-email">
                    Email <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="member-email"
                    type="email"
                    name="email"
                    value={member.email}
                    onChange={onInputChange}
                    placeholder="Email"
                    required
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Phone numbers and website.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Field>
                  <Label htmlFor="member-mobile">
                    Mobile No <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="member-mobile"
                    type="text"
                    name="mobile"
                    maxLength={10}
                    minLength={10}
                    value={member.mobile}
                    onChange={onInputChange}
                    placeholder="Mobile No"
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="member-whatsapp">
                    WhatsApp <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="member-whatsapp"
                    type="text"
                    maxLength={10}
                    minLength={10}
                    name="whatsapp"
                    value={member.whatsapp}
                    onChange={(e) => onInputChange(e)}
                    placeholder="WhatsApp"
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="member-website">Website</Label>
                  <Input
                    id="member-website"
                    type="text"
                    name="website"
                    value={member.website}
                    onChange={(e) => onInputChange(e)}
                    placeholder="https://example.com"
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile & Photo</CardTitle>
              <CardDescription>Business profile, area, photo and account status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Field>
                  <Label htmlFor="member-profile">
                    Business Profile <span className="text-error">*</span>
                  </Label>
                  <Select
                    value={String(member.profile_type ?? "")}
                    onValueChange={(value) =>
                      setMember((prev) => ({ ...prev, profile_type: value }))
                    }
                    required
                  >
                    <SelectTrigger id="member-profile">
                      <SelectValue placeholder="Select Business Profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {profileOptions.map((data) => (
                        <SelectItem key={data.value} value={data.value}>
                          {data.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <Label htmlFor="member-area">Area</Label>
                  <Input
                    id="member-area"
                    type="text"
                    name="area"
                    value={member.area}
                    onChange={(e) => onInputChange(e)}
                    placeholder="Area"
                  />
                </Field>
                <Field>
                  <Label htmlFor="member-status">
                    Status <span className="text-error">*</span>
                  </Label>
                  <Select
                    value={member.status}
                    onValueChange={(value) =>
                      setMember((prev) => ({ ...prev, status: value }))
                    }
                    required
                  >
                    <SelectTrigger id="member-status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((data) => (
                        <SelectItem key={data.value} value={data.value}>
                          {data.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-xl border border-outline bg-surface-container-low p-4 sm:flex-row sm:items-center">
                <img
                  src={avatarUrl.current}
                  alt="Member photo preview"
                  className="size-16 shrink-0 rounded-xl border border-outline object-cover shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-label-md font-medium text-on-surface">Profile photo</p>
                  <p className="truncate text-body-md text-on-surface-variant">
                    {selectedFile1 ? selectedFile1.name : (member.photo || "No new photo chosen yet")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(true);
                  }}
                >
                  <ImagePlus />
                  Choose Image
                </Button>
                {modalOpen && (
                  <Modal
                    onFileChange={(file) => setSelectedFile1(file)}
                    updateAvatar={updateAvatar}
                    closeModal={() => setModalOpen(false)}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About the Business</CardTitle>
              <CardDescription>A short description shown on the profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <Field>
                <Label htmlFor="member-about">
                  About Your Business <span className="text-error">*</span>
                </Label>
                <Textarea
                  id="member-about"
                  name="about_us"
                  value={member.about_us}
                  onChange={(e) => onInputChange(e)}
                  placeholder="About Your Business"
                  required
                  rows={4}
                />
              </Field>
            </CardContent>
          </Card>

          <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={handleBack}>
              <MdArrowBack className="size-4" />
              <span>Back</span>
            </Button>
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={updateMemberMutation.isPending}
            >
              <MdSend className="size-4" />
              <span>{updateMemberMutation.isPending ? "Updating..." : "Update"}</span>
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default MemberEdit;
