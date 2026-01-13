import InputWrapper from "@/components/common/wrapper/InputWrapper";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { useToast } from "@/components/ui/use-toast";
import Input from "@/components/ui/input";
import {
  addEditUserSchema,
  UserFormData,
} from "@/schemas/user/addEditUserSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, LucideEye, LucideEyeOff, XCircle } from "lucide-react";
import { useCreateUserMutation } from "@/components/store/api/user/userApi";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";

const AddAdminManagementUser = () => {
  const [uploadedImage, setUploadedImage] = useState<File | undefined>(
    undefined
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [altText, setAltText] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addThumbnail, { isLoading: uploadLoading }] =
    useAddThumbnailMutation();
  const [addUser, { isLoading, error }] = useCreateUserMutation();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<UserFormData>({
    resolver: yupResolver(addEditUserSchema),
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleAddUser = async (data: UserFormData) => {
    let imageUrl = null;

    // If an avatar image is selected, upload the image and get its URL
    if (uploadedImage) {
      const formData = new FormData(); //alt
      formData.append("image", uploadedImage);
      if (altText) {
        formData.append("alt", altText);
      }
      try {
        const response = await addThumbnail(formData).unwrap();
        imageUrl = response?.data[0]; // Assuming the response contains the image URL at data[0]
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast({
          title: "Error",
          description: "Failed to upload avatar. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    const dataWithAvater = {
      ...data,
      avatar: imageUrl,
    };

    const updateData = removeFalsyValuesProperties(dataWithAvater, [
      "contactNo",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "bloodGroup",
      "address",
      "avatar", //
      "active",
    ]);
    const result = await addUser(updateData);
    if (result?.data?.success) {
      toast({
        title: "Add User Message",
        description: toastMessageGenerator("add", "user"),
      });

      navigate(`/kry-admin-portal/user-list`);
      reset(); // Reset the form fields after successful submission
    }
  };

  return (
    <PageWrapper className="bg-white shadow-lg p-4 rounded-md overflow-hidden">
      <form onSubmit={handleSubmit(handleAddUser)} className="overflow-hidden">
        <SectionWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border border-primary p-4 rounded-md">
          {/* User Name Field */}
          <InputWrapper
            label={"Name ✽"}
            labelFor="user_name"
            error={errors?.name?.message}
          >
            <Input
              placeholder={"Enter user name"}
              value={watch("name") || ""}
              onChange={(e) => setValue("name", e.target.value)}
              errorMessage={errors.name?.message}
            />
          </InputWrapper>

          {/* Email Field */}
          <InputWrapper
            label={"Email ✽"}
            labelFor="email"
            error={errors?.email?.message}
          >
            <Input
              placeholder={"Enter email"}
              value={watch("email") || ""}
              onChange={(e) => setValue("email", e.target.value)}
              errorMessage={errors.email?.message}
            />
          </InputWrapper>

          {/* Password Field */}
          <InputWrapper
            label={"Password ✽"}
            labelFor="password"
            error={errors?.password?.message}
          >
            <div className="relative">
              <Input
                type={visible ? "text" : "password"}
                placeholder="Write your password"
                value={watch("password") || ""}
                onChange={(e) => setValue("password", e.target.value)}
              />

              <button
                type="button"
                className="text-lg absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer whitespace-nowrap rounded-md p-1 hover:bg-accent"
                onClick={() => setVisible(!visible)}
              >
                {visible ? (
                  <LucideEye className="h-5 w-5" />
                ) : (
                  <LucideEyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </InputWrapper>

          {/* Contact No Field */}
          <InputWrapper
            label={"Contact Number"}
            labelFor="contactNo"
            error={errors?.contactNo?.message}
          >
            <Input
              placeholder={"Enter contact number"}
              value={watch("contactNo") || ""}
              onChange={(e) => setValue("contactNo", e.target.value)}
              errorMessage={errors.contactNo?.message}
            />
          </InputWrapper>

          {/* Role Selection Field */}
          <InputWrapper
            label={"Role ✽"}
            labelFor="role"
            error={errors?.role?.message}
          >
            <Select
              value={watch("role")}
              onValueChange={(
                value:
                  | "SUPER_ADMIN"
                  | "OPERATION_ADMIN"
              ) => {
                setValue("role", value);
              }}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder={"Select a role..."} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
                <SelectItem value="OPERATION_ADMIN">OPERATION_ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Date of Birth */}
          <InputWrapper
            label={"Date of Birth"}
            labelFor="dateOfBirth"
            error={errors?.dateOfBirth?.message}
          >
            <Input
              placeholder={"Enter date of birth"}
              value={watch("dateOfBirth") || ""}
              onChange={(e) => setValue("dateOfBirth", e.target.value)}
              errorMessage={errors.dateOfBirth?.message}
              type="date"
            />
          </InputWrapper>

          {/* Gender Select Field */}
          <InputWrapper
            label={"Select Gender"}
            labelFor="gender"
            error={errors?.gender?.message}
          >
            <Select
              value={watch("gender")}
              onValueChange={(value: "Male" | "Female" | "Others") => {
                setValue("gender", value);
              }}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder={"Select a gender..."} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Marital Status */}
          <InputWrapper
            label={"Marital Status"}
            labelFor="maritalStatus"
            error={errors?.maritalStatus?.message}
          >
            <Select
              value={watch("maritalStatus")}
              onValueChange={(value: "Married" | "Unmarried" | "Divorce") => {
                setValue("maritalStatus", value);
              }}
            >
              <SelectTrigger id="maritalStatus">
                <SelectValue placeholder={"Select marital status..."} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Unmarried">Unmarried</SelectItem>
                <SelectItem value="Divorce">Divorce</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Blood Group */}
          <InputWrapper
            label={"Blood Group"}
            labelFor="bloodGroup"
            error={errors?.bloodGroup?.message}
          >
            <Input
              placeholder={"Enter blood group"}
              value={watch("bloodGroup") || ""}
              onChange={(e) => setValue("bloodGroup", e.target.value)}
              errorMessage={errors.bloodGroup?.message}
            />
          </InputWrapper>

          {/* Address */}
          <InputWrapper
            label={"Address"}
            labelFor="address"
            error={errors?.address?.message}
          >
            <Input
              placeholder={"Enter address"}
              value={watch("address") || ""}
              onChange={(e) => setValue("address", e.target.value)}
              errorMessage={errors.address?.message}
            />
          </InputWrapper>
          {/* Active Dropdown */}
          <InputWrapper
            label={"Active"}
            labelFor="active"
            error={errors?.active?.message}
          >
            <Select
              value={watch("active")?.toString()}
              onValueChange={(value: "true" | "false") => {
                setValue("active", value === "true");
              }}
            >
              <SelectTrigger id="active">
                <SelectValue placeholder={"Select active status..."} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* Avatar */}
          <div>
            <InputWrapper label={"Upload Avatar"}>
              <div className="border-2 border-dashed rounded-md py-3 px-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                />
              </div>
            </InputWrapper>

            {/* Preview of Uploaded Avatar */}
            {preview && (
              <div className="mt-4 flex items-center gap-4">
              <div className="relative w-20 h-20 border rounded-md overflow-hidden mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={() => {
                    setPreview(null);
                    setUploadedImage(undefined); // Reset image when removed
                  }}
                >
                  <XCircle className="w-5 h-5" />
                </button>
                
              </div>
              <div className="flex-1">
                  <Input
                    placeholder="Enter alt text for image"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                  />
                </div>
            </div>
            )}
          </div>
        </SectionWrapper>

        {/* Form Submission */}
        <div className="flex justify-end my-5">
          <div className="flex justify-between items-center gap-2">
            {error && "data" in error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Add user error</AlertTitle>
                <AlertDescription>
                  {(error.data as { message?: string })?.message ||
                    "Something went wrong! Please try again."}
                </AlertDescription>
              </Alert>
            )}
            <button
              type="submit"
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
              {isLoading || (uploadLoading && <ButtonLoader />)}
              Submit
            </button>
          </div>
        </div>
      </form>
    </PageWrapper>
  );
};

export default AddAdminManagementUser;
