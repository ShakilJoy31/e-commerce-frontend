import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ReturnOrderFormData,
  returnOrderSchema,
} from "@/schemas/returnproduct/createReturnProductSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useGetSingleReturnOrderQuery,
  useUpdateReturnOrderStatusMutation,
} from "@/components/store/api/returnproduct/returnproductApi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import { capitalizeEveryWord } from "@/utils/helper/capitalizeEveryWord";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import LoaderSpinner from "@/components/loader/LoaderSpinner";

const UpdateReturnOrder = ({ actionItem }: any) => {
  const navigate = useNavigate();

  const [selectedProducts, setSelectedProducts] = useState<
    {
      orderItemId: number;
      quantity: number;
      productName: string;
      originalQuantity: number;
    }[]
  >([]);

  // Fetch existing return order data
  const { data: returnOrderData, isLoading } = useGetSingleReturnOrderQuery(
    actionItem.id
  );

  // Mutation hook for updating return order status
  const [updateReturn, { isLoading: updateReturnLoading }] =
    useUpdateReturnOrderStatusMutation();

  const {
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReturnOrderFormData>({
    resolver: yupResolver(returnOrderSchema),
  });

  // Automatically populate return items when loading
  useEffect(() => {
    if (returnOrderData?.data) {
      setValue("orderId", returnOrderData.data.orderId);
      setValue("reason", returnOrderData.data.reason);

      const formattedProducts = returnOrderData.data.ReturnItem.map(
        (item: any) => ({
          orderItemId: item.orderItemId,
          quantity: item.quantity,
          productName: item.orderItem?.product?.productName || "N/A",
          originalQuantity: item.orderItem?.quantity || item.quantity,
        })
      );

      setSelectedProducts(formattedProducts);
    }
  }, [returnOrderData, setValue]);

  // Function to handle checkbox selection
  const handleCheckboxChange = (orderItemId: number, isChecked: boolean) => {
    let updatedProducts = [...selectedProducts];

    if (isChecked) {
      const selectedItem = returnOrderData?.data?.ReturnItem.find(
        (item: any) => item.orderItemId === orderItemId
      );

      if (!selectedItem) return;

      updatedProducts.push({
        orderItemId,
        quantity: 1,
        productName: selectedItem.orderItem?.product?.productName || "N/A",
        originalQuantity:
          selectedItem.orderItem?.quantity || selectedItem.quantity,
      });
    } else {
      updatedProducts = updatedProducts.filter(
        (item) => item.orderItemId !== orderItemId
      );
    }

    setSelectedProducts(updatedProducts);
    setValue("products", updatedProducts);
  };

  // Function to handle quantity change
  const handleQuantityChange = (orderItemId: number, newQuantity: number) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((item) =>
        item.orderItemId === orderItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Function to handle form submission
  const handleUpdateReturn = async (data: ReturnOrderFormData) => {
    setValue("products", selectedProducts);

    if (selectedProducts.length === 0) {
      setError("products", {
        type: "custom",
        message: "Please select at least one item to update return.",
      });
      return;
    }

    const updateData = {
      orderId: actionItem?.id,
      reason: data.reason,
      products: selectedProducts.map((item) => ({
        orderItemId: item.orderItemId,
        quantity: item.quantity,
      })),
    };

    try {
      const result = await updateReturn({
        id: actionItem.id,
        data: updateData,
      }).unwrap();

      if (result?.data?.success) {
        toast({
          title: "Update Return Message",
          description: toastMessageGenerator("update", "return"),
        });

        navigate(`/kry-admin-portal/return-order-list`);
        reset();
      }
    } catch (error) {
      console.error("Error updating return:", error);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the return order.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <form
      onSubmit={handleSubmit(handleUpdateReturn)}
      className="overflow-hidden"
    >
      <h2 className="text-xl font-semibold mb-4">Update Return Order</h2>

      {/* REASON */}
      <InputWrapper
        label="Reason ✽"
        labelFor="return_reason"
        error={errors?.reason?.message}
      >
        <Select
          value={watch("reason") || ""}
          onValueChange={(value) => {
            setValue("reason", value as ReturnOrderFormData["reason"]);
            setError("reason", { type: "custom", message: "" });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select reason..." />
          </SelectTrigger>
          <SelectContent>
            {[
              "Damage_Product",
              "Delay_Delivery",
              "Wrong_Product",
              "Out_Of_Zone",
              "Fraud_Customer",
              "Delivery_Man_Careless",
            ].map((reason) => (
              <SelectItem key={reason} value={reason}>
                {capitalizeEveryWord(reason.replace("_", " "))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </InputWrapper>

      {/* ORDER ITEMS TABLE */}
      <table className="w-full border mt-4">
        <thead>
          <tr className="border bg-gray-200">
            <th className="border px-2 py-1">Select</th>
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Quantity</th>
            <th className="border px-2 py-1">Return Quantity</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((item, index) => (
            <tr key={index} className="border">
              {/* Checkbox */}
              <td className="border px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={selectedProducts.some(
                    (p) => p.orderItemId === item.orderItemId
                  )}
                  onChange={(e) =>
                    handleCheckboxChange(item.orderItemId, e.target.checked)
                  }
                />
              </td>

              {/* Product Name */}
              <td className="border px-2 py-1">{item.productName}</td>

              {/* Original Quantity */}
              <td className="border px-2 py-1 text-center">
                {item.originalQuantity}
              </td>

              {/* Input for Return Quantity */}
              <td className="border px-2 py-1 text-center">
                <input
                  type="number"
                  min="1"
                  max={item.originalQuantity}
                  className="w-16 px-2 py-1 border rounded"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.orderItemId,
                      Number(e.target.value)
                    )
                  }
                  disabled={
                    !selectedProducts.some(
                      (p) => p.orderItemId === item.orderItemId
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={updateReturnLoading}
        >
          {updateReturnLoading ? "Updating..." : "Update Return Request"}
        </button>
      </div>
    </form>
  );
};

export default UpdateReturnOrder;
