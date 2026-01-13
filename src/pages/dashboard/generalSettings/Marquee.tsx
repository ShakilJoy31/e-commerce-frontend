
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useGetCompanyInfoAllQuery,
  useUpdateCompanyMutation,
} from "@/components/store/api/company/companyApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import TextArea from "@/components/ui/text-area";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const Marquee = () => {
  const { toast } = useToast();
  const { data: companyData, isLoading: isFetching } =
    useGetCompanyInfoAllQuery({});

  const [addMarquee, { isLoading, error }] = useUpdateCompanyMutation();

  const { handleSubmit, setValue, watch } = useForm();
  useEffect(() => {
    if (companyData?.data?.length > 0) {
      setValue("marqueeText", companyData?.data[0].marqueeText);
      setValue("isMarqueeShow", companyData?.data[0].isMarqueeShow);
    }
  }, [companyData?.data, setValue]);


  const handleSaveWhyKry = async (data: any) => {
    try {
      await addMarquee({ id: companyData?.data[0]?.id, data: data }).unwrap();

      toast({
        title: "Success",
        description: "Marquee update successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving marquee:", error);
      toast({
        title: "Error",
        description: "Failed to save marquee. Please try again.",
        variant: "destructive",
      });
    }
  };
  if (isFetching) return <LoaderSpinner />;
  return (
    <form onSubmit={handleSubmit(handleSaveWhyKry)}>
      <div className="">
        <InputWrapper label={"Marquee"} labelFor="marque" error={""}>
          <TextArea
            currentValue={watch("marqueeText") || ""}
            onChange={(e) => setValue("marqueeText", e.target.value)}
            placeHolder=""
            className="border-2 border-primary"
          />
        </InputWrapper>
        <div className="flex items-center gap-1 mt-3">
          <input
            type="checkbox"
            checked={watch("isMarqueeShow")}
            onChange={(e) => setValue("isMarqueeShow", e.target.checked)}
            className="w-5 h-4"
          />
          <label htmlFor="">Is Marquee Show?</label>
        </div>
      </div>

      <div className="flex justify-end my-5">
        <Button type="submit" variant={"default"} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>

      {error && "data" in error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Marquee Error</AlertTitle>
          <AlertDescription>
            {(error.data as { message?: string })?.message ||
              "Something went wrong! Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default Marquee;
