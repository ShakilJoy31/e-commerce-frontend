import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { RiErrorWarningLine } from "react-icons/ri";
import { useGetTCourierQuery } from "@/components/store/api/courier/courierApi";
import { useEffect } from "react";
import { bulkStatusSchema } from "@/schemas/status/bulkStatusSchema";
import { useUpdateBulkOrderStatusMutation } from "@/components/store/api/order/orderApi";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";

const cancelReasons = [
  "High_Price",
  "Sort_Time_Delivery",
  "Fake_Order",
  "Out_Of_Zone",
  "Duplicate_Order",
  "Changed_Mind",
];

// Map selectOption values to status types
const optionToStatusMap = {
  confirm: "CONFIRMED",
  onHold: "HOLD",
  cancelled: "CANCELLED",
  processing: "PROCESSING",
  shipped: "SHIPPED",
  inDelivery: "IN_DELIVERY",
  delivery: "DELIVERED",
  completed: "COMPLETED",
};

const UpdateBulktype = ({ selectOption, isOpen, onClose, orderIds }: any) => {
  const [changeStatus, { isLoading, error }] =
    useUpdateBulkOrderStatusMutation();
  const { data: couriersData } = useGetTCourierQuery({
    page: "1",
    size: "1000",
  });

  const { toast } = useToast();
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    register,
    reset,
  } = useForm({
    resolver: yupResolver(bulkStatusSchema),
    defaultValues: {
      note: "",
      courierId: undefined,
      cancelReason: undefined,
    },
  });
  useEffect(() => {
    console.log("Form errors:", errors);
  }, [errors]);

  // Automatically set the status based on selectOption
  useEffect(() => {
    if (selectOption && optionToStatusMap[selectOption]) {
      setValue("type", optionToStatusMap[selectOption]);
    }
    if (orderIds) {
      setValue("orders", orderIds);
    }
  }, [orderIds, selectOption, setValue]);

  // Watch the selected order status to dynamically update the cancel reason validation
  const type = watch("type");

  // Dynamically handle change of status
  const handleChangeStatus = async (data: any) => {
    try {
      const updateData = {
        orders: orderIds,
        type: data.type,
        note: data.note,
        cancelReason: data.cancelReason || undefined,
        courierId: data.courierId ? Number(data.courierId) : undefined,
      };

      const cleanData = removeFalsyValuesProperties(updateData, [
        "note",
        "cancelReason",
        "courierId",
      ]);

      const result = await changeStatus(cleanData).unwrap();

      if (result.success) {
        toast({
          title: "Order Status",
          description: toastMessageGenerator("update", "status"),
        });
        onClose();
        reset();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-hidden overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Update Order Status</h3>
              <Button variant="outline" onClick={onClose} className="text-lg">
                X
              </Button>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <p className="font-medium">
                Updating {orderIds.length} order(s) to:
              </p>
              <p className="text-lg font-bold capitalize">
                {optionToStatusMap[selectOption]
                  ?.toLowerCase()
                  .replace("_", " ")}
              </p>
            </div>

            <form onSubmit={handleSubmit(handleChangeStatus)}>
              {/* Courier Selection (Visible only when status is SHIPPED) */}
              {type === "SHIPPED" && (
                <div className="mt-3">
                  <label htmlFor="courier">Select Courier</label>
                  <select
                    id="courier"
                    {...register("courierId", {
                      required: "Courier is required when status is SHIPPED",
                    })}
                    className="border-2 border-primary mt-1 p-2 rounded-md w-full"
                  >
                    <option value="">Select Courier...</option>
                    {couriersData?.data?.map((courier: any) => (
                      <option key={courier.id} value={courier.id}>
                        {courier.name}
                      </option>
                    ))}
                  </select>
                  {errors?.courierId && (
                    <div className="text-xs text-red-700 mt-[0.4rem] flex items-center">
                      <RiErrorWarningLine className="inline-block h-3 w-3 mr-[0.45rem]" />
                      <span>{errors?.courierId?.message}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Cancel Reason Field */}
              {type === "CANCELLED" && (
                <div className="mt-3">
                  <label htmlFor="cancelReason">Cancel Reason</label>
                  <select
                    id="cancelReason"
                    {...register("cancelReason", {
                      required: "Cancel reason is required",
                    })}
                    className="border-2 mt-1 border-primary p-2 rounded-md w-full"
                  >
                    <option value="">Select a reason...</option>
                    {cancelReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  {errors?.cancelReason && (
                    <div className="text-xs text-red-700 mt-[0.4rem] flex items-center">
                      <RiErrorWarningLine className="inline-block h-3 w-3 mr-[0.4rem]" />
                      <span>{errors?.cancelReason?.message}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Note Field (Always Visible) */}
              <div className="flex flex-col gap-2 mt-3">
                <label htmlFor="note">Note (Optional)</label>
                <textarea
                  id="note"
                  placeholder="Enter a note (if needed)"
                  {...register("note")}
                  className="border-2 border-primary p-2 rounded-md"
                />
                {errors?.note && (
                  <div className="text-xs text-red-700 mt-[0.4rem] flex items-center">
                    <RiErrorWarningLine className="inline-block h-3 w-3 mr-[0.4rem]" />
                    <span>{errors?.note?.message}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </form>

            {/* Error Alert */}
            {error && "data" in error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Status Change Error</AlertTitle>
                <AlertDescription>
                  {(error.data as { message?: string })?.message ||
                    "Something went wrong! Please try again."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateBulktype;
