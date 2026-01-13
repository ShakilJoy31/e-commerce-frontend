import InputWrapper from "@/components/common/wrapper/InputWrapper";
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

interface GridFormValues {
  smGrid: number;
  mdGrid: number;
  lgGrid: number;
}

const Grid = () => {
  const { toast } = useToast();
  const { data: companyData, isLoading: isFetching } = useGetCompanyInfoAllQuery({});
  const [updateGridSettings, { isLoading, error }] = useUpdateCompanyMutation();

  const { handleSubmit, setValue, register } = useForm<GridFormValues>();

  useEffect(() => {
    if (companyData?.data?.length > 0) {
      // Initialize form values from API data
      setValue("smGrid", companyData.data[0].smGrid || 0);
      setValue("mdGrid", companyData.data[0].mdGrid || 0);
      setValue("lgGrid", companyData.data[0].lgGrid || 0);
    }
  }, [companyData?.data, setValue]);

  const handleSaveGridSettings = async (data: GridFormValues) => {
    try {
      if (!companyData?.data?.[0]?.id) {
        throw new Error("Company ID not found");
      }

      await updateGridSettings({
        id: companyData.data[0].id,
        data: {
          smGrid: data.smGrid,
          mdGrid: data.mdGrid,
          lgGrid: data.lgGrid
        }
      }).unwrap();

      toast({
        title: "Success",
        description: "Grid settings updated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving grid settings:", error);
      toast({
        title: "Error",
        description: "Failed to save grid settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isFetching) return <LoaderSpinner />;

  return (
    <form onSubmit={handleSubmit(handleSaveGridSettings)} className="space-y-4">
      <div className="w-2/4 mx-auto bg-white p-4 rounded-lg shadow">
        <InputWrapper label="SmGrid (sm)" labelFor="smGrid" error="">
          <input
            id="smGrid"
            type="number"
            min="0"
            {...register("smGrid", { valueAsNumber: true })}
            className="w-full border-2 border-primary rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </InputWrapper>
      </div>

      <div className="w-2/4 mx-auto bg-white p-4 rounded-lg shadow">
        <InputWrapper label="MdGrid (md)" labelFor="mdGrid" error="">
          <input
            id="mdGrid"
            type="number"
            min="0"
            {...register("mdGrid", { valueAsNumber: true })}
            className="w-full border-2 border-primary rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </InputWrapper>
      </div>

      <div className="w-2/4 mx-auto bg-white p-4 rounded-lg shadow">
        <InputWrapper label="LgGrid (lg)" labelFor="lgGrid" error="">
          <input
            id="lgGrid"
            type="number"
            min="0"
            {...register("lgGrid", { valueAsNumber: true })}
            className="w-full border-2 border-primary rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </InputWrapper>
      </div>

      <div className="w-2/4 mx-auto flex justify-end mt-6">
        <Button 
          type="submit" 
          variant="default" 
          disabled={isLoading}
          className="px-6 py-2"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {error && "data" in error && (
        <div className="w-2/4 mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Grid Settings Error</AlertTitle>
            <AlertDescription>
              {(error.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </form>
  );
};

export default Grid;