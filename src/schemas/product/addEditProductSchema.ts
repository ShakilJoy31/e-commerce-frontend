import * as yup from "yup";

export const addEditProductSchema = yup.object().shape({
  productName: yup.string().required("Product Name is required"),
  tag: yup
    .array()
    .of(yup.string().required("Each tag must be a string"))
    .required("At least one tag is required")
    .min(1, "At least one tag is required"),
  categoryId: yup.number().required("Category ID is required"),
  subCategoryId: yup
    .array()
    .of(yup.number().typeError("Each sub-category ID must be a number"))
    .min(1, "At least one sub-category ID is required")
    .required("Sub-category ID is required"),
  brandId: yup.number().required("Brand ID is required"),
  featureId: yup.number().optional(),
  orderLimit: yup.number().optional(),
  vendorId: yup.number().optional(),
  conditionId: yup.number().optional(),
  isFullPay: yup.boolean().optional(),
  isPointUse: yup.boolean().optional(),
  inSideDeliveryCharge: yup.number().optional(),
  outSideDeliveryCharge: yup.number().optional(),
  sortDescription: yup.string().optional(),
  specification: yup.string().optional(),
  seoDescription: yup.string().optional(),
  seoTitle: yup.string().optional(),
  description: yup.string().optional(),
  inBox: yup.string().optional(),
  images: yup.array().of(
    yup.object().shape({
      colorId: yup
        .number()
        .required("Color ID is required")
        .positive("Color ID must be a positive number")
        .min(1, "Color ID must be valid"),
      imageUrl: yup
        .string()
        .required("Image URL is required")
        .min(1, "Image URL must be provided"),
    })
  ),

  features: yup
    .array()
    .of(
      yup.object().shape({
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
  gifts: yup
    .array()
    .of(yup.number().required("Each Gift ID is required"))
    .optional(),
  isEmi: yup.boolean().required("Emi status is required"),
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
        ram: yup.string().optional(),
        rom: yup.string().optional(),
        sim: yup.string().optional(),
        size: yup.string().optional(),
        region: yup.string().optional(),
        chipset: yup.string().optional(),
        strapMaterial: yup.string().optional(),
        connectivity: yup.string().optional(),
        plugType: yup.string().optional(),
        regularWarrantyId: yup.number().optional(),
        connectorType: yup.string().optional(),
        isShippedFree: yup.boolean().optional(),

        price: yup.number().optional(),
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

export type AddEditProductFormData = yup.InferType<typeof addEditProductSchema>;
