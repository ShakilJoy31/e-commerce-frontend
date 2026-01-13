import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useToast } from "@/components/ui/use-toast";

interface AddEditDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: number | null,
    code: string,
    discountType: "FIXED" | "PERCENTAGE",
    discount: number,
    expireDate: string
  ) => void;
  currentDiscount?: {
    id: number | null;
    code: string;
    discountType: "FIXED" | "PERCENTAGE";
    discount: number;
    expireDate: string;
  };
  loading: boolean;
  err?: any;
}

export default function AddEditDiscountModal({
  isOpen,
  onClose,
  onSave,
  currentDiscount,
  loading,
  err,
}: AddEditDiscountModalProps) {
  const [code, setCode] = useState(currentDiscount?.code || "");
  const [discountType, setDiscountType] = useState<"FIXED" | "PERCENTAGE">(
    currentDiscount?.discountType || "FIXED"
  );
  const [discount, setDiscount] = useState(currentDiscount?.discount || 0);
  const [expireDate, setExpireDate] = useState(
    currentDiscount?.expireDate || ""
  );
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset fields when modal opens or currentDiscount changes
  useEffect(() => {
    if (currentDiscount) {
      setCode(currentDiscount.code);
      setDiscountType(currentDiscount.discountType);
      setDiscount(currentDiscount.discount);
      setExpireDate(currentDiscount.expireDate);
    }
    setError(null); // Reset error state
  }, [currentDiscount]);

  const handleSave = () => {
    if (code.trim() === "" || expireDate.trim() === "") {
      setError("All fields are required");
      return;
    }

    try {
      onSave(
        currentDiscount?.id || null,
        code.trim(),
        discountType,
        discount,
        expireDate.trim()
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentDiscount ? "Edit Discount" : "Add Discount"}
          </DialogTitle>
        </DialogHeader>

        {/* Inputs for Discount */}
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter Discount Code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
            }}
            errorMessage={error || undefined}
          />

          <div>
            <label
              htmlFor="discountType"
              className="block mb-2 text-sm font-medium"
            >
              Discount Type
            </label>
            <select
              id="discountType"
              value={discountType}
              onChange={(e) =>
                setDiscountType(e.target.value as "FIXED" | "PERCENTAGE")
              }
              className="border px-3 py-2 rounded-md w-full"
            >
              <option value="FIXED">Fixed</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
          </div>

          <InputField
            type="number"
            placeholder="Enter Discount Value"
            value={discount.toString()}
            onChange={(e) => {
              setDiscount(Number(e.target.value));
              setError(null);
            }}
            errorMessage={error || undefined}
          />

          <InputField
            type="date"
            placeholder="Enter Expiry Date"
            value={expireDate}
            onChange={(e) => {
              setExpireDate(e.target.value);
              setError(null);
            }}
            errorMessage={error || undefined}
          />
        </div>

        {/* Error Alert */}
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Discount Error</AlertTitle>
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
            disabled={!code.trim() || !expireDate.trim()}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
