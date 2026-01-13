// components/ImportProductExcel.tsx
import { useUploadExcelMutation } from "@/components/store/api/products/productApi";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { useState } from "react";

export default function ImportProductExcel() {
  const [uploadExcel] = useUploadExcelMutation();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name); // Set the file name when file is selected

    const reader = new FileReader();

    reader.onload = async (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rawData: any[] = XLSX.utils.sheet_to_json(sheet);

      // Map and parse each row
      const products = rawData.map((row) => {
        return {
          productName: row.productName,
          categoryId: Number(row.categoryId),
          subCategoryId: String(row.subCategoryId)
            .split(",")
            .map((id) => Number(id.trim())),
          brandId: Number(row.brandId),
          tag: row.tag || "",
          featureId: row.featureId ? Number(row.featureId) : undefined,
          conditionId: row.conditionId ? Number(row.conditionId) : undefined,
          vendorId: row.vendorId ? Number(row.vendorId) : undefined,
          inSideDeliveryCharge: row.inSideDeliveryCharge
            ? Number(row.inSideDeliveryCharge)
            : undefined,
          outSideDeliveryCharge: row.outSideDeliveryCharge
            ? Number(row.outSideDeliveryCharge)
            : undefined,
          highlightAccessories: row.highlightAccessories
            ? JSON.parse(row.highlightAccessories)
            : [],
          gifts: row.gifts ? JSON.parse(row.gifts) : [],
          variationProducts: row.variationProducts
            ? JSON.parse(row.variationProducts)
            : [],
          sortDescription: row.sortDescription || "",
          description: row.description || "",
          inBox: row.inBox || "",
          images: row.images ? JSON.parse(row.images) : [],
          features: row.features ? JSON.parse(row.features) : [],
          highlightText: row.highlightText || "",
          whatsAppNumber: row.whatsAppNumber,
          isEmi: row.isEmi === "true" || row.isEmi === true,
          type: row.type || "Draft",
        };
      });

      try {
        await uploadExcel({ products }).unwrap();
        toast.success("Products uploaded successfully!");
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Failed to upload products.");
      } finally {
        setFileName(null); // Reset file name after upload completes or fails
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Hidden file input */}
      <input 
        type="file"
        id="file-upload"
        className="hidden"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileChange}
      />
      
      {/* Custom styled button - shows filename if selected */}
      <label 
        htmlFor="file-upload"
        className="px-4 py-1.5 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors truncate max-w-xs"
        title={fileName || "Import"}
      >
        {fileName ? (
          <span className="truncate">{fileName}</span>
        ) : (
          "Import"
        )}
      </label>
    </div>
  );
}