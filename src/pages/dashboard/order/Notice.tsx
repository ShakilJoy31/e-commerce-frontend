
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

const Notice = () => {
  const { toast } = useToast();
  const { data: companyData, isLoading: isFetching } =
    useGetCompanyInfoAllQuery({});

  const [addNotice, { isLoading, error }] = useUpdateCompanyMutation();

  const { handleSubmit, setValue, watch } = useForm();
  useEffect(() => {
    if (companyData?.data?.length > 0) {
      setValue("onlinePaymentNotice", companyData?.data[0].onlinePaymentNotice);
      setValue("emiPaymentNotice", companyData?.data[0].emiPaymentNotice);
      setValue("codNotice", companyData?.data[0].codNotice);
    }
  }, [companyData?.data, setValue]);


  const handleSaveWhyKry = async (data: any) => {
    try {
      await addNotice({ id: companyData?.data[0]?.id, data: data }).unwrap();

      toast({
        title: "Success",
        description: "Notice update successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving notice:", error);
      toast({
        title: "Error",
        description: "Failed to save notice. Please try again.",
        variant: "destructive",
      });
    }
  };
  if (isFetching) return <LoaderSpinner />;
  return (
    <form onSubmit={handleSubmit(handleSaveWhyKry)}>
      <div className="">
        <InputWrapper label={"Online Payment Notice"} labelFor="marque" error={""}>
          <TextArea
            currentValue={watch("onlinePaymentNotice") || ""}
            onChange={(e) => setValue("onlinePaymentNotice", e.target.value)}
            placeHolder=""
            className="border-2 border-primary"
          />
        </InputWrapper>
        <InputWrapper label={"EMI Payment Notice"} labelFor="marque" error={""}>
          <TextArea
            currentValue={watch("emiPaymentNotice") || ""}
            onChange={(e) => setValue("emiPaymentNotice", e.target.value)}
            placeHolder=""
            className="border-2 border-primary"
          />
        </InputWrapper>
        <InputWrapper label={"Cash On Delivery Payment Notice"} labelFor="marque" error={""}>
          <TextArea
            currentValue={watch("codNotice") || ""}
            onChange={(e) => setValue("codNotice", e.target.value)}
            placeHolder=""
            className="border-2 border-primary"
          />
        </InputWrapper>
       
      </div>

      <div className="flex justify-end my-5">
        <Button type="submit" variant={"default"} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>

      {error && "data" in error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Notice Error</AlertTitle>
          <AlertDescription>
            {(error.data as { message?: string })?.message ||
              "Something went wrong! Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default Notice;
