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
import { useGetTagsQuery } from "@/components/store/api/tags/tagsApi";

type AddEditOfferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { tagId: number; offerId: number }) => void;
  currentOffer?: { tagId: number; offerId: number } | null;
  loading: boolean;
  err?: any;
};

export default function AddEditBrandOfferModal({
  isOpen,
  onClose,
  onSave,
  currentOffer,
  loading,
  err,
}: AddEditOfferModalProps) {
  const [tagId, settagId] = useState<number | null>(null);
  const [offerId, setofferId] = useState<number | null>(null);
  
  const { data: brands, isLoading: isBrandLoading } = useGetTagsQuery({
    page:1,
    size:100
  });
  
  const { data: offers, isLoading: isOfferLoading } = useGetAllOffersQuery({
    page:1,
    size:100
  });

  useEffect(() => {
    if (currentOffer) {
      settagId(currentOffer.tagId);
      setofferId(currentOffer.offerId);
    } else {
      settagId(null);
      setofferId(null);
    }
  }, [currentOffer, isOpen]);

  const handleSave = () => {
    if (!tagId || !offerId) return;
    onSave({
      tagId,
      offerId
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full min-h-[50vh] overflow-hidden py-10 px-5">
        <DialogHeader>
          <DialogTitle>{currentOffer?.tagId ? "Edit Tag Offer" : "Add Tag Offer"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Brand Dropdown */}
          <div>
            <label className="block text-sm font-medium">Select tag</label>
            <SearchableSelect
              label="Brand"
              labelFor="brand"
              value={tagId?.toString() || ""}
              onValueChange={(value) => settagId(Number(value))}
              options={brands?.data || []}
              error={""}
              loading={isBrandLoading}
              labelKey="name" // Changed from "name" to "brand" to match brand data structure
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
            disabled={!tagId || !offerId || loading}
          >
            {loading ? <ButtonLoader /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}