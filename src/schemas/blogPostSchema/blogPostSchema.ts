import * as yup from "yup";

export interface BlogFormData {
  status: "Draft" | "Trust" | "Published";
  title: string;
  author: string;
  categoryId: number;
  tagId: number;
  content: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  alt?: string
}

export const blogSchema: yup.ObjectSchema<BlogFormData> = yup.object({
  status: yup.string().oneOf(["Draft", "Trust", "Published"]).required(),
  title: yup.string().required(),
  author: yup.string().required(),
  categoryId: yup.number().required(),
  tagId: yup.number().required(),
  content: yup.string().required(),
  image: yup.string().url().optional(),
  seoTitle: yup.string().optional(),
  seoDescription: yup.string().optional(),
  alt: yup.string().optional(),
});
