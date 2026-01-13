import * as Yup from "yup";

export const addEditPageSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  slug: Yup.string().required("Slug is required"),
  content: Yup.string().required("Content is required"),
  seoTitle: Yup.string().optional().nullable(), // equivalent to Joi.allow("")
  seoDescription: Yup.string().optional().nullable(),
  status: Yup.string()
    .required("Status is required")
    .oneOf(["Draft", "Trust", "Published"], "Invalid status"),
});

// Type inference
export type PageFormData = Yup.InferType<typeof addEditPageSchema>;
