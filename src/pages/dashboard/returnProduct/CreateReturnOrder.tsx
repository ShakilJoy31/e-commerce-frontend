import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ReturnOrderFormData,
  returnOrderSchema,
} from "@/schemas/returnproduct/createReturnProductSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateReturnOrderMutation } from "@/components/store/api/returnproduct/returnproductApi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import InputWrapper from "@/components/common/wrapper/InputWrapper";
import { capitalizeEveryWord } from "@/utils/helper/capitalizeEveryWord";
import { toast } from "@/components/ui/use-toast";

const CreateReturnOrder = ({ actionItem, setIsModalOpen }: any) => {
  const [selectedProducts, setSelectedProducts] = useState<
    { orderItemId: number; quantity: number }[]
  >([]);

  const {
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<ReturnOrderFormData>({
    resolver: yupResolver(returnOrderSchema),
  });

  const [createReturn, { isLoading }] = useCreateReturnOrderMutation();

  // Function to handle checkbox selection
  const handleCheckboxChange = (orderItemId: number, isChecked: boolean) => {
    let updatedProducts = [...selectedProducts];

    if (isChecked) {
      // When checked, set default quantity to 1
      updatedProducts.push({ orderItemId, quantity: 1 });
    } else {
      updatedProducts = updatedProducts.filter(
        (item) => item.orderItemId !== orderItemId
      );
    }

    setSelectedProducts(updatedProducts);
    setValue("products", updatedProducts);
  };

  // Function to handle quantity change
  const handleQuantityChange = (orderItemId: number, newQuantity: string, maxQuantity: number) => {
    // Parse the input value or default to empty string
    const parsedValue = newQuantity === "" ? "" : parseInt(newQuantity);

    // If empty string, set quantity to 0 (will be validated on submit)
    if (parsedValue === "") {
      setSelectedProducts(
        selectedProducts.map((item) =>
          item.orderItemId === orderItemId
            ? { ...item, quantity: 0 }
            : item
        )
      );
      return;
    }

    // If not a number or less than 1, don't update
    if (isNaN(parsedValue)) return;

    // Ensure quantity doesn't exceed maxQuantity and is at least 1
    const validatedQuantity = Math.min(Math.max(1, parsedValue), maxQuantity);

    setSelectedProducts(
      selectedProducts.map((item) =>
        item.orderItemId === orderItemId
          ? { ...item, quantity: validatedQuantity }
          : item
      )
    );
  };

  useEffect(() => {
    if (actionItem?.id) {
      setValue("orderId", actionItem.id);
    }
  }, [actionItem.id, setValue]);

  // Function to handle form submission
  const handleAddReturn = async (data: ReturnOrderFormData) => {
    try {
      // Validate reason first
      if (!data.reason) {
        setError("reason", { type: "custom", message: "Please select a reason for return" });
        return;
      }

      // Validate quantities before submission
      const invalidProducts = selectedProducts.filter(
        item => item.quantity < 1 ||
          item.quantity > (actionItem.OrderItem.find((i: any) => i.id === item.orderItemId)?.quantity || 0)
      );

      if (invalidProducts.length > 0) {
        setError("products", { type: "custom", message: "Please enter valid quantities for all selected items." });
        return;
      }

      if (selectedProducts.length === 0) {
        setError("products", { type: "custom", message: "Please select at least one item to return." });
        return;
      }

      const returnData = {
        orderId: actionItem.id,
        reason: data.reason,
        products: selectedProducts,
      };
      const result = await createReturn(returnData).unwrap();
      
      if (result?.success) {
        toast({
          title: "Success",
          description: result?.message,
          variant: "default",
        });
        setIsModalOpen(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create return order",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleAddReturn)} className="overflow-hidden">
      {/* Show error message if reason is not selected */}
      {errors?.reason?.message && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errors.reason.message}
        </div>
      )}

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
          {actionItem?.OrderItem?.map((item: any) => {
            const isSelected = selectedProducts.some((p) => p.orderItemId === item.id);
            const selectedProduct = selectedProducts.find((p) => p.orderItemId === item.id);
            const currentQuantity = selectedProduct ? selectedProduct.quantity : "";

            return (
              <tr key={item.id} className="border">
                {/* Checkbox */}
                <td className="border px-2 py-1 text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(item.id, e.target.checked)
                    }
                    checked={isSelected}
                  />
                </td>

                {/* Product Name */}
                <td className="border px-2 py-1">
                  {item?.product?.productName || "N/A"}
                </td>

                {/* Original Quantity */}
                <td className="border px-2 py-1 text-center">{item.quantity}</td>

                {/* Input for Return Quantity */}
                <td className="border px-2 py-1 text-center">
                  <input
                    type="number"
                    min="1"
                    max={item.quantity}
                    value={isSelected ? currentQuantity : ""}
                    className="w-16 px-2 py-1 border rounded"
                    onChange={(e) => {
                      handleQuantityChange(item.id, e.target.value, item.quantity);
                    }}
                    disabled={!isSelected}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Show products error message if exists */}
      {errors?.products?.message && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
          {errors.products.message}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Return Request"}
        </button>
      </div>
    </form>
  );
};

export default CreateReturnOrder;