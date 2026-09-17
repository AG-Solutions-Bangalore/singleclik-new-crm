import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Tag } from "lucide-react";
import { MdArrowBack, MdSend } from "react-icons/md";
import { toast } from "react-toastify";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Edit Member"
          description="Update member personal details, profile and photo."
          backTo={`/member-list?page=${pageNo}`}
          actions={
            <Link to={`/category-view/${id}`}>
              <Button variant="secondary">
                <Tag />
                Category
              </Button>
            </Link>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="memberId" autoComplete="off" onSubmit={onSubmit}>
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-2">
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
                </div>

                <div className="flex flex-col gap-2">
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
                </div>

                <div className="flex flex-col gap-2">
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
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-2">
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
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="member-whatsapp">
                    Whats App <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="member-whatsapp"
                    type="text"
                    maxLength={10}
                    minLength={10}
                    name="whatsapp"
                    value={member.whatsapp}
                    onChange={(e) => onInputChange(e)}
                    placeholder="Whats App"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="member-website">Website</Label>
                  <Input
                    id="member-website"
                    type="text"
                    name="website"
                    value={member.website}
                    onChange={(e) => onInputChange(e)}
                    placeholder="Website"
                  />
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
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
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="member-area">Area</Label>
                  <Input
                    id="member-area"
                    type="text"
                    name="area"
                    value={member.area}
                    onChange={(e) => onInputChange(e)}
                    placeholder="Area"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Photo</Label>
                  <div className="flex min-h-10 items-center justify-between gap-3 rounded-default border border-outline bg-surface-container-low px-3 py-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl.current}
                        alt="Avatar"
                        className="h-10 w-10 rounded-lg border-2 border-outline"
                      />
                      <button
                        type="button"
                        className="cursor-pointer rounded-default border border-outline bg-surface px-3 py-1.5 text-label-sm text-on-surface transition-colors hover:bg-surface-container-low"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalOpen(true);
                        }}
                      >
                        Choose Image
                      </button>
                      <small className="text-[10px] text-on-surface-variant">
                        {member.photo}
                      </small>
                    </div>

                    {modalOpen && (
                      <Modal
                        onFileChange={(file) => setSelectedFile1(file)}
                        updateAvatar={updateAvatar}
                        closeModal={() => setModalOpen(false)}
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
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
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="member-about">
                    About Your Buisness <span className="text-error">*</span>
                  </Label>
                  <Textarea
                    id="member-about"
                    name="about_us"
                    value={member.about_us}
                    onChange={(e) => onInputChange(e)}
                    placeholder="About Your Buisness"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-2">
                <Button
                  type="submit"
                  onClick={onSubmit}
                  disabled={updateMemberMutation.isPending}
                >
                  <MdSend className="size-4" />
                  <span>{updateMemberMutation.isPending ? "Updating..." : "Update"}</span>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                >
                  <MdArrowBack className="size-4" />
                  <span>Back</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MemberEdit;
