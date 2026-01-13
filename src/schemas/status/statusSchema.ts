import * as Yup from "yup";

export const statusSchema = Yup.object().shape({
  orderStatus: Yup.string()
    .oneOf([
      "CONFIRMED",
      "CANCELLED",
      "PROCESSING",
      "HOLD",
      "SHIPPED",
      "IN_DELIVERY",
      "DELIVERED",
      "COMPLETED",
    ], "Invalid order status")
    .required("Order status is required"),

  note: Yup.string().optional(),

  cancelReason: Yup.string()
    .oneOf([
      "High_Price",
      "Sort_Time_Delivery",
      "Fake_Order",
      "Out_Of_Zone",
      "Duplicate_Order",
      "Changed_Mind",
      "Others"
    ], "Invalid cancel reason")
    .optional(),

  paymentStatus: Yup.boolean().optional(),
  
  // Corrected courier field validation
  courierId: Yup.string().when("orderStatus", {
    is: (val: string) => val === "SHIPPED",
    then: (schema) => schema.required("Courier is required when status is SHIPPED"),
    otherwise: (schema) => schema.optional()
  })
});