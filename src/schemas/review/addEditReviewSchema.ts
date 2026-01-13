import * as yup from "yup";

export const reviewSchema = yup.object().shape({
  userId: yup.number().required("User ID is required"),
  productId: yup.number().required("Product ID is required"),
  review: yup.string().required("Review text is required"),
  rating: yup
    .number()
    .required("Rating is required")
    .oneOf([1, 2, 3, 4, 5], "Rating must be between 1 to 5"),
});

export type ReviewFormData = yup.InferType<typeof reviewSchema>;
