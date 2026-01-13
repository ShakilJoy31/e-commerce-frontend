import { z } from "zod";

export const addressSchema = z.object({
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  zipCode: z.string().min(1, { message: "Postcode / ZIP is required" }),
  district: z.string().min(1, { message: "District is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
});
