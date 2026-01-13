
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useGetCompanyInfoAllQuery,
  useUpdateCompanyMutation,
} from "@/components/store/api/company/companyApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
];
const WhyKry = () => {
  
  const { toast } = useToast();
  const { data: companyData, isLoading: isFetching } =
    useGetCompanyInfoAllQuery({});

  const [addWhyKry, { isLoading, error }] = useUpdateCompanyMutation();

  const { handleSubmit, setValue, watch } = useForm();
  useEffect(() => {
    if (companyData?.data?.length > 0) {
      setValue("whyKry", companyData?.data[0].whyKry);
    }
  }, [companyData?.data, setValue]);
  const handleSaveWhyKry = async (data: any) => {
    try {
      await addWhyKry({ id: companyData?.data[0]?.id, data: data }).unwrap();

      toast({
        title: "Success",
        description: "Why Kry added successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving WhyKry:", error);
      toast({
        title: "Error",
        description: "Failed to save WhyKry. Please try again.",
        variant: "destructive",
      });
    }
  };
  if (isFetching) return <LoaderSpinner />;
  return (
    <form onSubmit={handleSubmit(handleSaveWhyKry)}>
      <SectionWrapper>
        <div className="mt-10">
          <label htmlFor="" className="mb-3 text-3xl block">
            Why Kry?
          </label>
          <ReactQuill
            className="custom-editor"
            formats={formats}
            modules={modules}
            value={watch("whyKry")}
            onChange={(data) => {
              setValue("whyKry", data);
            }}
            placeholder="Write your content..."
          />
        </div>
      </SectionWrapper>

      <div className="flex justify-end my-5">
        <Button type="submit" variant={"default"} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>

      {error && "data" in error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Why Kry Error</AlertTitle>
          <AlertDescription>
            {(error.data as { message?: string })?.message ||
              "Something went wrong! Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default WhyKry;
