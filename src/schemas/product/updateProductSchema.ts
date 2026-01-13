import * as yup from "yup";

export const editProductSchema = yup.object().shape({
  productName: yup.string().required("Product Name is required"),
  tag: yup
    .array()
    .of(yup.string().required("Each tag must be a string"))
    .required("At least one tag is required")
    .min(1, "At least one tag is required"),
  productLink: yup.string().required("Product Link is required"),
  categoryId: yup.number().required("Category ID is required"),
  subCategoryId: yup
    .array()
    .of(yup.number().typeError("Each sub-category ID must be a number"))
    .min(1, "At least one sub-category ID is required")
    .required("Sub-category ID is required"),
  brandId: yup.number().required("Brand ID is required"),
  featureId: yup.number().optional(),
  vendorId: yup.number().optional(),
  inSideDeliveryCharge: yup.number().optional(),
  outSideDeliveryCharge: yup.number().optional(),
  conditionId: yup.number().optional(),
  orderLimit: yup.number().optional(),
  sortDescription: yup.string().optional(),
  specification: yup.string().optional(),
  seoTitle: yup.string().optional(),
  seoDescription: yup.string().optional(),
  description: yup.string().optional(),
  inBox: yup.string().optional(),
  gifts: yup
    .array()
    .of(yup.number().required("Each Gift ID is required"))
    .optional(),
  images: yup
    .array()
    .of(
      yup.object().shape({
        colorId: yup.number().required("Color Key is required"),
        imageUrl: yup.string().required("Image is required"),
      })
    )
    .default([]),

  features: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().optional(),
        featureKeyId: yup.number().optional(),
        value: yup.string().optional(),
      })
    )
    .optional(),
  highlightText: yup.string().optional(),
  whatsAppNumber: yup.string().required("WhatsApp number is required"),
  type: yup
    .string()
    .oneOf(
      ["Draft", "Trust", "Published", "Upcoming"],
      "Type must be one of: Draft, Trash, Published"
    )
    .optional(),
  highlightAccessories: yup
    .array()
    .of(yup.number().required("Each accessory ID is required"))
    .optional(),
  isEmi: yup.boolean().required("Emi status is required"),
  isFullPay: yup.boolean().optional(),
  isPointUse: yup.boolean().optional(),
  freeEmiCharge: yup.number().when("isEmi", {
    is: (isEmi: boolean) => isEmi === true,
    then: (schema) =>
      schema.required("EMI duration is required when EMI is enabled"),
    otherwise: (schema) => schema.optional(),
  }),
  variationProducts: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().optional(),
        ram: yup.string().optional(),
        rom: yup.string().optional(),
        sim: yup.string().optional(),
        size: yup.string().optional(),
        strapMaterial: yup.string().optional(),
        regularWarrantyId: yup.number().optional(),
        isShippedFree: yup.boolean().optional(),
        connectivity: yup.string().optional(),
        plugType: yup.string().optional(),
        connectorType: yup.string().optional(),
        region: yup.string().optional(),
        chipset: yup.string().optional(),
        price: yup.number().optional(),
        inBox: yup.string().optional(),
        discountPrice: yup.number().optional(),
        preDiscountPrice: yup.number().optional(),
        startDate: yup.string().optional(),
        endDate: yup.string().optional(),
        regularPrice: yup.number().optional(),
        bookingPrice: yup.number().optional(),
        purchasePoint: yup.number().optional(),
        colors: yup
          .array()
          .of(
            yup.object().shape({
              id: yup.number().required("Feature ID is required"),
              colorId: yup.number().required("Color ID is required"),
              inStock: yup.boolean().required("In-stock status is required"),
              price: yup.number().optional(),
              stock: yup.number().optional(),
            })
          )
          .required("Product color ID is required"),
        extraWarranty: yup
          .array()
          .of(
            yup.object().shape({
              id: yup.number().required("Warranty ID is required"),
              name: yup.string().when("$hasWarranty", {
                is: true,
                then: (schema) => schema.required("Warranty name is required"),
                otherwise: (schema) => schema.optional(),
              }),
              price: yup.number().when("$hasWarranty", {
                is: true,
                then: (schema) => schema.required("Warranty price is required"),
                otherwise: (schema) => schema.optional(),
              }),
            })
          )
          .default([]),
      })
    )
    .required("Variation products are required"),
});

export type editProductFormData = yup.InferType<typeof editProductSchema>;
