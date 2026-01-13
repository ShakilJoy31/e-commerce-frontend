import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import ButtonLoader from "@/components/loader/ButtonLoader";
import {
  useGetOrderMessageTemplateQuery,
  useUpdateOrderMessageFieldMutation,
} from "@/components/store/api/messageTemplate/messageTemplateApi";
import { useToast } from "@/components/ui/use-toast";

export default function PaymentSuccessMessage() {
  const { toast } = useToast();
  const { data, isLoading } = useGetOrderMessageTemplateQuery({});
  const [updateField, { isLoading: isUpdating }] = useUpdateOrderMessageFieldMutation();
  
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (data?.data?.paymentSuccessMessage) {
      setPaymentSuccessMessage(data.data.paymentSuccessMessage);
    }
  }, [data]);

  const handleUpdate = async () => {
    try {
      await updateField({ paymentSuccessMessage }).unwrap();
      toast({
        title: "Success",
        description: "Order confirm message updated successfully",
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update Order message message:", err);
      toast({
        title: "Error",
        description: "Failed to update Order confirm message",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <LoaderSpinner />;

  return (
    <div className="bg-white rounded-lg min-h-screen shadow p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Order Confirm Message Template</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase ">
                Message Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase ">
                Current Message
              </th>
              <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase ">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Order Confirm Message
              </td>
              <td className="px-6 py-4 text-sm max-w-md truncate">
                {paymentSuccessMessage || "No message set"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <FiEdit className="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Edit Order Confirm Message</h2>
            <textarea
              value={paymentSuccessMessage}
              onChange={(e) => setPaymentSuccessMessage(e.target.value)}
              rows={6}
              className="w-full border p-3 rounded-md focus:ring-primary focus:border-blue-500"
              placeholder="Enter your OTP message template..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className={`px-4 py-2 rounded-md text-white ${
                  isUpdating ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isUpdating ? <ButtonLoader /> : "Update"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
