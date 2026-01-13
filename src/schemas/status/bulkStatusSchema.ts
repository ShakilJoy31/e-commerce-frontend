import * as Yup from "yup";

export const bulkStatusSchema = Yup.object().shape({
  orders: Yup.array()
    .of(Yup.number().required("Order ID must be a number"))
    .required("Orders are required"),

  note: Yup.string().optional(),

  type: Yup.string()
    .oneOf(
      [
        "CONFIRMED",
        "PROCESSING",
        "CANCELLED",
        "HOLD",
        "SHIPPED",
        "IN_DELIVERY",
        "DELIVERED",
        "COMPLETED",
      ],
      "Invalid type"
    )
    .optional(),

  cancelReason: Yup.string()
    .oneOf(
      [
        "High_Price",
        "Sort_Time_Delivery",
        "Fake_Order",
        "Out_Of_Zone",
        "Duplicate_Order",
        "Changed_Mind",
      ],
      "Invalid cancel reason"
    )
    .optional(),

  courierId: Yup.number().optional(),
});
