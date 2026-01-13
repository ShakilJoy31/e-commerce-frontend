import * as Yup from "yup";

export const adminOrderSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  contactNo: Yup.string().required("Contact number is required"),
  note: Yup.string().optional().nullable(),
  coupon: Yup.string().optional().nullable(),
  totalAmount: Yup.number().required("Total amount is required"),
  shippingCharge: Yup.number().optional().nullable(),
  conditionFee: Yup.number().optional().nullable(),
  paymentAmount: Yup.number().required("Payment amount is required"),
  paymentMethod: Yup.string()
    .optional()
    .oneOf(["COD", "ONLINE", "EMI"], "Invalid payment method")
    .nullable(),
  bankId: Yup.number().optional().nullable(),
  emiChargeId: Yup.number().optional().nullable(),

  orderItems: Yup.array()
    .of(
      Yup.object().shape({
        productId: Yup.number().required("Product ID is required"),
        extraWarrantyId: Yup.number().optional().nullable(),
        productColorId: Yup.number().required("Product color ID is required"),
        productVariationId: Yup.number().required("Product variation ID is required"),
        quantity: Yup.number().required("Quantity is required"),
        price: Yup.number().required("Price is required"),
        subTotal: Yup.number().required("Subtotal is required"),
      })
    )
    .required("Order items are required"),

  shippingAddress: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Shipping name is required"),
        email: Yup.string().email("Invalid email").optional().nullable(),
        district: Yup.string().required("District is required"),
        city: Yup.string().required("City is required"),
        thana: Yup.string().required("Thana is required"),
        address: Yup.string().required("Address is required"),
        phone: Yup.string().required("Phone is required"),
      })
    )
    .required("Shipping address is required"),
});
export type AddEditOrderCreateFormData = Yup.InferType<typeof adminOrderSchema>;