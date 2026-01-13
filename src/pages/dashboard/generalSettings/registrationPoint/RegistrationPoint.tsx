import { useGetCompanyInfoAllQuery, useUpdateCompanyMutation } from "@/components/store/api/company/companyApi";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface RegistrationPointFormValues {
  registrationPoint: number;
}

const RegistrationPoint = () => {
  const { toast } = useToast();
  const { data: companyData, isLoading: isFetching } = useGetCompanyInfoAllQuery({});
  const [updateRegistrationPoint, { isLoading, error }] = useUpdateCompanyMutation();

  const { handleSubmit, setValue, register } = useForm<RegistrationPointFormValues>();

  useEffect(() => {
    if (companyData?.data?.[0]?.registrationPoint !== undefined) {
      setValue("registrationPoint", companyData.data[0].registrationPoint);
    }
  }, [companyData?.data, setValue]);

  const handleSaveRegistrationPoint = async (data: RegistrationPointFormValues) => {
    try {
      if (!companyData?.data?.[0]?.id) {
        throw new Error("Company ID not found");
      }

      await updateRegistrationPoint({
        id: companyData.data[0].id,
        data: {
          registrationPoint: data.registrationPoint
        }
      }).unwrap();

      toast({
        title: "Success",
        description: "Registration point updated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving registration point:", error);
      toast({
        title: "Error",
        description: "Failed to save registration point. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isFetching) return <LoaderSpinner />;

  return (
    <form 
      onSubmit={handleSubmit(handleSaveRegistrationPoint)} 
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="registrationPoint" className="block text-sm font-medium text-gray-700 mb-1">
            Registration Point
          </label>
          <input
            id="registrationPoint"
            type="number"
            min="0"
            {...register("registrationPoint", { 
              valueAsNumber: true,
              required: "Registration point is required"
            })}
            className="w-full border-2 border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            variant="default" 
            disabled={isLoading}
            className="px-6 py-2"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>

        {error && "data" in error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {(error.data as { message?: string })?.message ||
                "Failed to update registration point"}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </form>
  );
};

export default RegistrationPoint;