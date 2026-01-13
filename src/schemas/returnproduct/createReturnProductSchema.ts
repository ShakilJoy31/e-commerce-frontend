import * as yup from "yup";

export const returnOrderSchema = yup.object().shape({
  orderId: yup.number().required("Order ID is required"),
  reason: yup
    .string()
    .oneOf(
      [
        "Damage_Product",
        "Delay_Delivery",
        "Wrong_Product",
        "Out_Of_Zone",
        "Fraud_Customer",
        "Delivery_Man_Careless",
      ],
      "Invalid reason selected"
    )
    .required(),
  products: yup
    .array()
    .of(
      yup.object().shape({
        orderItemId: yup.number().required("Order Item ID is required"),
        quantity: yup.number().required("Quantity is required"),
      })
    )
    .required("Products are required"),
});

export type ReturnOrderFormData = yup.InferType<typeof returnOrderSchema>;
