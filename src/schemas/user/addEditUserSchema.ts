import * as Yup from "yup";

// Define validation schema using Yup
export const addEditUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  contactNo: Yup.string().optional(),
  role: Yup.string()
    .required("Role is required")
    .oneOf(
      [
        "SUPER_ADMIN",
        "OPERATION_ADMIN",
        "OPERATION_MANAGER",
        "SUPPORT_EXECUTIVE",
        "USER",
      ],
      "Invalid role"
    ),
  dateOfBirth: Yup.string().optional(),
  gender: Yup.string()
    .oneOf(["Male", "Female", "Others"], "Invalid gender")
    .optional(),
  maritalStatus: Yup.string()
    .oneOf(["Married", "Unmarried", "Divorce"], "Invalid marital status")
    .optional(),
  bloodGroup: Yup.string().optional(),
  address: Yup.string().optional(),
  fileAttachment: Yup.string().optional(),
  avatar: Yup.string().optional(),
  active: Yup.boolean().optional(),
});

// Correctly define the type using Yup's `InferType`
export type UserFormData = Yup.InferType<typeof addEditUserSchema>;
