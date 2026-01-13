import ButtonLoader from "@/components/loader/ButtonLoader";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useGetCompanyInfoAllQuery,
  useUpdateCompanyMutation,
} from "@/components/store/api/company/companyApi";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface AdvanceDeliveryChargeFormData {
  isDeliveryChargeAsAdvance: boolean;
}

const AdvanceDeliveryCharge = () => {
  const { data: companyData, isLoading: companyLoading } = useGetCompanyInfoAllQuery({});
  const [updatePaymentSettings, { isLoading }] = useUpdateCompanyMutation();

  const { control, handleSubmit, setValue } = useForm<AdvanceDeliveryChargeFormData>({
    defaultValues: {
      isDeliveryChargeAsAdvance: false,
     
    }
  });

  useEffect(() => {
    if (companyData?.data?.length > 0) {
      const company = companyData.data[0];
      console.log(company?.isDeliveryChargeAsAdvance)
      setValue("isDeliveryChargeAsAdvance", company.isDeliveryChargeAsAdvance || false);
    }
  }, [companyData?.data, setValue]);

  const handleSavePaymentSettings = async (data: AdvanceDeliveryChargeFormData) => {
    try {
      const payload = {
        id: companyData?.data[0]?.id,
        data: {
          isDeliveryChargeAsAdvance: data.isDeliveryChargeAsAdvance,
        }
      };

      const result = await updatePaymentSettings(payload).unwrap();

      if (result?.success) {
        toast.success("Delivery charge updated successfully!");
      } else {
        throw new Error(result?.message || "Failed to update payment settings");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save payment settings");
    }
  };

  if (companyLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <form onSubmit={handleSubmit(handleSavePaymentSettings)}>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Advance Delivery Settings
            </h2>
            <p className="text-sm text-gray-500">
              Configure advance delivery charge availability
            </p>
          </div>

          <div className="space-y-6">
            {/* Online Payment Toggle */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Advance Delivery Charge
                </label>
                <p className="text-sm text-gray-500">
                  Enable/disable advance delivery charge
                </p>
              </div>
              <Controller
                name="isDeliveryChargeAsAdvance"
                control={control}
                render={({ field }) => (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                )}
              />
            </div>

         
            {/* Save Button */}
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <ButtonLoader />
                  Updating...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdvanceDeliveryCharge;