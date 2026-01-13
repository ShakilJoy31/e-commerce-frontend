import ButtonLoader from "@/components/loader/ButtonLoader";
import { useGetSearchProductsQuery } from "@/components/store/api/products/productApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import SearchableSelect from "../products/SearchableSelect";
import { useGetSectionsQuery } from "@/components/store/api/section/sectionApi";

interface AddEditSectionWiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: {
    id: number | null;
    sectionId: number;
    productId: number;
  }) => void;
  currentSection?: {
    id: number | null;
    sectionId: number;
    productId: number;
  };
  loading: boolean;
  err?: FetchBaseQueryError | SerializedError;
}

export default function AddEditSectionWiseModal({
  isOpen,
  onClose,
  onSave,
  currentSection,
  loading,
  err,
}: AddEditSectionWiseModalProps) {
  const [sectionId, setSectionId] = useState<number | "">(
    currentSection?.sectionId || ""
  );
  const [productId, setProductId] = useState<number | "">(
    currentSection?.productId || ""
  );

  const { toast } = useToast();

  const { data: products, isLoading: productLoading } = useGetSearchProductsQuery({
    page: 1,
    size: 10000,
  });
  const { data: sections, isLoading: sectionLoading } = useGetSectionsQuery({
    page: 1,
    size: 100,
  });

  // Reset state when modal opens or currentSection changes
  useEffect(() => {
    setSectionId(currentSection?.sectionId || "");
    setProductId(currentSection?.productId || "");
  }, [currentSection, isOpen]);

  const handleSave = async () => {
    if (!sectionId || !productId) {
      toast({
        title: "Error",
        description: "Both Section and Product are required",
        variant: "destructive",
      });
      return;
    }

    try {
      onSave({
        id: currentSection?.id || null,
        sectionId: Number(sectionId),
        productId: Number(productId),
      });
    } catch (error) {
      console.error("Error saving section-wise product:", error);
      toast({
        title: "Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-h-[60vh]">
        <DialogHeader>
          <DialogTitle>
            {currentSection
              ? "Edit Section Wise Product"
              : "Add Section Wise Product"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="min-w-80">
            <label htmlFor="">Select a section <span className="text-red-600">✽</span></label>
            <SearchableSelect
              label={"Select section"}
              labelFor="section_select"
              onValueChange={(value) => {
                setSectionId(value ? Number(value) : "");
              }}
              value={sectionId !== "" ? String(sectionId) : ""}
              options={sections?.data ?? []}
              loading={sectionLoading}
              labelKey="name"
            />
          </div>
          <div className="min-w-80">
            <label htmlFor="">Select a product <span className="text-red-600">✽</span></label>
            <SearchableSelect
              label={"Select product"}
              labelFor="product_select"
              onValueChange={(value) => {
                setProductId(value ? Number(value) : "");
              }}
              value={productId !== "" ? String(productId) : ""}
              options={products?.data ?? []}
              loading={productLoading}
              labelKey="productName"
            />
          </div>
        </div>

        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {(err.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-500 text-white"
            disabled={!sectionId || !productId || loading}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}