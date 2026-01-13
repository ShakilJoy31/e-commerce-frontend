import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
    useGetCompanyInfoAllQuery,
    useUpdateCompanyMutation,
} from "@/components/store/api/company/companyApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
// OR if named export:
// import { Input } from "@/components/ui/input"; // Solution 2
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

const GatewayChargeSettings = () => {
    const { toast } = useToast();
    const { data: companyData, isLoading: isFetching } =
        useGetCompanyInfoAllQuery({});

    const [updateCompany, { isLoading, error }] = useUpdateCompanyMutation();

    const { handleSubmit, setValue, watch, register } = useForm({
        defaultValues: {
            gatewayChargeType: "FIXED",
            gatewayCharge: 0,
        },
    });

    useEffect(() => {
        if (companyData?.data?.length > 0) {
            setValue("gatewayChargeType", companyData?.data[0].gatewayChargeType || "FIXED");
            setValue("gatewayCharge", companyData?.data[0].gatewayCharge || 0);
        }
    }, [companyData?.data, setValue]);

    const handleSaveSettings = async (data: any) => {
        try {
            const result = await updateCompany({
                id: companyData?.data[0]?.id,
                data: {
                    gatewayChargeType: data.gatewayChargeType,
                    gatewayCharge: Number(data.gatewayCharge)
                }
            }).unwrap();
            console.log(result)

            toast({
                title: "Success",
                description: "Gateway charge settings saved successfully!",
                variant: "default",
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (isFetching) return <LoaderSpinner />;

    return (
        <form onSubmit={handleSubmit(handleSaveSettings)}>
            <SectionWrapper>
                <div className="mt-10 space-y-4">
                    <h2 className="text-3xl mb-6">Gateway Charge Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="gatewayChargeType" className="block mb-2 text-sm font-medium">
                                Charge Type
                            </label>
                            <Select
                                value={watch("gatewayChargeType")}
                                onValueChange={(value) => setValue("gatewayChargeType", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select charge type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="gatewayCharge" className="block mb-2 text-sm font-medium">
                                {watch("gatewayChargeType") === "FIXED" ? "Amount" : "Percentage"}
                            </label>
                            <input
                                type="number"
                                id="gatewayCharge"
                                {...register("gatewayCharge", {
                                    required: true,
                                    min: 0,
                                    valueAsNumber: true
                                })}
                                step={watch("gatewayChargeType") === "PERCENTAGE" ? "0.01" : "1"}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {watch("gatewayChargeType") === "PERCENTAGE" && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Enter percentage value (e.g., 2.5 for 2.5%)
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            <div className="flex justify-end my-5">
                <Button type="submit" variant={"default"} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Settings"}
                </Button>
            </div>

            {error && "data" in error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {(error.data as { message?: string })?.message ||
                            "Something went wrong! Please try again."}
                    </AlertDescription>
                </Alert>
            )}
        </form>
    );
};

export default GatewayChargeSettings;