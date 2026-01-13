import { ILabelPlaceholder } from "@/utils/common/formType";

interface addEditProductForm {
  productName: ILabelPlaceholder;
  productType: ILabelPlaceholder;
  categoryId: ILabelPlaceholder;
  subCategoryId: ILabelPlaceholder;
  brandId: ILabelPlaceholder;
  colorId: ILabelPlaceholder;
  description: ILabelPlaceholder;
  images: ILabelPlaceholder;
  features: ILabelPlaceholder;
  price: ILabelPlaceholder;
  discountPrice: ILabelPlaceholder;
  stock: ILabelPlaceholder;
  highlightText: ILabelPlaceholder;
  whatsAppNumber: ILabelPlaceholder;
  featureId:ILabelPlaceholder;
  conditionId: ILabelPlaceholder;
  vendorId:ILabelPlaceholder;
  tag:ILabelPlaceholder
}

export const ADD_EDIT_PRODUCT_FORM: addEditProductForm = {
  productName: {
    label: "Enter Product Name ✽",
    placeholder: "Enter product name",
  },
  tag: {
    label: "Select Tag Name ✽",
    placeholder: "Select tag name",
  },
  productType: {
    label: "Select Product Type",
    placeholder: "Select product type",
  },
  categoryId: {
    label: "Select Category ✽",
    placeholder: "Select category",
  },
  subCategoryId: {
    label: "Select Sub-category ✽",
    placeholder: "Select Sub-category",
  },
  brandId: {
    label: "Select Brand ✽",
    placeholder: "Select brand",
  },
  featureId: {
    label: "Select Feature",
    placeholder: "Select feature",
  },
  vendorId: {
    label: "Select Vendor",
    placeholder: "Select vendor",
  },
  conditionId: {
    label: "Select Condition",
    placeholder: "Select condition",
  },
  highlightText: {
    label: "Hightlight text",
    placeholder: "Write hightlight text",
  },
  whatsAppNumber: {
    label: "WhatsApp number ✽",
    placeholder: "Write whatsapp number",
  },
  colorId: {
    label: "Select Color ✽",
    placeholder: "Select color",
  },
  description: {
    label: "Enter Product Description",
    placeholder: "Enter product description (optional)",
  },
  images: {
    label: "Upload Product Images (1000x1000px) ✽",
    placeholder: "Add product images",
  },
  features: {
    label: "Select Attribute",
    placeholder: "Select attribute key ID and value",
  },
  price: {
    label: "Enter Product Price ✽",
    placeholder: "Enter product price",
  },
  discountPrice: {
    label: "Enter Discount Price",
    placeholder: "Enter discount price (optional)",
  },
  stock: {
    label: "Enter Product Stock",
    placeholder: "Enter product stock (optional)",
  },
};
