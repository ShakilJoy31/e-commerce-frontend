import { z } from "zod";

export const checkoutSchema = z.object({
  userId: z.number().optional(),
  note: z.string().optional(),
  totalAmount: z.number().nonnegative("Total amount is required"),
  shippingCharge: z.number().optional(),
  orderItems: z
    .array(
      z.object({
        productId: z.number().nonnegative("Product ID is required"),
        quantity: z.number().nonnegative("Quantity is required"),
        price: z.number().nonnegative("Price is required"),
        subTotal: z.number().nonnegative("Subtotal is required"),
      })
    )
    .min(1, "Order items must include at least one item"), 
  billingAddress: z
    .array(
      z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        zipCode: z.string().min(1, "Zip code is required"),
        district: z.string().min(1, "District is required"),
        phone: z.string().min(1, "Phone number is required"),
        email: z.string().email("Valid email is required"),
      })
    )
    .min(1, "At least one billing address is required"), 
  shippingAddress: z
    .array(
      z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        zipCode: z.string().min(1, "Zip code is required"),
        district: z.string().min(1, "District is required"),
        phone: z.string().min(1, "Phone number is required"),
        email: z.string().email("Valid email is required"),
      })
    )
    .min(1, "At least one shipping address is required"), 
});

export type CheckoutDataProps = z.infer<typeof checkoutSchema>;
