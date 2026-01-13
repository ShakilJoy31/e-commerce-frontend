import { z } from "zod";

export const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required."),
  address: z.string().min(1, "Address is required."),
  phone: z.string().min(1, "Phone number is required."),
  phone2: z.string().min(1, "Phone two number is required."),
  email: z.string().email("Invalid email address."),
  logo: z
    .any()
    .refine(
      (value) => value instanceof File || (typeof value === "string" && value),
      "Logo is required."
    ),
  footerLogo: z
    .any()
    .refine(
      (value) => value instanceof File || (typeof value === "string" && value),
      "Footer logo is required."
    ),
  bannerOne: z
    .any()
    .refine(
      (value) => value instanceof File || (typeof value === "string" && value),
      "Banner One is required."
    ),
  bannerTwo: z
    .any()
    .refine(
      (value) => value instanceof File || (typeof value === "string" && value),
      "Banner Two is required."
    ),
 
});
