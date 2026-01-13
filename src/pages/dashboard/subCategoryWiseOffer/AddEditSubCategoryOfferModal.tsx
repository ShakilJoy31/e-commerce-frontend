import { useEffect, useState } from "react";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useGetAllOffersQuery } from "@/components/store/api/products/offerApi";
import SearchableSelect from "../products/SearchableSelect";
import { useGetSubCategoryQuery } from "@/components/store/api/subCategory/subCategoryApi";

type AddEditOfferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { subCategoryId: number; offerId: number }) => void;
  currentOffer?: { subCategoryId: number; offerId: number } | null;
  loading: boolean;
  err?: any;
};

export default function AddEditSubCategoryOfferModal({
  isOpen,
  onClose,
  onSave,
  currentOffer,
  loading,
  err,
}: AddEditOfferModalProps) {
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [offerId, setofferId] = useState<number | null>(null);

  const { data: subcategories, isLoading: isSubCategoryLoading } =
    useGetSubCategoryQuery({
      page: 1,
      size: 200,
    });
  const { data: offers, isLoading: isOfferLoading } = useGetAllOffersQuery({
    page: 1,
    size: 200,
  });

  useEffect(() => {
    if (currentOffer) {
      setSubCategoryId(currentOffer.subCategoryId);
      setofferId(currentOffer.offerId);
    } else {
      setSubCategoryId(null);
      setofferId(null);
    }
  }, [currentOffer, isOpen]);

  const handleSave = () => {
    if (!subCategoryId || !offerId) return;
    onSave({
      subCategoryId,
      offerId,
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full min-h-[50vh] overflow-hidden py-10 px-5">
        <DialogHeader>
          <DialogTitle>
            {currentOffer?.subCategoryId
              ? "Edit Category Offer"
              : "Add Category Offer"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium">
              Select subcategory
            </label>
            <SearchableSelect
              label="SubCategory"
              labelFor="SubCategory"
              value={subCategoryId?.toString() || ""}
              onValueChange={(value) => setSubCategoryId(Number(value))}
              options={subcategories?.data || []}
              error={""}
              loading={isSubCategoryLoading}
              labelKey="name"
            />
          </div>

          {/* Offer Dropdown */}
          <div>
            <label className="block text-sm font-medium">Select offer</label>
            <SearchableSelect
              label="Offer"
              labelFor="offer"
              value={offerId?.toString() || ""}
              onValueChange={(value) => setofferId(Number(value))}
              options={offers?.data || []}
              error={""}
              loading={isOfferLoading}
              labelKey="offerName"
            />
          </div>
        </div>

        {/* Error Alert */}
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
            disabled={!subCategoryId || !offerId || loading}
          >
            {loading ? <ButtonLoader /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
