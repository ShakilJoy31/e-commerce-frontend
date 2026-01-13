import InputWrapper from "@/components/common/wrapper/InputWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useGetCompanyInfoAllQuery,
  useUpdateCompanyMutation,
} from "@/components/store/api/company/companyApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const BookingMinimumAmount = () => {
  const { toast } = useToast();
  const { data: companyData, isLoading: isFetching } =
    useGetCompanyInfoAllQuery({});

  const [addShippingPrice, { isLoading, error }] = useUpdateCompanyMutation();

  const { handleSubmit, setValue, watch } = useForm();

  useEffect(() => {
    if (companyData?.data?.length > 0) {
      setValue(
        "minAmountOfBookingPrice",
        companyData?.data[0].minAmountOfBookingPrice
      );
      setValue("minBooking", companyData?.data[0].minBooking);
      setValue(
        "minBookingType",
        companyData?.data[0].minBookingType || "FIXED"
      );
    }
  }, [companyData?.data, setValue]);

  const handleSaveWhyKry = async (data: any) => {
    try {
      await addShippingPrice({
        id: companyData?.data[0]?.id,
        data: data,
      }).unwrap();

      toast({
        title: "Success",
        description: "Booking settings updated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving booking settings:", error);
      toast({
        title: "Error",
        description: "Failed to save booking settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isFetching) return <LoaderSpinner />;

  return (
    <form onSubmit={handleSubmit(handleSaveWhyKry)} className="">
      <div className="flex items-center gap-4">
        <InputWrapper
          label={"Booking minimum amount"}
          labelFor="minAmountOfBookingPrice"
          error={""}
        >
          <Input
            placeholder={"Enter minimum booking amount..."}
            value={watch("minAmountOfBookingPrice")}
            onChange={(e) =>
              setValue("minAmountOfBookingPrice", Number(e.target.value))
            }
            errorMessage={""}
          />
        </InputWrapper>
        <InputWrapper
          label={"Booking Type"}
          labelFor="minBookingType"
          error={""}
        >
          <Select
            value={watch("minBookingType")}
            onValueChange={(value) => setValue("minBookingType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIXED">FIXED</SelectItem>
              <SelectItem value="PERCENTAGE">PERCENTAGE</SelectItem>
            </SelectContent>
          </Select>
        </InputWrapper>
        <InputWrapper
          label={"Minimum Booking"}
          labelFor="minBooking"
          error={""}
        >
          <Input
            placeholder={"Enter minimum booking..."}
            value={watch("minBooking")}
            onChange={(e) => setValue("minBooking", Number(e.target.value))}
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
          <AlertTitle>Booking Settings Error</AlertTitle>
          <AlertDescription>
            {(error.data as { message?: string })?.message ||
              "Something went wrong! Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default BookingMinimumAmount;
