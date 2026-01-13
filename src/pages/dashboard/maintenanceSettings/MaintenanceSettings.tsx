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
import TipTapEditor from "../products/TipTapEditor";
import DateTimeInput from "@/components/ui/dateTimeInput";

interface MaintenanceFormData {
  isMaintenance: boolean;
  maintenanceStartDate: Date | null;
  maintenanceEndDate: Date | null;
  maintenanceContent: string;
}

const MaintenanceSettings = () => {
  const { data: companyData, isLoading: bannerLoading } =
    useGetCompanyInfoAllQuery({});
  const [updateMaintenance, { isLoading }] = useUpdateCompanyMutation();

  const { control, handleSubmit, setValue, watch, register } =
    useForm<MaintenanceFormData>({
      defaultValues: {
        isMaintenance: false,
        maintenanceContent: "",
      },
    });

  const isMaintenance = watch("isMaintenance");

  useEffect(() => {
    if (companyData?.data?.length > 0) {
      const company = companyData.data[0];
      setValue("isMaintenance", company.isMaintenance || false);
      setValue("maintenanceContent", company.maintenanceContent || "");

      if (company.maintenanceStartDate) {
        setValue(
          "maintenanceStartDate",
          new Date(company.maintenanceStartDate)
        );
      }
      if (company.maintenanceEndDate) {
        setValue("maintenanceEndDate", new Date(company.maintenanceEndDate));
      }
    }
  }, [companyData?.data, setValue]);

  const handleSaveMaintenance = async (data: MaintenanceFormData) => {
    try {
      const payload = {
        id: companyData?.data[0]?.id,
        data: {
          isMaintenance: Boolean(data.isMaintenance),
          ...(data.maintenanceContent && {
            maintenanceContent: data.maintenanceContent,
          }),
          ...(data.maintenanceStartDate && {
            maintenanceStartDate: data.maintenanceStartDate,
          }),
          ...(data.maintenanceEndDate && {
            maintenanceEndDate: data.maintenanceEndDate,
          }),
        },
      };

      const result = await updateMaintenance(payload).unwrap();

      if (result?.success) {
        toast.success("Maintenance settings updated successfully!");
      } else {
        throw new Error(
          result?.message || "Failed to update maintenance settings"
        );
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save maintenance settings");
    }
  };

  if (bannerLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <form onSubmit={handleSubmit(handleSaveMaintenance)}>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              System Mode Settings
            </h2>
            <p className="text-sm text-gray-500">
              Configure maintenance mode settings
            </p>
          </div>

          <div className="space-y-6">
            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Maintenance Mode
                </label>
                <p className="text-sm text-gray-500">
                  {isMaintenance
                    ? "System is in maintenance mode"
                    : "System is in production mode"}
                </p>
              </div>
              <Controller
                name="isMaintenance"
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

            {/* Date Range Selector */}
            {isMaintenance && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Maintenance Start Date
                  </label>
                  <div className="flex gap-2">
                    <Controller
                      name={`maintenanceStartDate`}
                      control={control}
                      render={({ field }) => (
                        <DateTimeInput
                          name={field.name}
                          register={register}
                          watch={watch}
                          setValue={setValue}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Maintenance End Date
                  </label>
                  <div className="flex gap-2">
                    <Controller
                      name={`maintenanceEndDate`}
                      control={control}
                      render={({ field }) => (
                        <DateTimeInput
                          name={field.name}
                          register={register}
                          watch={watch}
                          setValue={setValue}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance Content Editor */}
            {isMaintenance && (
              <div className="mt-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Maintenance Message
                </label>
                <Controller
                  name="maintenanceContent"
                  control={control}
                  render={({ field }) => (
                    <TipTapEditor
                      content={field.value}
                      onUpdate={field.onChange}
                    />
                  )}
                />
              </div>
            )}

            {/* Warning Banner */}
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <strong>Warning:</strong> When maintenance mode is active,
                    regular users may not be able to access the system.
                  </p>
                </div>
              </div>
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

export default MaintenanceSettings;
