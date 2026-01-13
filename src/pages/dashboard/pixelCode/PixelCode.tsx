import ButtonLoader from "@/components/loader/ButtonLoader";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useGetCompanyInfoAllQuery,
  useUpdateCompanyMutation,
} from "@/components/store/api/company/companyApi";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import TextArea from "@/components/ui/text-area";

interface ScriptFormData {
  googleScript: string;
  facebookScript: string;
  googleNoScript: string;
  facebookNoScript: string;
}

const ScriptSettings = () => {
  const { data: companyData, isLoading } = useGetCompanyInfoAllQuery({});
  const [updateScripts, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const { handleSubmit, setValue, watch } = useForm<ScriptFormData>({
    defaultValues: {
      googleScript: "",
      facebookScript: "",
      googleNoScript: "",
      facebookNoScript: "",
    },
  });

  useEffect(() => {
    if (companyData?.data?.length > 0) {
      const company = companyData.data[0];
      setValue("googleScript", company.googleScript || "");
      setValue("facebookScript", company.facebookScript || "");
      setValue("googleNoScript", company.googleNoScript || "");
      setValue("facebookNoScript", company.facebookNoScript || "");
    }
  }, [companyData?.data, setValue]);

  const handleSaveScripts = async (data: ScriptFormData) => {
    try {
      const payload = {
        id: companyData?.data[0]?.id,
        data: {
          googleScript: data.googleScript,
          facebookScript: data.facebookScript,
          googleNoScript: data.googleNoScript,
          facebookNoScript: data.facebookNoScript,
        },
      };

      const result = await updateScripts(payload).unwrap();

      if (result?.success) {
        toast.success("Script settings updated successfully!");
      } else {
        throw new Error(result?.message || "Failed to update script settings");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save script settings");
    }
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <form onSubmit={handleSubmit(handleSaveScripts)}>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Script Settings
            </h2>
            <p className="text-sm text-gray-500">
              Manage your tracking and analytics scripts
            </p>
          </div>

          <div className="space-y-6">
            {/* Google Script */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Google Script
                </label>
                <div className="relative">
                  <TextArea
                    currentValue={watch("googleScript") || ""}
                    placeHolder="Enter Google script code"
                    onChange={(e) => setValue("googleScript", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] font-mono text-sm"
                  />
                </div>
              </div>

              {/* Facebook Script */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Facebook Script
                </label>
                <div className="relative">
                  <TextArea
                    currentValue={watch("facebookScript") || ""}
                    placeHolder="Enter Facebook script code"
                    onChange={(e) => setValue("facebookScript", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] font-mono text-sm"
                  />
                </div>
              </div>

              {/* Google NoScript */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Google NoScript
                </label>
                <div className="relative">
                  <TextArea
                    currentValue={watch("googleNoScript") || ""}
                    placeHolder="Enter Google noscript code"
                    onChange={(e) => setValue("googleNoScript", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] font-mono text-sm"
                  />
                </div>
              </div>

              {/* Facebook NoScript */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Facebook NoScript
                </label>
                <div className="relative">
                  <TextArea
                    currentValue={watch("facebookNoScript") || ""}
                    placeHolder="Enter Facebook noscript code"
                    onChange={(e) =>
                      setValue("facebookNoScript", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {/* Save Button */}
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="flex items-center gap-1">
                    <ButtonLoader />
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ScriptSettings;
