
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useGetCompanyInfoAllQuery,
  useUpdateCompanyMutation,
} from "@/components/store/api/company/companyApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ShippingChargeMinPrice = () => {
  const { toast } = useToast();
  const { data: companyData, isLoading: isFetching } =
    useGetCompanyInfoAllQuery({});

  const [addShippingPrice, { isLoading, error }] = useUpdateCompanyMutation();

  const { handleSubmit, setValue, watch } = useForm();
  
  useEffect(() => {
    if (companyData?.data?.length > 0) {
      setValue("shippingChargeMinimumPrice", companyData?.data[0].shippingChargeMinimumPrice);
    }
  }, [companyData?.data, setValue]);


  const handleSaveWhyKry = async (data: any) => {
    try {
      await addShippingPrice({ id: companyData?.data[0]?.id, data: data }).unwrap();

      toast({
        title: "Success",
        description: "Shipping charge update successfully!",
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
    <form onSubmit={handleSubmit(handleSaveWhyKry)} className="">
      <div className="">
        <InputWrapper
            label={"Shipping Charge Min Price"}
            labelFor="product_name"
            error={""}
          >
            <Input
              placeholder={"Shipping charge..."}
              value={watch("shippingChargeMinimumPrice")}
              onChange={(e) => setValue("shippingChargeMinimumPrice", Number(e.target.value))}
              errorMessage={""}
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
          <AlertTitle>Shipping charge Error</AlertTitle>
          <AlertDescription>
            {(error.data as { message?: string })?.message ||
              "Something went wrong! Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default ShippingChargeMinPrice;
