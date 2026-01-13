import InputWrapper from "@/components/common/wrapper/InputWrapper";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
// import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { useToast } from "@/components/ui/use-toast";
import Input from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";
import {
  addEditPageSchema,
  PageFormData,
} from "@/schemas/pages/addEditPagesSchema";
import TextArea from "@/components/ui/text-area";
import { useAddPageMutation } from "@/components/store/api/pages/pageApi";
import TipTapEditor from "../products/TipTapEditor";

const AddPages = () => {
  //   const [uploadedImage, setUploadedImage] = useState<File | undefined>(
  //     undefined
  //   );
  //   const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  //   const [addThumbnail, { isLoading: uploadLoading }] =
  //     useAddThumbnailMutation();
  const [addPage, { isLoading, error }] = useAddPageMutation();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    setError,
    control
  } = useForm<PageFormData>({
    resolver: yupResolver(addEditPageSchema),
  });

  //   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const selectedFile = e.target.files?.[0];
  //     if (selectedFile) {
  //       setUploadedImage(selectedFile);
  //       setPreview(URL.createObjectURL(selectedFile));
  //     }
  //   };

  const handleAddPage = async (data: PageFormData) => {
    // let imageUrl = null;

    // if (uploadedImage) {
    //   const formData = new FormData();
    //   formData.append("image", uploadedImage);
    //   try {
    //     const response = await addThumbnail(formData).unwrap();
    //     imageUrl = response?.data[0];
    //   } catch (error) {
    //     console.error("Error uploading avatar:", error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to upload avatar. Please try again.",
    //       variant: "destructive",
    //     });
    //     return;
    //   }
    // }

    // console.log(imageUrl);
    const dataWithAvater = {
      ...data,
    };

    const updateData = removeFalsyValuesProperties(dataWithAvater, [
      "seoTitle",
      "seoDescription",
    ]);
    const result = await addPage(updateData);
    if (result?.data?.success) {
      toast({
        title: "Add Page Message",
        description: toastMessageGenerator("add", "page"),
      });

      navigate(`/kry-admin-portal/page-list`);
      reset();
    }
  };

  return (
    <PageWrapper className="bg-white shadow-lg p-4 rounded-md overflow-hidden">
      <form onSubmit={handleSubmit(handleAddPage)} className="overflow-hidden">
        <SectionWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
          <InputWrapper
            label={"Select a Status"}
            labelFor="page-status"
            error={errors?.status?.message}
          >
            <Select
              value={watch("status")}
              onValueChange={(value: "Draft" | "Trust" | "Published") => {
                setValue("status", value);
                setError("status", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="page-status">
                <SelectValue placeholder={"Select a type..."} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Trust">Trash</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* User Name Field */}
          <InputWrapper
            label={"Title ✽"}
            labelFor="title"
            error={errors?.title?.message}
          >
            <Input
              placeholder={"Enter title"}
              value={watch("title") || ""}
              onChange={(e) => setValue("title", e.target.value)}
              errorMessage={errors.title?.message}
            />
          </InputWrapper>

          {/* Email Field */}
          <InputWrapper
            label={"Slug ✽"}
            labelFor="slug"
            error={errors?.slug?.message}
          >
            <Input
              placeholder={"Enter slug"}
              value={watch("slug") || ""}
              onChange={(e) => setValue("slug", e.target.value)}
              errorMessage={errors.slug?.message}
            />
          </InputWrapper>

          {/* Contact No Field */}
          <InputWrapper
            label={"SEO Title"}
            labelFor="seoTitle"
            error={errors?.seoTitle?.message}
          >
            <Input
              placeholder={"Enter contact number"}
              value={watch("seoTitle") || ""}
              onChange={(e) => setValue("seoTitle", e.target.value)}
              errorMessage={errors.seoTitle?.message}
            />
          </InputWrapper>
        </SectionWrapper>
        <SectionWrapper className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <InputWrapper
            label={"SEO Description"}
            labelFor="seoDescription"
            error={errors?.seoDescription?.message}
          >
            <TextArea
              currentValue={watch("seoDescription") || ""}
              onChange={(e) => setValue("seoDescription", e.target.value)}
              errorMessage={errors.seoDescription?.message}
              placeHolder="Enter SEO description"
            />
          </InputWrapper>

          {/* Avatar */}
          {/* <div>
            <InputWrapper label={"Upload Image"}>
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
                    setUploadedImage(undefined); 
                  }}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}
          </div> */}
        </SectionWrapper>
        <div className="mt-10">
          <p className="block  text-3xl ml-5">Content</p>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TipTapEditor content={field.value} onUpdate={field.onChange} />
            )}
          />
        </div>

        {/* Form Submission */}
        <div className="flex justify-end my-5">
          <div className="flex justify-between items-center gap-2">
            {error && "data" in error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Add page error</AlertTitle>
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
              {isLoading && <ButtonLoader />}
              Submit
            </button>
          </div>
        </div>
      </form>
    </PageWrapper>
  );
};

export default AddPages;
