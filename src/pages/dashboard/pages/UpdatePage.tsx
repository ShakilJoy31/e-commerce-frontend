import InputWrapper from "@/components/common/wrapper/InputWrapper";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
// import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { useToast } from "@/components/ui/use-toast";
import Input from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
import { useGetSinglePageQuery, useUpdatePageMutation } from "@/components/store/api/pages/pageApi";
import TipTapEditor from "../products/TipTapEditor";
import LoaderSpinner from "@/components/loader/LoaderSpinner";



const UpdatePage = () => {
  const {id}=useParams()
//   const [uploadedImage, setUploadedImage] = useState<File | undefined>(
//     undefined
//   );
//   const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
//   const [addThumbnail, { isLoading: uploadLoading }] =
//     useAddThumbnailMutation();
const {data:singlePage, isLoading:singlepageLoading}=useGetSinglePageQuery(id)
  const [updatePage, { isLoading, error }] = useUpdatePageMutation();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    control,
    reset
  } = useForm<PageFormData>({
    resolver: yupResolver(addEditPageSchema),
   
  });

  // Initialize form with current page data
    useEffect(() => {
    if (singlePage?.data) {
      reset({
        title: singlePage.data.title,
        slug: singlePage.data.slug,
        content: singlePage.data.content,
        seoTitle: singlePage.data.seoTitle || "",
        seoDescription: singlePage.data.seoDescription || "",
        status: singlePage.data.status
      });
    }
  }, [singlePage?.data, reset]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       setUploadedImage(selectedFile);
//       setPreview(URL.createObjectURL(selectedFile));
//     }
//   };

  const handleUpdatePage = async (data: PageFormData) => {
    // let imageUrl = null;

    // if (uploadedImage) {
    //   const formData = new FormData();
    //   formData.append("image", uploadedImage);
    //   try {
    //     const response = await addThumbnail(formData).unwrap();
    //     imageUrl = response?.data[0];
    //   } catch (error) {
    //     console.error("Error uploading image:", error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to upload image. Please try again.",
    //       variant: "destructive",
    //     });
    //     return;
    //   }
    // }

    // console.log(imageUrl);
    const cleanData = removeFalsyValuesProperties(data, [
      "seoTitle",
      "seoDescription",
    ]);
    const updateData = {
      id: singlePage?.data?.id,
      data: cleanData,
    };

    try {
      const result = await updatePage(updateData).unwrap();
      if (result?.success) {
        toast({
          title: "Success",
          description: toastMessageGenerator("update", "page"),
        });
        navigate(`/kry-admin-portal/page-list`);
      }
    } catch (err) {
      console.error("Error updating page:", err);
    }
  };


  if(singlepageLoading){
    return <LoaderSpinner/>
  }
  return (
    <PageWrapper className="bg-white shadow-lg p-4 rounded-md overflow-hidden">
      <form
        onSubmit={handleSubmit(handleUpdatePage)}
        className="overflow-hidden"
      >
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
                <SelectValue placeholder={"Select status..."} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Trust">Trash</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

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

          <InputWrapper
            label={"SEO Title"}
            labelFor="seoTitle"
            error={errors?.seoTitle?.message}
          >
            <Input
              placeholder={"Enter SEO title"}
              value={watch("seoTitle") || ""}
              onChange={(e) => setValue("seoTitle", e.target.value)}
              errorMessage={errors.seoTitle?.message}
            />
          </InputWrapper>
        </SectionWrapper>
        <SectionWrapper className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            defaultValue={singlePage?.data?.content || ""}
            render={({ field }) => (
              <TipTapEditor content={field.value} onUpdate={field.onChange} key={singlePage?.data?.id}/>
            )}
          />
        </div>

        <div className="flex justify-end my-5">
          <div className="flex justify-between items-center gap-2">
            {error && "data" in error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Update page error</AlertTitle>
                <AlertDescription>
                  {(error.data as { message?: string })?.message ||
                    "Something went wrong! Please try again."}
                </AlertDescription>
              </Alert>
            )}
            <button
              type="submit"
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              disabled={isLoading }
            >
              {isLoading  && <ButtonLoader />}
              Update Page
            </button>
          </div>
        </div>
      </form>
    </PageWrapper>
  );
};

export default UpdatePage;
