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
import { useGetAllCategoryQuery } from "@/components/store/api/category/categoryApi";
import { useGetAllOffersQuery } from "@/components/store/api/products/offerApi";
import SearchableSelect from "../products/SearchableSelect";

type AddEditOfferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { categoryId: number; offerId: number }) => void;
  currentOffer?: { categoryId: number; offerId: number } | null;
  loading: boolean;
  err?: any;
};

export default function AddEditCategoryOfferModal({
  isOpen,
  onClose,
  onSave,
  currentOffer,
  loading,
  err,
}: AddEditOfferModalProps) {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [offerId, setofferId] = useState<number | null>(null);

  const { data: categories, isLoading: isCategoryLoading } =
    useGetAllCategoryQuery({
      page: 1,
      size: 100,
    });
  const { data: offers, isLoading: isOfferLoading } = useGetAllOffersQuery({
    page: 1,
    size: 100,
  });

  useEffect(() => {
    if (currentOffer) {
      setCategoryId(currentOffer.categoryId);
      setofferId(currentOffer.offerId);
    } else {
      setCategoryId(null);
      setofferId(null);
    }
  }, [currentOffer, isOpen]);

  const handleSave = () => {
    if (!categoryId || !offerId) return;
    onSave({
      categoryId,
      offerId,
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full min-h-[50vh] overflow-hidden py-10 px-5">
        <DialogHeader>
          <DialogTitle>
            {currentOffer?.categoryId
              ? "Edit Category Offer"
              : "Add Category Offer"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium">Select category</label>
            <SearchableSelect
              label="Category"
              labelFor="category"
              value={categoryId?.toString() || ""}
              onValueChange={(value) => setCategoryId(Number(value))}
              options={categories?.data || []}
              error={""}
              loading={isCategoryLoading}
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
            disabled={!categoryId || !offerId || loading}
          >
            {loading ? <ButtonLoader /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
