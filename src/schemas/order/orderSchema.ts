import * as yup from "yup";

export const orderSchema = yup.object().shape({
  userId: yup.number().required("User ID is required"),
  note: yup.string().optional(),
  coupon: yup.string().optional(),
  totalAmount: yup.number().required("Total amount is required"),
  shippingCharge: yup.number().optional(),
  paymentMethod: yup
    .string()
    .optional()
    .oneOf(["COD", "ONLINE", "EMI"], "Payment method must be either 'COD', 'ONLINE', or 'EMI'"),
  bankId: yup.number().optional(),
  emiChargeId: yup.number().optional(),
  orderItems: yup.array().of(
    yup.object().shape({
      productId: yup.number().required("Product ID is required"),
      extraWarrantyId: yup.number().optional(),
      productColorId: yup.number().required("Product color ID is required"),
      productVariationId: yup.number().required("Product variation ID is required"),
      quantity: yup.number().required("Quantity is required"),
      price: yup.number().required("Price is required"),
      subTotal: yup.number().required("Subtotal is required"),
    })
  ).required("Order items are required"),
  shippingAddress: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Name is required"),
      email: yup.string().email().optional(),
      district: yup.string().required("District is required"),
      city: yup.string().required("City is required"),
      thana: yup.string().required("Thana is required"),
      address: yup.string().required("Address is required"),
      phone: yup.string().required("Phone number is required"),
    })
  ).required("Shipping address is required"),
});

export type OrderFormData = yup.InferType<typeof orderSchema>;
