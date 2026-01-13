import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ButtonLoader from "@/components/loader/ButtonLoader";
interface AddEditSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, size: string) => void; // Updated to accept three arguments
  currentSize?: { id: number | null; size: string };
  loading: boolean;
  err?: any;
}

export default function AddEditSizeModal({
  isOpen,
  onClose,
  onSave,
  currentSize,
  loading,
  err,
}: AddEditSizeModalProps) {
  const [size, setSize] = useState(currentSize?.size || "");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset color, colorCode, and error state when modal opens or currentColor changes
  useEffect(() => {
    setSize(currentSize?.size || "");
    setError(null);
  }, [currentSize]);

  const handleSave = () => {
    if (size.trim() === "") {
      setError("Size name cannot be empty");
      return;
    }

    try {
      onSave(currentSize?.id || null, size.trim());
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
          <DialogTitle>{currentSize ? "Edit Size" : "Add Size"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Enter Color Name"
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
              setError(null);
            }}
            errorMessage={error || undefined}
          />
        </div>
        {/* Error Alert */}
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Size Error</AlertTitle>
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
            disabled={!size.trim()} // Corrected logic to disable if either is empty
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
