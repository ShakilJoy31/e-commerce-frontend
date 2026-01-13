import * as Yup from 'yup';

// Define validation schema using Yup
export const editUserSchema = Yup.object().shape({
  name: Yup.string().optional().nullable(),
  email: Yup.string().email('Invalid email format').optional().nullable(),
  password: Yup.string().optional().nullable(),
  contactNo: Yup.string().optional().nullable(),
  role: Yup.string()
    .optional()
    .oneOf(['SUPER_ADMIN', 'OPERATION_ADMIN', 'OPERATION_MANAGER', 'SUPPORT_EXECUTIVE', 'USER'], 'Invalid role'),
  dateOfBirth: Yup.string().optional().nullable(),
  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Others'], 'Invalid gender')
    .optional()
    .nullable(),
  maritalStatus: Yup.string()
    .oneOf(['Married', 'Unmarried', 'Divorce'], 'Invalid marital status')
    .optional()
    .nullable(),
  bloodGroup: Yup.string().optional().nullable(),
  address: Yup.string().optional().nullable(),
  fileAttachment: Yup.string().optional().nullable(),
  avatar: Yup.string().optional().nullable(),
  active: Yup.boolean().optional(),
});

// Correctly define the type using Yup's `InferType`
export type EditUserFormData = Yup.InferType<typeof editUserSchema>;
