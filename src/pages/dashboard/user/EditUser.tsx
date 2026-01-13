import InputWrapper from "@/components/common/wrapper/InputWrapper";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { useToast } from "@/components/ui/use-toast";
import Input from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, XCircle } from "lucide-react";
import {
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "@/components/store/api/user/userApi";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ButtonLoader from "@/components/loader/ButtonLoader";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  EditUserFormData,
  editUserSchema,
} from "@/schemas/user/editUserSchema";

const EditUser = () => {
  const { id } = useParams();
  const [uploadedImage, setUploadedImage] = useState<File | undefined>(
    undefined
  );
  const [fileAttachment, setFileAttachment] = useState<File | undefined>(
    undefined
  );
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addThumbnail, { isLoading: uploadLoading }] =
    useAddThumbnailMutation();
  const [editUser, { isLoading, error }] = useUpdateUserMutation();
  const { data: singleUser, isLoading: singleUserLoading } =
    useGetSingleUserQuery(id);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<EditUserFormData>({
    resolver: yupResolver(editUserSchema),
  });

  // Set default values when singleUser data is loaded
  useEffect(() => {
    if (singleUser?.data) {
      setValue("name", singleUser?.data.name);
      setValue("email", singleUser?.data.email);
      setValue("contactNo", singleUser?.data.contactNo);
      setValue("role", singleUser?.data.role);
      setValue("password", singleUser?.data.password);
      setValue("gender", singleUser?.data.gender);
      setValue("maritalStatus", singleUser?.data.maritalStatus);
      setValue("bloodGroup", singleUser?.data.bloodGroup);
      setValue("address", singleUser?.data.address);
      setValue("dateOfBirth", singleUser?.data.dateOfBirth);
      setValue("avatar", singleUser?.data.avatar);
      setValue("fileAttachment", singleUser?.data?.fileAttachment);
      setPreview(singleUser?.data.avatar);
      setValue("active", singleUser?.data?.active);
    }
  }, [singleUser, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleFileAttachmentUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFileAttachment(selectedFile);
    }
  };

const handleAddUser = async (data: EditUserFormData) => {
  // Keep existing avatar/file if no new upload
  let imageUrl = watch("avatar"); 
  let fileAttachmentUrl = watch("fileAttachment");

  // Upload new avatar if provided
  if (uploadedImage) {
    const formData = new FormData();
    formData.append("image", uploadedImage);
    try {
      const response = await addThumbnail(formData).unwrap();
      imageUrl = response?.data[0];
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

  // Upload new file attachment if provided
  if (fileAttachment) {
    const attachmentFormData = new FormData();
    attachmentFormData.append("image", fileAttachment);
    try {
      const response = await addThumbnail(attachmentFormData).unwrap();
      fileAttachmentUrl = response?.data[0];
    } catch (error) {
      console.error("Error uploading file attachment:", error);
      toast({
        title: "Error",
        description: "Failed to upload file attachment. Please try again.",
        variant: "destructive",
      });
      return;
    }
  }

  // Prepare data for submission
  const submissionData = {
    ...data,
    // Convert empty strings to null for optional fields
    contactNo: data.contactNo === "" ? null : data.contactNo,
    address: data.address === "" ? null : data.address,
    bloodGroup: data.bloodGroup === "" ? null : data.bloodGroup,
    dateOfBirth: data.dateOfBirth === "" ? null : data.dateOfBirth,
    avatar: imageUrl,
    fileAttachment: fileAttachmentUrl,
  };

  const cleanSubmissionData = (data: EditUserFormData): Partial<EditUserFormData> => {
  const cleanedData: Partial<EditUserFormData> = {};
  
  // List of fields that can be completely omitted when empty
  const optionalFields = [
    "contactNo",
    "dateOfBirth",
    "gender",
    "maritalStatus",
    "bloodGroup",
    "address",
    "fileAttachment",
    "avatar",
  ];

  Object.entries(data).forEach(([key, value]) => {
    // Always include required fields
    if (!optionalFields.includes(key)) {
      cleanedData[key] = value;
    }
    // Include optional fields only if they have a value
    else if (value !== null && value !== undefined && value !== "") {
      cleanedData[key] = value;
    }
  });

  return cleanedData;
};

  // Clean the data before submission
  const updateData = cleanSubmissionData(submissionData);

  try {
    const result = await editUser({ id: id, data: updateData });
    if (result?.data?.success) {
      toast({
        title: "User Updated",
        description: toastMessageGenerator("update", "user"),
      });
      navigate(`/kry-admin-portal/user-list`);
      reset();
    }
  } catch (error) {
    console.error("Error updating user:", error);
    toast({
      title: "Error",
      description: "Failed to update user. Please try again.",
      variant: "destructive",
    });
  }
};

  if (singleUserLoading) {
    return <LoaderSpinner />;
  }

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
                  | "OPERATION_MANAGER"
                  | "SUPPORT_EXECUTIVE"
                  | "USER"
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
                <SelectItem value="OPERATION_MANAGER">
                  OPERATION_MANAGER
                </SelectItem>
                <SelectItem value="SUPPORT_EXECUTIVE">
                  SUPPORT_EXECUTIVE
                </SelectItem>
                <SelectItem value="USER">USER</SelectItem>
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
              value={watch("gender") || ""}
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
              value={watch("maritalStatus") || ""}
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
              value={watch("active") ? "true" : "false"} // Set active based on the boolean value
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
            )}
          </div>

          {/* File Attachment */}
          <InputWrapper label={"File Attachment"} labelFor="fileAttachment">
            <div className="border-2 border-dashed rounded-md py-3 px-3">
              <input
                type="file"
                accept="*/*" // Allows any file type to be uploaded
                onChange={handleFileAttachmentUpload}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />
            </div>
          </InputWrapper>

          {/* Preview of File Attachment */}
          {fileAttachment && (
            <div className="mt-2 text-sm text-gray-700">
              <p>File: {fileAttachment.name}</p>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                  setFileAttachment(undefined);
                }}
              >
                <XCircle className="w-5 h-5 inline" /> Remove
              </button>
            </div>
          )}
        </SectionWrapper>

        {/* Form Submission */}
        <div className="flex justify-end my-5">
          <div className="flex justify-between items-center gap-2">
            {error && "data" in error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Edit user error</AlertTitle>
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

export default EditUser;
