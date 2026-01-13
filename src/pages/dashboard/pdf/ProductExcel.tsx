import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";

const ProductExcel = ({ data }: any) => {
  if (!data || !data.length) {
    return (
      <Button disabled variant={"secondary"} size="xs">
        Export
      </Button>
    );
  }

  // Flatten and format data for CSV export
  const combinedData = data.map((product: any) => ({
    productName: product.productName,
    categoryId: product.categoryId,
    subCategoryId: product.subCategoryId?.join(",") || "",
    brandId: product.brandId,
    tag: product.tag || "",
    featureId: product.featureId || "",
    conditionId: product.conditionId || "",
    vendorId: product.vendorId || "",
    inSideDeliveryCharge: product.inSideDeliveryCharge || "",
    outSideDeliveryCharge: product.outSideDeliveryCharge || "",
    highlightAccessories: JSON.stringify(product.highlightAccessories || []),
    gifts: JSON.stringify(product.gifts || []),
    variationProducts: JSON.stringify(product.variationProducts || []),
    sortDescription: product.sortDescription || "",
    description: product.description || "",
    inBox: product.inBox || "",
    images: JSON.stringify(product.images || []),
    features: JSON.stringify(product.features || []),
    highlightText: product.highlightText || "",
    whatsAppNumber: product.whatsAppNumber,
    isEmi: product.isEmi,
    type: product.type || "Draft",
  }));

  const headers = [
    { label: "Product Name", key: "productName" },
    { label: "Category ID", key: "categoryId" },
    { label: "Sub Category ID", key: "subCategoryId" },
    { label: "Brand ID", key: "brandId" },
    { label: "Tag", key: "tag" },
    { label: "Feature ID", key: "featureId" },
    { label: "Condition ID", key: "conditionId" },
    { label: "Vendor ID", key: "vendorId" },
    { label: "Inside Delivery Charge", key: "inSideDeliveryCharge" },
    { label: "Outside Delivery Charge", key: "outSideDeliveryCharge" },
    { label: "Highlight Accessories", key: "highlightAccessories" },
    { label: "Gifts", key: "gifts" },
    { label: "Variation Products", key: "variationProducts" },
    { label: "Sort Description", key: "sortDescription" },
    { label: "Description", key: "description" },
    { label: "In Box", key: "inBox" },
    { label: "Images", key: "images" },
    { label: "Features", key: "features" },
    { label: "Highlight Text", key: "highlightText" },
    { label: "WhatsApp Number", key: "whatsAppNumber" },
    { label: "Is EMI", key: "isEmi" },
    { label: "Type", key: "type" },
  ];

  return (
    <CSVLink
      data={combinedData}
      headers={headers}
      filename={"product_template.csv"}
      className="no-underline"
    >
      <Button variant={"outline"} size="sm" className="p-3">
        Export
      </Button>
    </CSVLink>
  );
};

export default ProductExcel;
